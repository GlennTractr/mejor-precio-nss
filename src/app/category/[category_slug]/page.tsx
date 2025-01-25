// Server Component
import { CategoryPage } from '@/components/category/category-page';

interface PageProps {
  params: {
    category_slug: string;
  };
  searchParams: {
    page?: string;
    per_page?: string;
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  // Await the params here in the server component
  const categorySlug = (await params).category_slug;
  const searchParamsAwaited = (await searchParams) || {};
  const currentPage = parseInt(searchParamsAwaited.page || '1');
  const itemsPerPage = parseInt(searchParamsAwaited.per_page || '20');

  return (
    <CategoryPage
      categorySlug={categorySlug}
      initialPage={currentPage}
      initialItemsPerPage={itemsPerPage}
    />
  );
}
