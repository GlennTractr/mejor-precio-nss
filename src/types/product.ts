export interface Product {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  category_slug: string;
  best_price_per_unit: number;
  shop_names: string[];
  price_list: number[];
  product_slug: string;
  specs?: Array<{
    label: string;
    type: string;
  }>;
  main_image_bucket: string;
  main_image_path: string;
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface SpecFacet {
  type: string;
  count: number;
  labels: FacetValue[];
}

export interface Facets {
  brand: FacetValue[];
  model: FacetValue[];
}

export interface FacetCount {
  field_name: string;
  counts: Array<{
    value: string;
    count: number;
    highlighted?: string;
  }>;
  stats?: {
    avg?: number;
    max?: number;
    min?: number;
    sum?: number;
    total_values?: number;
  };
  sampled?: boolean;
}

export interface SearchResponse {
  hits: Array<{ document: Product }>;
  found: number;
  facet_counts?: FacetCount[];
  specs_facets?: SpecFacet[];
  price_range?: {
    min: number;
    max: number;
  };
  facet_stats?: {
    [key: string]: {
      min: number;
      max: number;
    };
  };
}
