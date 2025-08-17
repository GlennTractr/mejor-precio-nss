alter table "matching"."AcquisitionIntent" drop constraint "AcquisitionIntent_brand_fkey";

alter table "matching"."AcquisitionIntent" drop constraint "AcquisitionIntent_category_fkey";

alter table "matching"."AcquisitionIntent" drop constraint "AcquisitionIntent_model_fkey";

alter table "matching"."AcquisitionIntent" drop constraint "AcquisitionIntent_packaging_fkey";

alter table "matching"."AcquisitionIntent" drop constraint "AcquisitionIntent_product_fkey";

alter table "matching"."AcquisitionIntent" drop constraint "AcquisitionIntent_sell_context_fkey";

alter table "matching"."AcquisitionIntent" drop constraint "AcquisitionIntent_shop_fkey";

alter table "matching"."AcquisitionIntentSpecsMatching" drop constraint "AcquisitionIntentSpecsMatching_spec_fkey";

alter table "matching"."ProductRules" drop constraint "ProductRules_category_fkey";

alter table "matching"."Sources" add column "last_tracked_at" timestamp with time zone;

alter table "matching"."AcquisitionIntent" add constraint "AcquisitionIntent_brand_fkey" FOREIGN KEY (brand) REFERENCES "ProductBrand"(id) ON DELETE SET NULL not valid;

alter table "matching"."AcquisitionIntent" validate constraint "AcquisitionIntent_brand_fkey";

alter table "matching"."AcquisitionIntent" add constraint "AcquisitionIntent_category_fkey" FOREIGN KEY (category) REFERENCES "ProductCategory"(id) ON DELETE SET NULL not valid;

alter table "matching"."AcquisitionIntent" validate constraint "AcquisitionIntent_category_fkey";

alter table "matching"."AcquisitionIntent" add constraint "AcquisitionIntent_model_fkey" FOREIGN KEY (model) REFERENCES "ProductModel"(id) ON DELETE SET NULL not valid;

alter table "matching"."AcquisitionIntent" validate constraint "AcquisitionIntent_model_fkey";

alter table "matching"."AcquisitionIntent" add constraint "AcquisitionIntent_packaging_fkey" FOREIGN KEY (packaging) REFERENCES "ProductPackaging"(id) ON DELETE SET NULL not valid;

alter table "matching"."AcquisitionIntent" validate constraint "AcquisitionIntent_packaging_fkey";

alter table "matching"."AcquisitionIntent" add constraint "AcquisitionIntent_product_fkey" FOREIGN KEY (product) REFERENCES "Product"(id) ON DELETE SET NULL not valid;

alter table "matching"."AcquisitionIntent" validate constraint "AcquisitionIntent_product_fkey";

alter table "matching"."AcquisitionIntent" add constraint "AcquisitionIntent_sell_context_fkey" FOREIGN KEY (sell_context) REFERENCES "ProductSellContext"(id) ON DELETE SET NULL not valid;

alter table "matching"."AcquisitionIntent" validate constraint "AcquisitionIntent_sell_context_fkey";

alter table "matching"."AcquisitionIntent" add constraint "AcquisitionIntent_shop_fkey" FOREIGN KEY (shop) REFERENCES "Shop"(id) ON DELETE SET NULL not valid;

alter table "matching"."AcquisitionIntent" validate constraint "AcquisitionIntent_shop_fkey";

alter table "matching"."AcquisitionIntentSpecsMatching" add constraint "AcquisitionIntentSpecsMatching_spec_fkey" FOREIGN KEY (spec) REFERENCES "ProductSpecs"(id) ON DELETE CASCADE not valid;

alter table "matching"."AcquisitionIntentSpecsMatching" validate constraint "AcquisitionIntentSpecsMatching_spec_fkey";

alter table "matching"."ProductRules" add constraint "ProductRules_category_fkey" FOREIGN KEY (category) REFERENCES "ProductCategory"(id) ON DELETE CASCADE not valid;

alter table "matching"."ProductRules" validate constraint "ProductRules_category_fkey";


