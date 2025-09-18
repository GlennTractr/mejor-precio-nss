-- AI Context Enhancement Migration
-- This migration implements UUID primary keys and AI context enhancements for better country/language scoping

-- Phase 1: Create Language table and new AI context tables

-- Create Language table first
CREATE TABLE IF NOT EXISTS "public"."Language" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "label" TEXT NOT NULL UNIQUE
);

-- Language seed data moved to seed.sql

-- Create QuantityType table
CREATE TABLE IF NOT EXISTS "public"."QuantityType" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "label" TEXT NOT NULL,
    "internal_label" TEXT NOT NULL,
    "unit_label" TEXT NOT NULL
);

-- QuantityType seed data moved to seed.sql

-- Phase 2: Country table conversion from TEXT to UUID primary key

-- Step 1: Create new UUID column in Country table
ALTER TABLE "public"."Country" ADD COLUMN IF NOT EXISTS "id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "public"."Country" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Generate UUIDs for existing country records
UPDATE "public"."Country" SET "id" = gen_random_uuid() WHERE "id" IS NULL;

-- Step 3: Create mapping table to store old label -> new UUID relationships
CREATE TEMP TABLE country_uuid_mapping AS
SELECT "label", "id" FROM "public"."Country";

-- Phase 3: Add language field to Country table

-- Add language field (will be populated based on country)
ALTER TABLE "public"."Country" ADD COLUMN IF NOT EXISTS "language" UUID;

-- Map countries to languages (MX -> es, QC -> fr)
UPDATE "public"."Country" 
SET "language" = (SELECT "id" FROM "public"."Language" WHERE "label" = 'es')
WHERE "label" = 'MX';

UPDATE "public"."Country" 
SET "language" = (SELECT "id" FROM "public"."Language" WHERE "label" = 'fr')
WHERE "label" = 'QC';

-- Make language field NOT NULL
ALTER TABLE "public"."Country" ALTER COLUMN "language" SET NOT NULL;

-- Phase 4: Update ProductCategory to use UUID references instead of TEXT

-- Add temporary UUID column
ALTER TABLE "public"."ProductCategory" ADD COLUMN IF NOT EXISTS "country_uuid" UUID;

-- Update the UUID column based on the current country TEXT field
UPDATE "public"."ProductCategory" 
SET "country_uuid" = (SELECT "id" FROM "public"."Country" WHERE "label" = "ProductCategory"."country");

-- Drop the old TEXT foreign key constraint
ALTER TABLE "public"."ProductCategory" DROP CONSTRAINT IF EXISTS "ProductCategory_country_fkey";

-- Drop the old country column
ALTER TABLE "public"."ProductCategory" DROP COLUMN IF EXISTS "country";

-- Rename the UUID column to country
ALTER TABLE "public"."ProductCategory" RENAME COLUMN "country_uuid" TO "country";

-- Make country field NOT NULL
ALTER TABLE "public"."ProductCategory" ALTER COLUMN "country" SET NOT NULL;

-- Phase 5: Add QuantityType field to ProductCategory

-- Add QuantityType field to ProductCategory
ALTER TABLE "public"."ProductCategory" ADD COLUMN IF NOT EXISTS "quantity_type" UUID;

-- Set default quantity type based on country language
UPDATE "public"."ProductCategory" 
SET "quantity_type" = (
    SELECT qt."id" 
    FROM "public"."QuantityType" qt, "public"."Country" co, "public"."Language" l
    WHERE "ProductCategory"."country" = co."id"
    AND co."language" = l."id"
    AND (
        (l."label" = 'es' AND qt."internal_label" = 'panales_es') OR
        (l."label" = 'fr' AND qt."internal_label" = 'panales_fr') OR
        (l."label" = 'en' AND qt."internal_label" = 'panales_en')
    )
    LIMIT 1
)
WHERE "quantity_type" IS NULL;

-- Make quantity_type field NOT NULL
ALTER TABLE "public"."ProductCategory" ALTER COLUMN "quantity_type" SET NOT NULL;

-- Phase 6: Add country field to Shop table

-- Add country field to Shop
ALTER TABLE "public"."Shop" ADD COLUMN IF NOT EXISTS "country" UUID;

