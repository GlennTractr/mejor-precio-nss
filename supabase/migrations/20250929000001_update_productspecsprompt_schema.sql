-- Update ProductSpecsPrompt Schema Migration
-- This migration transforms ProductSpecsPrompt from linking to individual ProductSpecs entries
-- to linking to Category + Type combinations for more generic, maintainable AI context.

-- Phase 1: Drop existing constraints and indexes

-- Drop the foreign key constraint to ProductSpecs
ALTER TABLE "matching"."ProductSpecsPrompt"
DROP CONSTRAINT IF EXISTS "ProductSpecsPrompt_product_spec_fkey";

-- Drop the index on product_spec
DROP INDEX IF EXISTS "matching"."idx_productspecsprompt_product_spec";

-- Phase 2: Remove old column

-- Drop the product_spec column
ALTER TABLE "matching"."ProductSpecsPrompt"
DROP COLUMN IF EXISTS "product_spec";

-- Phase 3: Add new columns

-- Add category column (will link to ProductCategory)
ALTER TABLE "matching"."ProductSpecsPrompt"
ADD COLUMN IF NOT EXISTS "category" UUID;

-- Add type column (spec type like "step", "gender", etc.)
ALTER TABLE "matching"."ProductSpecsPrompt"
ADD COLUMN IF NOT EXISTS "type" TEXT;

-- Phase 4: Add constraints

-- Add foreign key constraint to ProductCategory
ALTER TABLE "matching"."ProductSpecsPrompt"
ADD CONSTRAINT "ProductSpecsPrompt_category_fkey"
FOREIGN KEY ("category") REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE;

-- Add composite unique constraint to ensure one row per category+type combination
ALTER TABLE "matching"."ProductSpecsPrompt"
ADD CONSTRAINT "ProductSpecsPrompt_category_type_unique"
UNIQUE ("category", "type");

-- Make columns NOT NULL after adding constraints
ALTER TABLE "matching"."ProductSpecsPrompt"
ALTER COLUMN "category" SET NOT NULL;

ALTER TABLE "matching"."ProductSpecsPrompt"
ALTER COLUMN "type" SET NOT NULL;

-- Phase 5: Create indexes for performance

-- Create index on category for faster lookups
CREATE INDEX IF NOT EXISTS "idx_productspecsprompt_category"
ON "matching"."ProductSpecsPrompt" ("category");

-- Create index on type for faster lookups by spec type
CREATE INDEX IF NOT EXISTS "idx_productspecsprompt_type"
ON "matching"."ProductSpecsPrompt" ("type");

-- Migration completed successfully
-- Remember to run: npm run gen:types to update TypeScript definitions

COMMENT ON TABLE "matching"."ProductSpecsPrompt" IS 'ProductSpecsPrompt schema updated - now links to category+type instead of individual product_spec entries';


ALTER TABLE "matching"."AcquisitionIntentSpecsMatching" 
ALTER COLUMN "spec" SET DEFAULT NULL,
ALTER COLUMN "spec" DROP NOT NULL;


ALTER TABLE "matching"."ExtractIntent"
ADD COLUMN "type" TEXT;


-- Phase 6: Add RLS policies for admin operations

-- Enable RLS on Product table
ALTER TABLE "public"."Product" ENABLE ROW LEVEL SECURITY;

-- Allow admins to insert, update, and delete Product
CREATE POLICY "admin_insert_product" ON "public"."Product"
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "admin_update_product" ON "public"."Product"
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_delete_product" ON "public"."Product"
FOR DELETE
USING (is_admin());

-- Enable RLS on ProductPackaging table
ALTER TABLE "public"."ProductPackaging" ENABLE ROW LEVEL SECURITY;

-- Allow admins to insert, update, and delete ProductPackaging
CREATE POLICY "admin_insert_productpackaging" ON "public"."ProductPackaging"
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "admin_update_productpackaging" ON "public"."ProductPackaging"
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_delete_productpackaging" ON "public"."ProductPackaging"
FOR DELETE
USING (is_admin());

-- Enable RLS on ProductSellContext table
ALTER TABLE "public"."ProductSellContext" ENABLE ROW LEVEL SECURITY;

-- Allow admins to insert, update, and delete ProductSellContext
CREATE POLICY "admin_insert_productsellcontext" ON "public"."ProductSellContext"
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "admin_update_productsellcontext" ON "public"."ProductSellContext"
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_delete_productsellcontext" ON "public"."ProductSellContext"
FOR DELETE
USING (is_admin());
