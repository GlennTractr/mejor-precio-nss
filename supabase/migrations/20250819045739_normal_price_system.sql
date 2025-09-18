-- ============================================================================
-- Normal Price Management System Implementation
-- ============================================================================
-- This migration implements a comprehensive normal price calculation system
-- with improved price tracking and materialized views for performance.

-- ============================================================================
-- 1. CRITICAL FIX: Update setPrice function to save ALL prices
-- ============================================================================

CREATE OR REPLACE FUNCTION "public"."setPrice"("p_link" "text", "p_price" real, "p_date" timestamp with time zone DEFAULT "now"()) 
RETURNS "void"
LANGUAGE "plpgsql"
AS $$
DECLARE
    v_sell_context uuid;
BEGIN
    -- Find the ProductSellContext by link
    SELECT id INTO v_sell_context
    FROM public."ProductSellContext"
    WHERE link = p_link;

    -- If the sell context exists, perform an upsert on ProductSellContextPrice
    IF v_sell_context IS NOT NULL THEN
        INSERT INTO public."ProductSellContextPrice" (sell_context, price, date, created_at)
        VALUES (v_sell_context, p_price, p_date, now())
        ON CONFLICT (sell_context, date) 
        DO UPDATE SET 
            price = EXCLUDED.price,  -- ALWAYS save the latest price (fixed!)
            created_at = now();
    ELSE
        -- Log error before raising exception for monitoring
        RAISE LOG 'ProductSellContext with link % not found', p_link;
        RAISE EXCEPTION 'ProductSellContext with link % not found', p_link;
    END IF;
END;
$$;

-- ============================================================================
-- 2. Create Normal Price Calculation Materialized Views
-- ============================================================================

-- 2.1 ProductSellContext Normal Price View
CREATE MATERIALIZED VIEW IF NOT EXISTS product_sell_context_normal_price_view AS
SELECT 
    sell_context,
    normal_price,
    price_count,
    date_range_start,
    date_range_end
FROM (
    -- Group by day, take min price per day
    WITH daily_prices AS (
        SELECT 
            sell_context,
            date,
            MIN(price) as daily_min_price
        FROM public."ProductSellContextPrice" 
        WHERE date >= NOW() - INTERVAL '1 year'
        GROUP BY sell_context, date
    ),
    -- Count frequency of each price
    price_frequency AS (
        SELECT 
            sell_context,
            daily_min_price as price,
            COUNT(*) as frequency,
            MIN(date) as date_range_start,
            MAX(date) as date_range_end
        FROM daily_prices
        GROUP BY sell_context, daily_min_price
        HAVING COUNT(*) >= 10  -- Minimum 10 days data required
    )
    -- Select most frequent price as normal price
    SELECT DISTINCT ON (sell_context)
        sell_context,
        price as normal_price,
        frequency as price_count,
        date_range_start,
        date_range_end
    FROM price_frequency
    ORDER BY sell_context, frequency DESC
) subquery;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_product_sell_context_normal_price_sell_context 
ON product_sell_context_normal_price_view (sell_context);

-- 2.2 ProductPackaging Normal Price View
CREATE MATERIALIZED VIEW IF NOT EXISTS product_packaging_normal_price_view AS
SELECT 
    pp.id as packaging_id,
    pp.product as product_id,
    MIN(pscnp.normal_price / GREATEST(pp.quantity, 1)) as normal_price_per_unit
FROM public."ProductPackaging" pp
JOIN public."ProductSellContext" psc ON psc.packaging = pp.id
JOIN product_sell_context_normal_price_view pscnp ON pscnp.sell_context = psc.id
WHERE pscnp.normal_price IS NOT NULL 
    AND pp.quantity IS NOT NULL
    AND pp.quantity > 0  -- Exclude zero/negative quantities entirely
GROUP BY pp.id, pp.product;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_product_packaging_normal_price_packaging_id 
ON product_packaging_normal_price_view (packaging_id);

CREATE INDEX IF NOT EXISTS idx_product_packaging_normal_price_product_id 
ON product_packaging_normal_price_view (product_id);

-- 2.3 Product Normal Price View  
CREATE MATERIALIZED VIEW IF NOT EXISTS product_normal_price_view AS
SELECT 
    product_id,
    MIN(normal_price_per_unit) as normal_price_per_unit
FROM product_packaging_normal_price_view
WHERE normal_price_per_unit IS NOT NULL
GROUP BY product_id;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_product_normal_price_product_id 
ON product_normal_price_view (product_id);

-- ============================================================================
-- 3. Update existing product_view to include normal_price
-- ============================================================================


create or replace view "public"."product_view"
with
  ("security_invoker" = 'on') as
select
  pv2.*,
  pnp.normal_price_per_unit
