-- ============================================================================
-- SellContext View for Typesense Integration
-- ============================================================================
-- This migration creates a new view that provides SellContext-level data
-- for Typesense indexing, enabling shop-specific filtering and pricing.

-- ============================================================================
-- 1. Create SellContext View for Typesense
-- ============================================================================

CREATE OR REPLACE VIEW "public"."sellcontext_view" WITH ("security_invoker"='on') AS
SELECT 
    -- Primary identifiers
    psc.id as sellcontext_id,
    psc.packaging as packaging_id,
    pp.product as product_id,
    psc.shop as shop_id,
    
    -- Pricing information
    (psc.price / NULLIF(pp.quantity, 1)) AS price_per_unit,
    NULL::text AS currency,
    psc.link as product_link,
    
    -- Denormalized Product fields (for search and filtering)
    p.title as product_title,
    pb.label as brand,
    pm.label as model,
    pc.label as category,
    pc.slug as category_slug,
    regexp_replace(lower(unaccent(p.title)), ' ', '-', 'g') as product_slug,
    
    -- Denormalized Packaging fields
    pp.quantity as packaging_quantity,
    pp.type as packaging_type,
    NULL::text as packaging_unit,
    
    -- Shop information
    s.label as shop_name,
    regexp_replace(lower(unaccent(s.label)), ' ', '-', 'g') as shop_slug,
    
    -- Product specifications (as JSON for Typesense)
    COALESCE(
        json_agg(
            json_build_object(
                'type', ps.type,
                'label', ps.label
            )
        ) FILTER (WHERE ps.label IS NOT NULL),
        '[]'::json
    ) as specifications,
    
    -- Image information
    f.file_bucket as main_image_bucket,
    f.file_path as main_image_path,
    
    -- Timestamps
    psc.created_at,
    psc.created_at as updated_at,
    
    -- Additional computed fields for Typesense
    -- Category hierarchy for better filtering
    json_build_object(
        'id', pc.id,
        'name', pc.label,
        'slug', pc.slug
    ) as category_info,
    
    -- Brand information
    json_build_object(
        'id', pb.id,
        'name', pb.label
    ) as brand_info,
    
    -- Model information
    json_build_object(
        'id', pm.id,
        'name', pm.label,
        'brand_id', pb.id
    ) as model_info,
    
    -- Shop information as JSON
    json_build_object(
        'id', s.id,
        'name', s.label,
        'slug', regexp_replace(lower(unaccent(s.label)), ' ', '-', 'g')
    ) as shop_info,
    
    -- Packaging information as JSON
    json_build_object(
        'id', pp.id,
        'quantity', pp.quantity,
        'type', pp.type,
        'price_per_unit', (psc.price / NULLIF(pp.quantity, 1))
    ) as packaging_info

FROM public."ProductSellContext" psc
-- Join with packaging
INNER JOIN public."ProductPackaging" pp ON psc.packaging = pp.id
-- Join with product
INNER JOIN public."Product" p ON pp.product = p.id
-- Join with model to get brand and category
INNER JOIN public."ProductModel" pm ON p.model = pm.id
INNER JOIN public."ProductBrand" pb ON pm.brand = pb.id
INNER JOIN public."ProductCategory" pc ON pm.category = pc.id
-- Join with shop information
LEFT JOIN public."Shop" s ON psc.shop = s.id
-- Join with main product image
LEFT JOIN public."File" f ON p.image = f.id
-- Join with product specifications
LEFT JOIN public."ProductSpecsMapping" psm ON p.id = psm.product_id
LEFT JOIN public."ProductSpecs" ps ON psm.spec_id = ps.id

-- Only include active sell contexts with valid pricing
WHERE (psc.price / NULLIF(pp.quantity, 1)) > 0 
  AND (psc.price / NULLIF(pp.quantity, 1)) IS NOT NULL
  AND pp.quantity > 0
  AND pp.quantity IS NOT NULL

GROUP BY 
    psc.id, psc.packaging, pp.product, psc.shop,
    psc.price, psc.link,
    p.title, pb.label, pm.label, pc.label, pc.slug, pc.id,
    pp.quantity, pp.type, pp.id,
    s.id, s.label,
    f.file_bucket, f.file_path,
    psc.created_at,
    pb.id, pm.id;

-- ============================================================================
-- 2. Create indexes for better performance
-- ============================================================================

-- Index on the underlying tables to improve view performance
CREATE INDEX IF NOT EXISTS idx_sellcontext_view_performance 
ON public."ProductSellContext" (packaging, shop) 
WHERE price > 0;

CREATE INDEX IF NOT EXISTS idx_packaging_product_performance 
ON public."ProductPackaging" (product, quantity) 
WHERE quantity > 0;

-- ============================================================================
-- 3. Grant permissions for the new view
-- ============================================================================

