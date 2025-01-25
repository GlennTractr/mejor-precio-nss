'use client';

import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const PER_PAGE_OPTIONS = [10, 20, 50];
const MAX_VISIBLE_PAGES = 5;

interface CategoryPageProps {
  categoryId: string;
  initialPage: number;
  initialItemsPerPage: number;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

interface FacetValue {
  value: string;
  count: number;
}

interface FacetCount {
  field_name: string;
  counts: FacetValue[];
}

interface Facets {
  brand: FacetValue[];
  model: FacetValue[];
}

interface TypesenseResponse {
  hits: Array<{ document: Product }>;
  found: number;
  facet_counts?: FacetCount[];
}

export function CategoryPage({ categoryId, initialPage, initialItemsPerPage }: CategoryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [facets, setFacets] = useState<Facets>({ brand: [], model: [] });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const currentPage = parseInt(searchParams?.get('page') || String(initialPage));
  const itemsPerPage = parseInt(searchParams?.get('per_page') || String(initialItemsPerPage));
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const updateUrlParams = (page: number, perPage: number, query?: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(page));
    params.set('per_page', String(perPage));
    if (query) params.set('q', query);
    router.replace(`/category/${categoryId}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setHasError(false);
      try {
        let filterBy = `category_slug:=${categoryId}`;
        if (selectedBrands.length > 0) {
          filterBy += ` && brand:=[${selectedBrands.map(b => `'${b}'`).join(',')}]`;
        }
        if (selectedModels.length > 0) {
          filterBy += ` && model:=[${selectedModels.map(m => `'${m}'`).join(',')}]`;
        }

        const response = await fetch(
          `/api/typesense/search?category_id=${categoryId}&page=${currentPage}&per_page=${itemsPerPage}&q=${debouncedSearch}&filter_by=${encodeURIComponent(
            filterBy
          )}`
        );
        const data: TypesenseResponse = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const fetchedProducts = data.hits.map(hit => hit.document) || [];
        setProducts(fetchedProducts);
        setTotalItems(data.found || 0);

        // Update facets
        if (data.facet_counts) {
          setFacets({
            brand:
              data.facet_counts.find((f: FacetCount) => f.field_name === 'brand')?.counts || [],
            model:
              data.facet_counts.find((f: FacetCount) => f.field_name === 'model')?.counts || [],
          });
        }

        if (currentPage === 1 && data.found === 0) {
          notFound();
        }
      } catch (error) {
        console.error(
          'Failed to fetch products:',
          error instanceof Error ? error.message : String(error)
        );
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId, currentPage, itemsPerPage, debouncedSearch, selectedBrands, selectedModels]);

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Category: {categoryId}</h1>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-6">
          {/* Brands Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold">Brands</h3>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {facets.brand.map(brand => (
                  <div key={brand.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.value}`}
                      checked={selectedBrands.includes(brand.value)}
                      onCheckedChange={checked => {
                        setSelectedBrands(prev =>
                          checked ? [...prev, brand.value] : prev.filter(b => b !== brand.value)
                        );
                      }}
                    />
                    <label
                      htmlFor={`brand-${brand.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand.value} ({brand.count})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Models Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold">Models</h3>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {facets.model.map(model => (
                  <div key={model.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`model-${model.value}`}
                      checked={selectedModels.includes(model.value)}
                      onCheckedChange={checked => {
                        setSelectedModels(prev =>
                          checked ? [...prev, model.value] : prev.filter(m => m !== model.value)
                        );
                      }}
                    />
                    <label
                      htmlFor={`model-${model.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {model.value} ({model.count})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Input
                type="search"
                placeholder="Search products..."
                className="max-w-sm"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  updateUrlParams(1, itemsPerPage, e.target.value);
                }}
              />
              {!isLoading && (
                <p className="text-gray-600">
                  {totalItems} {totalItems === 1 ? 'product' : 'products'} found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <Select
                defaultValue={String(itemsPerPage)}
                onValueChange={value => {
                  updateUrlParams(1, parseInt(value));
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle>{product.title}</CardTitle>
                      <CardDescription>{product.brand}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">
                        Best Price: €{product.best_price_per_unit.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-gray-500">
                        Available at: {product.shop_names.join(', ')}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => updateUrlParams(Math.max(1, currentPage - 1), itemsPerPage)}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {visiblePages[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href={`/category/${categoryId}?page=1&per_page=${itemsPerPage}`}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {visiblePages[0] > 2 && <PaginationEllipsis />}
                    </>
                  )}

                  {visiblePages.map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/category/${categoryId}?page=${page}&per_page=${itemsPerPage}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                      {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <PaginationEllipsis />
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href={`/category/${categoryId}?page=${totalPages}&per_page=${itemsPerPage}`}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        updateUrlParams(Math.min(totalPages, currentPage + 1), itemsPerPage)
                      }
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