from
  (
    select
      "pv"."id",
      "pv"."best_price_per_unit",
      "pv"."max_price_per_unit",
      "pv"."shop_names",
      "pv"."price_list",
      "c"."label" as "country",
      COALESCE(
        "json_agg" (
          "json_build_object" ('label', "ps"."label", 'type', "ps"."type")
        ) filter (
          where
            ("ps"."label" is not null)
        ),
        '[]'::"json"
      ) as "specs",
      "p"."title",
      "regexp_replace" (
        "lower" ("public"."unaccent" ("p"."title")),
        ' '::"text",
        '-'::"text",
        'g'::"text"
      ) as "product_slug",
      "pm"."label" as "model",
      "pb"."label" as "brand",
      "pc"."label" as "category",
      "f"."file_bucket" as "main_image_bucket",
      "f"."file_path" as "main_image_path",
      "regexp_replace" (
        "lower" ("public"."unaccent" ("pc"."label")),
        ' '::"text",
        '-'::"text",
        'g'::"text"
      ) as "category_slug",
      "qt"."unit_label" as "quantity_type"
    from
      (
        select
          "ppv"."product_id" as "id",
          "min" ("ppv"."best_price_per_unit") as "best_price_per_unit",
          "max" ("ppv"."max_price_per_unit") as "max_price_per_unit",
          "array_agg" (distinct "shop_name"."shop_name") as "shop_names",
          "array_agg" (distinct "inner_price_list"."inner_price_list") as "price_list"
        from
          (
            (
              "public"."product_packaging_view" "ppv"
              left join lateral "unnest" ("ppv"."shop_names") "shop_name" ("shop_name") on (true)
            )
            left join lateral "unnest" ("ppv"."price_list") "inner_price_list" ("inner_price_list") on (true)
          )
        group by
          "ppv"."product_id"
      ) "pv"
      left join "public"."ProductSpecsMapping" "psm" on ("pv"."id" = "psm"."product_id")
      left join "public"."ProductSpecs" "ps" on ("psm"."spec_id" = "ps"."id")
      left join "public"."Product" "p" on ("pv"."id" = "p"."id")
      left join "public"."ProductModel" "pm" on ("pm"."id" = "p"."model")
      left join "public"."ProductBrand" "pb" on ("pb"."id" = "pm"."brand")
      left join "public"."ProductCategory" "pc" on ("pc"."id" = "pm"."category")
      left join "public"."Country" "c" on ("pc"."country" = "c"."id")
      left join "public"."File" "f" on ("f"."id" = "p"."image")
      left join "public"."QuantityType" "qt" on ("qt"."id" = "pc"."quantity_type")
    group by
      "pv"."id",
      "pv"."best_price_per_unit",
      "pv"."max_price_per_unit",
      "pv"."shop_names",
      "pv"."price_list",
      "p"."title",
      "pm"."label",
      "pb"."label",
      "pc"."label",
      "f"."file_bucket",
      "f"."file_path",
      "c"."label",
      "qt"."unit_label"
  ) pv2
  left join product_normal_price_view pnp on pnp.product_id = pv2.id;

-- ============================================================================
-- 4. Grant appropriate permissions
-- ============================================================================


-- Grant permissions for materialized views (restricted permissions for security)
GRANT SELECT ON TABLE product_sell_context_normal_price_view TO "anon";
GRANT ALL ON TABLE product_sell_context_normal_price_view TO "authenticated";
GRANT ALL ON TABLE product_sell_context_normal_price_view TO "service_role";

GRANT SELECT ON TABLE product_packaging_normal_price_view TO "anon";
GRANT ALL ON TABLE product_packaging_normal_price_view TO "authenticated";
GRANT ALL ON TABLE product_packaging_normal_price_view TO "service_role";

GRANT SELECT ON TABLE product_normal_price_view TO "anon";
GRANT ALL ON TABLE product_normal_price_view TO "authenticated";
GRANT ALL ON TABLE product_normal_price_view TO "service_role";


-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Summary of changes:
-- 1. ✅ Fixed setPrice() function to save ALL prices (not just lower ones)
-- 2. ✅ Created product_sell_context_normal_price_view with 10-day minimum data requirement
-- 3. ✅ Created product_packaging_normal_price_view for packaging-level normal prices  
-- 4. ✅ Created product_normal_price_view for product-level normal prices
-- 5. ✅ Updated existing product_view to include normal_price column
-- 6. ✅ Added appropriate indexes for performance
-- 7. ✅ Granted restricted permissions (SELECT only for anon users)
-- 8. ✅ Enhanced division by zero protection (excludes invalid quantities)

-- The system now:
-- - Captures ALL price changes (no data loss)
-- - Calculates normal prices based on most frequent daily minimum prices
-- - Requires minimum 10 days of data for reliable normal price calculation
-- - Provides normal_price_per_unit in the main product_view for easy access
-- - Enhanced security with restricted anonymous permissions
-- - Robust error handling and logging for monitoring
-- - Proper division by zero protection (excludes invalid quantities)
-- 
-- NOTE: Cron jobs and initial data population moved to seed.sql