-- For existing shops, assign them to Mexico (MX) by default since current seed data is Mexico-focused
UPDATE "public"."Shop" 
SET "country" = (SELECT "id" FROM "public"."Country" WHERE "label" = 'MX')
WHERE "country" IS NULL;

-- Make country field NOT NULL
ALTER TABLE "public"."Shop" ALTER COLUMN "country" SET NOT NULL;

-- Phase 7: Update Country primary key from TEXT to UUID

-- Drop the old primary key constraint
ALTER TABLE "public"."Country" DROP CONSTRAINT IF EXISTS "Market_pkey";

-- Make the UUID id column NOT NULL
ALTER TABLE "public"."Country" ALTER COLUMN "id" SET NOT NULL;

-- Add new UUID primary key constraint
ALTER TABLE "public"."Country" ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");

-- IMPORTANT: Add foreign key constraint for Country -> Language immediately after primary key is established
ALTER TABLE "public"."Country" ADD CONSTRAINT "Country_language_fkey" 
FOREIGN KEY ("language") REFERENCES "public"."Language"("id") ON DELETE RESTRICT;

-- Phase 8: Create AI context prompt tables

-- Create matching.CountryPrompt table
CREATE TABLE IF NOT EXISTS "matching"."CountryPrompt" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "country" UUID NOT NULL UNIQUE,
    "ai_currency_context" TEXT NOT NULL,
    
    CONSTRAINT "CountryPrompt_country_fkey" FOREIGN KEY ("country") 
    REFERENCES "public"."Country"("id") ON DELETE CASCADE
);

-- Create matching.QuantityTypePrompt table
CREATE TABLE IF NOT EXISTS "matching"."QuantityTypePrompt" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "quantity_type" UUID NOT NULL UNIQUE,
    "ai_quantity_context" TEXT NOT NULL,
    
    CONSTRAINT "QuantityTypePrompt_quantity_type_fkey" FOREIGN KEY ("quantity_type") 
    REFERENCES "public"."QuantityType"("id") ON DELETE CASCADE
);

-- Create matching.ProductSpecsPrompt table
CREATE TABLE IF NOT EXISTS "matching"."ProductSpecsPrompt" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "product_spec" UUID NOT NULL UNIQUE,
    "ai_specs_context" TEXT NOT NULL,
    
    CONSTRAINT "ProductSpecsPrompt_product_spec_fkey" FOREIGN KEY ("product_spec") 
    REFERENCES "public"."ProductSpecs"("id") ON DELETE CASCADE
);

-- Create matching.CategoryPrompt table
CREATE TABLE IF NOT EXISTS "matching"."CategoryPrompt" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "category" UUID NOT NULL UNIQUE,
    "ai_price_context" TEXT NOT NULL,
    "ai_quantity_context" TEXT NOT NULL,
    
    CONSTRAINT "CategoryPrompt_category_fkey" FOREIGN KEY ("category") 
    REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE
);

-- Phase 9: Add remaining foreign key constraints

-- Add foreign key constraint for ProductCategory -> Country (UUID)
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_country_fkey" 
FOREIGN KEY ("country") REFERENCES "public"."Country"("id") ON DELETE CASCADE;

-- Add foreign key constraint for ProductCategory -> QuantityType
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_quantity_type_fkey" 
FOREIGN KEY ("quantity_type") REFERENCES "public"."QuantityType"("id") ON DELETE RESTRICT;

-- Add foreign key constraint for Shop -> Country
ALTER TABLE "public"."Shop" ADD CONSTRAINT "Shop_country_fkey" 
FOREIGN KEY ("country") REFERENCES "public"."Country"("id") ON DELETE RESTRICT;

-- Phase 10: Enhance ProcessIntentAIUsage table with prompt tracking

-- Add prompt field to track AI prompts sent
ALTER TABLE "matching"."ProcessIntentAIUsage" ADD COLUMN IF NOT EXISTS "prompt" TEXT;

-- Add tools field to track AI tools metadata  
ALTER TABLE "matching"."ProcessIntentAIUsage" ADD COLUMN IF NOT EXISTS "tools" TEXT;

-- Make prompt field NOT NULL (with default for existing records)
UPDATE "matching"."ProcessIntentAIUsage" SET "prompt" = 'Legacy prompt - not tracked' WHERE "prompt" IS NULL;
ALTER TABLE "matching"."ProcessIntentAIUsage" ALTER COLUMN "prompt" SET NOT NULL;