GRANT SELECT ON TABLE public.sellcontext_view TO anon;
GRANT SELECT ON TABLE public.sellcontext_view TO authenticated;
GRANT ALL ON TABLE public.sellcontext_view TO service_role;

-- ============================================================================
-- 4. Create materialized view for better performance (optional)
-- ============================================================================

-- For high-performance scenarios, you can create a materialized view
-- Comment out if you prefer the regular view for real-time updates

/*
CREATE MATERIALIZED VIEW IF NOT EXISTS public.sellcontext_materialized_view AS
SELECT * FROM public.sellcontext_view;

-- Create indexes on materialized view
CREATE INDEX IF NOT EXISTS idx_sellcontext_mat_product_id 
ON public.sellcontext_materialized_view (product_id);

CREATE INDEX IF NOT EXISTS idx_sellcontext_mat_category_slug 
ON public.sellcontext_materialized_view (category_slug);

CREATE INDEX IF NOT EXISTS idx_sellcontext_mat_brand 
ON public.sellcontext_materialized_view (brand);

CREATE INDEX IF NOT EXISTS idx_sellcontext_mat_shop_id 
ON public.sellcontext_materialized_view (shop_id);

CREATE INDEX IF NOT EXISTS idx_sellcontext_mat_price 
ON public.sellcontext_materialized_view (price_per_unit);

-- Grant permissions for materialized view
GRANT SELECT ON TABLE public.sellcontext_materialized_view TO anon;
GRANT SELECT ON TABLE public.sellcontext_materialized_view TO authenticated;
GRANT ALL ON TABLE public.sellcontext_materialized_view TO service_role;

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION public.refresh_sellcontext_materialized_view()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.sellcontext_materialized_view;
END;
$$;

-- Schedule refresh every hour (adjust as needed)
SELECT cron.schedule(
    'refresh-sellcontext-view',
    '0 * * * *',
    'SELECT public.refresh_sellcontext_materialized_view();'
);
*/

-- ============================================================================
-- 5. Create helper functions for Typesense integration
-- ============================================================================

-- Function to get sellcontext data in format suitable for Typesense
CREATE OR REPLACE FUNCTION public.get_sellcontext_for_typesense(
    p_limit INTEGER DEFAULT 1000,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
    id TEXT,
    product_id TEXT,
    packaging_id TEXT,
    shop_id TEXT,
    product_title TEXT,
    brand TEXT,
    model TEXT,
    category TEXT,
    category_slug TEXT,
    product_slug TEXT,
    packaging_quantity INTEGER,
    packaging_type TEXT,
    packaging_unit TEXT,
    price_per_unit NUMERIC,
    shop_name TEXT,
    shop_slug TEXT,
    specifications TEXT, -- JSON as TEXT for Typesense
    main_image_bucket TEXT,
    main_image_path TEXT,
    created_at BIGINT,
    updated_at BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sv.sellcontext_id::TEXT,
        sv.product_id::TEXT,
        sv.packaging_id::TEXT,
        sv.shop_id::TEXT,
        sv.product_title,
        sv.brand,
        sv.model,
        sv.category,
        sv.category_slug,
        sv.product_slug,
        sv.packaging_quantity,
        sv.packaging_type,
        sv.packaging_unit,
        sv.price_per_unit,
        sv.shop_name,
        sv.shop_slug,
        sv.specifications::TEXT,
        sv.main_image_bucket,
        sv.main_image_path,
        EXTRACT(EPOCH FROM sv.created_at)::BIGINT,
        EXTRACT(EPOCH FROM sv.updated_at)::BIGINT
    FROM public.sellcontext_view sv
    ORDER BY sv.updated_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- Function to count total sellcontext records
CREATE OR REPLACE FUNCTION public.count_sellcontext_for_typesense()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM public.sellcontext_view;
    RETURN total_count;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_sellcontext_for_typesense(INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.count_sellcontext_for_typesense() TO service_role;

-- ============================================================================
-- Migration Summary
-- ============================================================================

-- This migration creates:
-- 1. ✅ sellcontext_view - Main view with SellContext-level data for Typesense
-- 2. ✅ Performance indexes for efficient querying
-- 3. ✅ Helper functions for Typesense data export
-- 4. ✅ Optional materialized view for high-performance scenarios
-- 5. ✅ Proper permissions for all database roles

-- The view provides:
-- - One row per SellContext (enabling shop filtering)
-- - Denormalized product, packaging, and shop data
-- - JSON specifications for Typesense
-- - All necessary fields for the new schema
-- - Efficient structure for grouping by product_id in Typesense queries

-- Next steps:
-- 1. Update Typesense collection to use this view
-- 2. Implement data sync pipeline
-- 3. Update API endpoints to use group_by queries
-- 4. Test with real data

