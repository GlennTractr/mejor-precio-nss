import { NextRequest } from 'next/server';
import createServerClient from '@/lib/supabase/server';

interface ProductVariant {
  id: string;
  title: string;
  specValue: string;
  specLabel: string;
  imageUrl: string;
  productSlug: string;
  allSpecs: Array<{ type: string; label: string }>;
}

interface VariantGroup {
  specType: string;
  specTypeLabel: string;
  currentValue: string;
  variants: ProductVariant[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('product_id') || '';
  const categorySlug = searchParams.get('category_slug') || '';
  const brand = searchParams.get('brand') || '';
  const model = searchParams.get('model') || '';
  const currentSpecs = searchParams.get('current_specs') || '';

  if (!productId || !categorySlug || !brand || !model || !currentSpecs) {
    return Response.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    // Parse current product specs
    let currentSpecsArray: Array<{ type: string; label: string }> = [];
    try {
      currentSpecsArray = JSON.parse(currentSpecs);
    } catch {
      return Response.json({ error: 'Invalid current_specs format' }, { status: 400 });
    }

    if (!currentSpecsArray.length) {
      return Response.json({ variantGroups: [] });
    }

    const supabase = await createServerClient();
    const variantGroups: VariantGroup[] = [];

    // For each spec type in current product, create a variant group
    for (const currentSpec of currentSpecsArray) {
      const { type: specType, label: specValue } = currentSpec;

      try {
        // Query for products with same category, brand, model but different spec values
        const { data: products, error } = await supabase
          .from('product_view')
          .select('id, title, product_slug, main_image_bucket, main_image_path, specs, best_price_per_unit')
          .eq('category_slug', categorySlug)
          .eq('brand', brand)
          .eq('model', model)
          .neq('id', productId)
          .order('best_price_per_unit', { ascending: true });

        if (error) {
          console.error(`Error fetching variants for spec type ${specType}:`, error);
          continue;
        }

        if (products && products.length > 0) {
          // Filter products to find variants for this spec type
          const variants: ProductVariant[] = [];
          
          for (const product of products) {
            if (!product.specs) continue;
            
            // Parse specs JSON
            let productSpecs: Array<{ type: string; label: string }> = [];
            try {
              productSpecs = Array.isArray(product.specs) ? (product.specs as Array<{ type: string; label: string }>) : [];
            } catch {
              continue;
            }

            // Check if this product has the target spec type with a different value
            const targetSpec = productSpecs.find(spec => spec.type === specType);
            if (!targetSpec || targetSpec.label === specValue) {
              continue; // Skip if no target spec or same value as current
            }

            // Check if all other specs match (for proper variant grouping)
            const otherCurrentSpecs = currentSpecsArray.filter(spec => spec.type !== specType);
            const matchesOtherSpecs = otherCurrentSpecs.every(currentOtherSpec => 
              productSpecs.some(productSpec => 
                productSpec.type === currentOtherSpec.type && 
                productSpec.label === currentOtherSpec.label
              )
            );

            if (matchesOtherSpecs) {
              const imageUrl = product.main_image_bucket && product.main_image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${product.main_image_bucket}/${product.main_image_path}`
                : '';

              variants.push({
                id: product.id || '',
                title: product.title || '',
                specValue: targetSpec.label,
                specLabel: targetSpec.label,
                imageUrl,
                productSlug: product.product_slug || '',
                allSpecs: productSpecs
              });
            }
          }

          // Only add group if we have variants
          if (variants.length > 0) {
            // Remove duplicates based on spec value
            const uniqueVariants = variants.filter((variant, index, self) =>
              index === self.findIndex(v => v.specValue === variant.specValue)
            );

            // Sort variants by spec value for consistent ordering
            uniqueVariants.sort((a, b) => a.specValue.localeCompare(b.specValue, 'es'));

            variantGroups.push({
              specType,
              specTypeLabel: getSpecTypeLabel(specType),
              currentValue: specValue,
              variants: uniqueVariants
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching variants for spec type ${specType}:`, error);
        // Continue with other spec types even if one fails
      }
    }

    return Response.json({ variantGroups });
  } catch (error) {
    console.error('Product variants API error:', error);
    return Response.json({ error: 'Failed to fetch product variants' }, { status: 500 });
  }
}

// Helper function to get Spanish labels for spec types
function getSpecTypeLabel(specType: string): string {
  const labels: Record<string, string> = {
    gender: 'Género',
    step: 'Paso',
    size: 'Talla',
    color: 'Color',
    flavor: 'Sabor',
    scent: 'Aroma',
    type: 'Tipo',
    variant: 'Variante',
    style: 'Estilo',
    capacity: 'Capacidad',
    format: 'Formato'
  };

  return labels[specType.toLowerCase()] || specType.charAt(0).toUpperCase() + specType.slice(1);
}