-- Phase 11: AI context seed data moved to seed.sql




-- Phase 12: Create indexes for performance

-- Create indexes for new foreign keys
CREATE INDEX IF NOT EXISTS "idx_country_language" ON "public"."Country" ("language");
CREATE INDEX IF NOT EXISTS "idx_productcategory_country" ON "public"."ProductCategory" ("country");
CREATE INDEX IF NOT EXISTS "idx_productcategory_quantity_type" ON "public"."ProductCategory" ("quantity_type");
CREATE INDEX IF NOT EXISTS "idx_shop_country" ON "public"."Shop" ("country");

-- Create indexes for AI context tables
CREATE INDEX IF NOT EXISTS "idx_countryprompt_country" ON "matching"."CountryPrompt" ("country");
CREATE INDEX IF NOT EXISTS "idx_quantitytypeprompt_quantity_type" ON "matching"."QuantityTypePrompt" ("quantity_type");
CREATE INDEX IF NOT EXISTS "idx_productspecsprompt_product_spec" ON "matching"."ProductSpecsPrompt" ("product_spec");
CREATE INDEX IF NOT EXISTS "idx_categoryprompt_category" ON "matching"."CategoryPrompt" ("category");

-- Phase 13: Create updated_at triggers for new tables

-- Create trigger function if not exists (reuse existing one from matching schema)
-- The function matching.update_updated_at_column already exists from previous migrations

-- Apply updated_at triggers for new tables
DROP TRIGGER IF EXISTS update_countryprompt_updated_at ON "matching"."CountryPrompt";
CREATE TRIGGER update_countryprompt_updated_at 
    BEFORE UPDATE ON "matching"."CountryPrompt" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_quantitytypeprompt_updated_at ON "matching"."QuantityTypePrompt";
CREATE TRIGGER update_quantitytypeprompt_updated_at 
    BEFORE UPDATE ON "matching"."QuantityTypePrompt" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_productspecsprompt_updated_at ON "matching"."ProductSpecsPrompt";
CREATE TRIGGER update_productspecsprompt_updated_at 
    BEFORE UPDATE ON "matching"."ProductSpecsPrompt" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_categoryprompt_updated_at ON "matching"."CategoryPrompt";
CREATE TRIGGER update_categoryprompt_updated_at 
    BEFORE UPDATE ON "matching"."CategoryPrompt" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

-- Phase 14: Enable RLS for new tables

-- Enable RLS for new tables
ALTER TABLE "public"."Language" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."QuantityType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."CountryPrompt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."QuantityTypePrompt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."ProductSpecsPrompt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."CategoryPrompt" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for read access
CREATE POLICY "Enable read access for all users" ON "public"."Language" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."QuantityType" FOR SELECT USING (true);
CREATE POLICY "Enable read access for service_role" ON "matching"."CountryPrompt" FOR SELECT TO "service_role" USING (true);
CREATE POLICY "Enable read access for service_role" ON "matching"."QuantityTypePrompt" FOR SELECT TO "service_role" USING (true);
CREATE POLICY "Enable read access for service_role" ON "matching"."ProductSpecsPrompt" FOR SELECT TO "service_role" USING (true);
CREATE POLICY "Enable read access for service_role" ON "matching"."CategoryPrompt" FOR SELECT TO "service_role" USING (true);

-- Phase 15: Grant permissions

-- Grant permissions for new tables
GRANT ALL ON TABLE "public"."Language" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."QuantityType" TO "anon", "authenticated", "service_role";
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE "matching"."CountryPrompt" TO "service_role";
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE "matching"."QuantityTypePrompt" TO "service_role";
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE "matching"."ProductSpecsPrompt" TO "service_role";
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE "matching"."CategoryPrompt" TO "service_role";

-- Phase 16: Enable RLS for Country table and allow public read access

-- Enable RLS for Country table
ALTER TABLE "public"."Country" ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow everyone to read countries
CREATE POLICY "Enable read access for all users" ON "public"."Country" 
FOR SELECT USING (true);

-- Migration completed successfully
-- Remember to run: npm run gen:types to update TypeScript definitions

COMMENT ON SCHEMA "public" IS 'AI Context Enhancement Migration completed - UUID conversion and AI prompt context tables added';