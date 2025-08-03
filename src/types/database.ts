export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  matching: {
    Tables: {
      ProcessIntent: {
        Row: {
          created_at: string;
          domain: string;
          html: string;
          id: string;
          result: Json | null;
          source_type: string;
          source_url: string;
          status: string;
          target_url: string | null;
          type: string;
        };
        Insert: {
          created_at?: string;
          domain: string;
          html: string;
          id?: string;
          result?: Json | null;
          source_type: string;
          source_url: string;
          status?: string;
          target_url?: string | null;
          type: string;
        };
        Update: {
          created_at?: string;
          domain?: string;
          html?: string;
          id?: string;
          result?: Json | null;
          source_type?: string;
          source_url?: string;
          status?: string;
          target_url?: string | null;
          type?: string;
        };
        Relationships: [];
      };
      Sources: {
        Row: {
          created_at: string;
          disabled: boolean;
          id: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          disabled?: boolean;
          id?: string;
          url: string;
        };
        Update: {
          created_at?: string;
          disabled?: boolean;
          id?: string;
          url?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      call_open_router_api: {
        Args: {
          p_model: string;
          p_prompt_system: string;
          p_prompt_user: string;
          p_temperature: number;
        };
        Returns: Json;
      };
      launchMatchingIntent: {
        Args: { matchingintentid: string };
        Returns: undefined;
      };
      launchProcessing: {
        Args: { matching_source_intent_id: string };
        Returns: undefined;
      };
      launchProcessMatchingInput: {
        Args: { p_matching_input_id: string };
        Returns: undefined;
      };
      launchSource: {
        Args: { matching_source_intent_id: string };
        Returns: undefined;
      };
      launchSourceApify: {
        Args: { matching_source_intent_id: string };
        Returns: undefined;
      };
      search_crawling_results: {
        Args: { keywords: string[] };
        Returns: {
          id: string;
          all_keywords: string[];
        }[];
      };
      updateIntentStatus: {
        Args: { matchingintentid: string };
        Returns: undefined;
      };
    };
    Enums: {
      CrawlingResultStatus: 'todo' | 'done';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      Country: {
        Row: {
          label: string;
        };
        Insert: {
          label: string;
        };
        Update: {
          label?: string;
        };
        Relationships: [];
      };
      File: {
        Row: {
          created_at: string;
          file_bucket: string;
          file_path: string;
          id: string;
          is_public: boolean;
        };
        Insert: {
          created_at?: string;
          file_bucket: string;
          file_path: string;
          id?: string;
          is_public?: boolean;
        };
        Update: {
          created_at?: string;
          file_bucket?: string;
          file_path?: string;
          id?: string;
          is_public?: boolean;
        };
        Relationships: [];
      };
      Product: {
        Row: {
          brand: string;
          created_at: string;
          description: string;
          id: string;
          image: string;
          model: string;
          price_variation: number;
          slug: string;
          title: string;
          type: Database['public']['Enums']['packaging_type'];
        };
        Insert: {
          brand: string;
          created_at?: string;
          description: string;
          id?: string;
          image: string;
          model: string;
          price_variation?: number;
          slug: string;
          title: string;
          type: Database['public']['Enums']['packaging_type'];
        };
        Update: {
          brand?: string;
          created_at?: string;
          description?: string;
          id?: string;
          image?: string;
          model?: string;
          price_variation?: number;
          slug?: string;
          title?: string;
          type?: Database['public']['Enums']['packaging_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'Product_brand_fkey';
            columns: ['brand'];
            isOneToOne: false;
            referencedRelation: 'ProductBrand';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Product_image_fkey';
            columns: ['image'];
            isOneToOne: false;
            referencedRelation: 'File';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Product_model_fkey';
            columns: ['model'];
            isOneToOne: false;
            referencedRelation: 'ProductModel';
            referencedColumns: ['id'];
          }
        ];
      };
      product_favory: {
        Row: {
          created_at: string;
          id: string;
          owner: string;
          product: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner: string;
          product: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner?: string;
          product?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_favory_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_favory_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'product_packaging_view';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'product_favory_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'product_sell_context_view';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'product_favory_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'product_view';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductBrand: {
        Row: {
          created_at: string;
          id: string;
          label: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
        };
        Relationships: [];
      };
      ProductBrandCategory: {
        Row: {
          brand: string;
          category: string;
        };
        Insert: {
          brand: string;
          category: string;
        };
        Update: {
          brand?: string;
          category?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductBrandCategory_brand_fkey';
            columns: ['brand'];
            isOneToOne: false;
            referencedRelation: 'ProductBrand';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductBrandCategory_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'ProductCategory';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductCategory: {
        Row: {
          country: string;
          created_at: string;
          id: string;
          image_bucket: string | null;
          image_path: string | null;
          label: string;
          slug: string;
        };
        Insert: {
          country: string;
          created_at?: string;
          id?: string;
          image_bucket?: string | null;
          image_path?: string | null;
          label: string;
          slug: string;
        };
        Update: {
          country?: string;
          created_at?: string;
          id?: string;
          image_bucket?: string | null;
          image_path?: string | null;
          label?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductCategory_country_fkey';
            columns: ['country'];
            isOneToOne: false;
            referencedRelation: 'Country';
            referencedColumns: ['label'];
          }
        ];
      };
      ProductModel: {
        Row: {
          brand: string;
          category: string | null;
          created_at: string;
          id: string;
          label: string;
        };
        Insert: {
          brand: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          label: string;
        };
        Update: {
          brand?: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          label?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductModel_brand_fkey';
            columns: ['brand'];
            isOneToOne: false;
            referencedRelation: 'ProductBrand';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductModel_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'ProductCategory';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductModelCategory: {
        Row: {
          brand: string;
          category: string;
        };
        Insert: {
          brand: string;
          category: string;
        };
        Update: {
          brand?: string;
          category?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductModelCategory_brand_fkey';
            columns: ['brand'];
            isOneToOne: false;
            referencedRelation: 'ProductBrand';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductModelCategory_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'ProductCategory';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductPackaging: {
        Row: {
          created_at: string;
          id: string;
          image: string;
          product: string;
          quantity: number;
          type: Database['public']['Enums']['packaging_type'];
        };
        Insert: {
          created_at?: string;
          id?: string;
          image: string;
          product: string;
          quantity: number;
          type: Database['public']['Enums']['packaging_type'];
        };
        Update: {
          created_at?: string;
          id?: string;
          image?: string;
          product?: string;
          quantity?: number;
          type?: Database['public']['Enums']['packaging_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'ProductPackaging_image_fkey';
            columns: ['image'];
            isOneToOne: false;
            referencedRelation: 'File';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductPackaging_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductPackaging_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'product_packaging_view';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'ProductPackaging_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'product_sell_context_view';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'ProductPackaging_product_fkey';
            columns: ['product'];
            isOneToOne: false;
            referencedRelation: 'product_view';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductSellContext: {
        Row: {
          created_at: string;
          id: string;
          link: string;
          packaging: string | null;
          price: number;
          shop: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          link: string;
          packaging?: string | null;
          price: number;
          shop: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          link?: string;
          packaging?: string | null;
          price?: number;
          shop?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductSellContext_packaging_fkey';
            columns: ['packaging'];
            isOneToOne: false;
            referencedRelation: 'product_packaging_view';
            referencedColumns: ['packaging_id'];
          },
          {
            foreignKeyName: 'ProductSellContext_packaging_fkey';
            columns: ['packaging'];
            isOneToOne: false;
            referencedRelation: 'product_sell_context_view';
            referencedColumns: ['packaging_id'];
          },
          {
            foreignKeyName: 'ProductSellContext_packaging_fkey';
            columns: ['packaging'];
            isOneToOne: false;
            referencedRelation: 'ProductPackaging';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductSellContext_shop_fkey';
            columns: ['shop'];
            isOneToOne: false;
            referencedRelation: 'product_sell_context_view';
            referencedColumns: ['shop_id'];
          },
          {
            foreignKeyName: 'ProductSellContext_shop_fkey';
            columns: ['shop'];
            isOneToOne: false;
            referencedRelation: 'Shop';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductSellContextPrice: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          price: number;
          sell_context: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          price: number;
          sell_context: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          price?: number;
          sell_context?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductSellContextPrice_sell_context_fkey';
            columns: ['sell_context'];
            isOneToOne: false;
            referencedRelation: 'product_sell_context_view';
            referencedColumns: ['sell_context_id'];
          },
          {
            foreignKeyName: 'ProductSellContextPrice_sell_context_fkey';
            columns: ['sell_context'];
            isOneToOne: false;
            referencedRelation: 'ProductSellContext';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductSpecs: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          label: string;
          type: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          label: string;
          type: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          label?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductSpecs_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'ProductCategory';
            referencedColumns: ['id'];
          }
        ];
      };
      ProductSpecsMapping: {
        Row: {
          product_id: string;
          spec_id: string;
        };
        Insert: {
          product_id: string;
          spec_id: string;
        };
        Update: {
          product_id?: string;
          spec_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductSpecsMapping_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductSpecsMapping_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'product_packaging_view';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'ProductSpecsMapping_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'product_sell_context_view';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'ProductSpecsMapping_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'product_view';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductSpecsMapping_spec_id_fkey';
            columns: ['spec_id'];
            isOneToOne: false;
            referencedRelation: 'ProductSpecs';
            referencedColumns: ['id'];
          }
        ];
      };
      Shop: {
        Row: {
          created_at: string;
          id: string;
          img_url: string;
          label: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          img_url: string;
          label: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          img_url?: string;
          label?: string;
        };
        Relationships: [];
      };
      ShopIdentifier: {
        Row: {
          created_at: string;
          domain: string;
          id: number;
          shop: string;
        };
        Insert: {
          created_at?: string;
          domain: string;
          id?: number;
          shop: string;
        };
        Update: {
          created_at?: string;
          domain?: string;
          id?: number;
          shop?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ShopIdentifier_shop_fkey';
            columns: ['shop'];
            isOneToOne: false;
            referencedRelation: 'product_sell_context_view';
            referencedColumns: ['shop_id'];
          },
          {
            foreignKeyName: 'ShopIdentifier_shop_fkey';
            columns: ['shop'];
            isOneToOne: false;
            referencedRelation: 'Shop';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      product_packaging_view: {
        Row: {
          best_price_per_unit: number | null;
          max_price_per_unit: number | null;
          packaging_id: string | null;
          price_list: number[] | null;
          product_id: string | null;
          shop_names: string[] | null;
        };
        Relationships: [];
      };
      product_sell_context_view: {
        Row: {
          packaging_id: string | null;
          price: number | null;
          price_per_unit: number | null;
          product_id: string | null;
          quantity: number | null;
          sell_context_id: string | null;
          shop_id: string | null;
          shop_name: string | null;
        };
        Relationships: [];
      };
      product_view: {
        Row: {
          best_price_per_unit: number | null;
          brand: string | null;
          category: string | null;
          category_slug: string | null;
          id: string | null;
          main_image_bucket: string | null;
          main_image_path: string | null;
          max_price_per_unit: number | null;
          model: string | null;
          price_list: number[] | null;
          product_slug: string | null;
          shop_names: string[] | null;
          specs: Json | null;
          title: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      launchApifyActor: {
        Args: { p_actor_id: string; p_body: Json };
        Returns: string;
      };
      launchCrawl: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      setPrice: {
        Args: { p_date?: string; p_link: string; p_price: number };
        Returns: undefined;
      };
      unaccent: {
        Args: { '': string };
        Returns: string;
      };
      unaccent_init: {
        Args: { '': unknown };
        Returns: unknown;
      };
    };
    Enums: {
      packaging_type: 'unit' | 'kilo' | 'litro';
      shop: 'liverpool' | 'aurrera';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  matching: {
    Enums: {
      CrawlingResultStatus: ['todo', 'done'],
    },
  },
  public: {
    Enums: {
      packaging_type: ['unit', 'kilo', 'litro'],
      shop: ['liverpool', 'aurrera'],
    },
  },
} as const;
