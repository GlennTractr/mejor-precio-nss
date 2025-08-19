-- V2 Unified Flow Database Schema Migration
-- This migration implements the new database schema for the V2 unified tracking/acquisition flow

-- Drop existing ProcessIntent table constraints that might interfere
ALTER TABLE "matching"."ProcessIntent" DROP CONSTRAINT IF EXISTS processintent_status_check;
ALTER TABLE "matching"."ProcessIntent" DROP CONSTRAINT IF EXISTS processintent_type_check;

-- 1. Update ProcessIntent table to support V2 unified flow
-- Keep existing columns and add new ones for V2 compatibility

-- Keep result column for backwards compatibility, but add V2 fields
ALTER TABLE "matching"."ProcessIntent" 
ADD COLUMN IF NOT EXISTS domain TEXT,
ADD COLUMN IF NOT EXISTS target_url TEXT,
ADD COLUMN IF NOT EXISTS source_type TEXT,
ADD COLUMN IF NOT EXISTS product_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ALTER COLUMN status SET DEFAULT 'waiting',
DROP COLUMN IF EXISTS source_type,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT NULL;

-- Add check constraint for status values (V2 compatible)
ALTER TABLE "matching"."ProcessIntent" 
ADD CONSTRAINT processintent_status_check 
CHECK (status IN ('waiting', 'to_process', 'queued', 'processing', 'in-progress', 'processed', 'success', 'failed', 'validated', 'unvalidated'));

-- Add check constraint for type values  
ALTER TABLE "matching"."ProcessIntent" 
ADD CONSTRAINT processintent_type_check 
CHECK (type IS NULL OR type IN ('acquisition', 'tracking'));

-- 2. Create ExtractIntent table
CREATE TABLE IF NOT EXISTS "matching"."ExtractIntent" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_intent UUID NOT NULL REFERENCES "matching"."ProcessIntent"(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in-progress',
    failed_reason TEXT,
    url TEXT,
    title TEXT,
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    is_bundle BOOLEAN DEFAULT FALSE,
    extra_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT extractintent_status_check 
    CHECK (status IN ('in-progress', 'success', 'failed'))
);

-- 3. Create TrackingIntent table
CREATE TABLE IF NOT EXISTS "matching"."TrackingIntent" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_intent UUID NOT NULL REFERENCES "matching"."ProcessIntent"(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in-progress',
    failed_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT trackingintent_status_check 
    CHECK (status IN ('in-progress', 'success', 'failed'))
);

-- 4. Create AcquisitionIntent table
CREATE TABLE IF NOT EXISTS "matching"."AcquisitionIntent" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_intent UUID NOT NULL REFERENCES "matching"."ProcessIntent"(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in-progress',
    failed_reason TEXT,
    
    -- Category matching
    category UUID REFERENCES "public"."ProductCategory"(id),
    category_confidence INTEGER DEFAULT 0,
    
    -- Brand matching
    brand UUID REFERENCES "public"."ProductBrand"(id),
    brand_confidence INTEGER DEFAULT 0,
    
    -- Model matching
    model UUID REFERENCES "public"."ProductModel"(id),
    model_confidence INTEGER DEFAULT 0,

    -- Shop and quantity (optional)
    shop UUID REFERENCES "public"."Shop"(id),
    quantity DOUBLE PRECISION,

    -- Resolved product references (optional)
    product UUID REFERENCES "public"."Product"(id),
    packaging UUID REFERENCES "public"."ProductPackaging"(id),
    sell_context UUID REFERENCES "public"."ProductSellContext"(id),

    -- Overall metrics
    progress INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT acquisitionintent_status_check 
    CHECK (status IN ('in-progress', 'success', 'failed')),
    CONSTRAINT acquisitionintent_confidence_check 
    CHECK (category_confidence >= 0 AND category_confidence <= 100 
           AND brand_confidence >= 0 AND brand_confidence <= 100 
           AND model_confidence >= 0 AND model_confidence <= 100),
    CONSTRAINT acquisitionintent_progress_check 
    CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT acquisitionintent_score_check 
    CHECK (score >= 0 AND score <= 100)
);

-- 5. Create AcquisitionIntentSpecsMatching table
CREATE TABLE IF NOT EXISTS "matching"."AcquisitionIntentSpecsMatching" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acquisition_intent UUID NOT NULL REFERENCES "matching"."AcquisitionIntent"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    spec UUID NOT NULL REFERENCES "public"."ProductSpecs"(id),
    confidence INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT acquisitionintentspecsmatching_confidence_check 
    CHECK (confidence >= 0 AND confidence <= 100),
    UNIQUE(acquisition_intent, type, spec)
);

-- 6. Create ProductRules table
CREATE TABLE IF NOT EXISTS "matching"."ProductRules" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category UUID NOT NULL REFERENCES "public"."ProductCategory"(id),
    type TEXT NOT NULL,
    min INTEGER,
    max INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT productrules_type_check 
    CHECK (type IN ('price', 'price_per_unit', 'quantity')),
    CONSTRAINT productrules_min_max_check 
    CHECK (min IS NULL OR max IS NULL OR min <= max),
    UNIQUE(category, type)
);

-- 7. Create ProcessIntentAIUsage table
CREATE TABLE IF NOT EXISTS "matching"."ProcessIntentAIUsage" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    process_intent UUID NOT NULL REFERENCES "matching"."ProcessIntent"(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    type TEXT NOT NULL,
    label TEXT NOT NULL, -- Purpose of the AI call (e.g., 'extracting', 'matching-category', 'matching-brand')
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10,6) NOT NULL DEFAULT 0,
    time INTEGER NOT NULL DEFAULT 0, -- Time in milliseconds
    
    CONSTRAINT processintentaiusage_type_check 
    CHECK (type IN ('langchain', 'langgraph', 'openai', 'anthropic', 'other')),
    CONSTRAINT processintentaiusage_tokens_check 
    CHECK (prompt_tokens >= 0 AND completion_tokens >= 0 AND total_tokens >= 0),
    CONSTRAINT processintentaiusage_cost_check 
    CHECK (cost >= 0),
    CONSTRAINT processintentaiusage_time_check 
    CHECK (time >= 0)
);

-- 8. Create BannedUrl table (matching schema)
CREATE TABLE IF NOT EXISTS "matching"."BannedUrl" (
    shop UUID NOT NULL REFERENCES "public"."Shop"(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    CONSTRAINT "BannedUrl_pkey" PRIMARY KEY (shop, url)
);

-- 9. Create AcquisitionIntentValidationRule table
CREATE TABLE IF NOT EXISTS "matching"."AcquisitionIntentValidationRule" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acquisition_intent UUID NOT NULL REFERENCES "matching"."AcquisitionIntent"(id) ON DELETE CASCADE,
    rule TEXT NOT NULL,
    explanation TEXT,
    success BOOLEAN DEFAULT FALSE,
    error_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create TrackingIntentValidationRule table
CREATE TABLE IF NOT EXISTS "matching"."TrackingIntentValidationRule" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_intent UUID NOT NULL REFERENCES "matching"."TrackingIntent"(id) ON DELETE CASCADE,
    rule TEXT NOT NULL,
    explanation TEXT,
    success BOOLEAN DEFAULT FALSE,
    error_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_extractintent_process_intent ON "matching"."ExtractIntent" (process_intent);
CREATE INDEX IF NOT EXISTS idx_extractintent_status ON "matching"."ExtractIntent" (status);
CREATE INDEX IF NOT EXISTS idx_trackingintent_process_intent ON "matching"."TrackingIntent" (process_intent);
CREATE INDEX IF NOT EXISTS idx_trackingintent_status ON "matching"."TrackingIntent" (status);
CREATE INDEX IF NOT EXISTS idx_acquisitionintent_process_intent ON "matching"."AcquisitionIntent" (process_intent);
CREATE INDEX IF NOT EXISTS idx_acquisitionintent_status ON "matching"."AcquisitionIntent" (status);
CREATE INDEX IF NOT EXISTS idx_acquisitionintent_category ON "matching"."AcquisitionIntent" (category);
CREATE INDEX IF NOT EXISTS idx_acquisitionintentspecsmatching_acquisition_intent ON "matching"."AcquisitionIntentSpecsMatching" (acquisition_intent);
CREATE INDEX IF NOT EXISTS idx_productrules_category ON "matching"."ProductRules" (category);
CREATE INDEX IF NOT EXISTS idx_productrules_type ON "matching"."ProductRules" (type);
CREATE INDEX IF NOT EXISTS idx_processintentaiusage_process_intent ON "matching"."ProcessIntentAIUsage" (process_intent);
CREATE INDEX IF NOT EXISTS idx_processintentaiusage_model ON "matching"."ProcessIntentAIUsage" (model);
CREATE INDEX IF NOT EXISTS idx_processintentaiusage_type ON "matching"."ProcessIntentAIUsage" (type);
CREATE INDEX IF NOT EXISTS idx_processintentaiusage_label ON "matching"."ProcessIntentAIUsage" (label);

-- Indexes for validation rule tables
CREATE INDEX IF NOT EXISTS idx_acq_validationrule_acquisition_intent ON "matching"."AcquisitionIntentValidationRule" (acquisition_intent);
CREATE INDEX IF NOT EXISTS idx_acq_validationrule_success ON "matching"."AcquisitionIntentValidationRule" (success);
CREATE INDEX IF NOT EXISTS idx_track_validationrule_tracking_intent ON "matching"."TrackingIntentValidationRule" (tracking_intent);
CREATE INDEX IF NOT EXISTS idx_track_validationrule_success ON "matching"."TrackingIntentValidationRule" (success);

-- Create updated_at triggers for tables that need them
CREATE OR REPLACE FUNCTION "matching".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers (only if updated_at column exists)
DROP TRIGGER IF EXISTS update_processintent_updated_at ON "matching"."ProcessIntent";
-- Uncomment the line below if ProcessIntent has updated_at column:
-- CREATE TRIGGER update_processintent_updated_at 
--     BEFORE UPDATE ON "matching"."ProcessIntent" 
--     FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_extractintent_updated_at ON "matching"."ExtractIntent";
CREATE TRIGGER update_extractintent_updated_at 
    BEFORE UPDATE ON "matching"."ExtractIntent" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_trackingintent_updated_at ON "matching"."TrackingIntent";
CREATE TRIGGER update_trackingintent_updated_at 
    BEFORE UPDATE ON "matching"."TrackingIntent" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_acquisitionintent_updated_at ON "matching"."AcquisitionIntent";
CREATE TRIGGER update_acquisitionintent_updated_at 
    BEFORE UPDATE ON "matching"."AcquisitionIntent" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_productrules_updated_at ON "matching"."ProductRules";
CREATE TRIGGER update_productrules_updated_at 
    BEFORE UPDATE ON "matching"."ProductRules" 
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_acq_validationrule_updated_at ON "matching"."AcquisitionIntentValidationRule";
CREATE TRIGGER update_acq_validationrule_updated_at
    BEFORE UPDATE ON "matching"."AcquisitionIntentValidationRule"
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

DROP TRIGGER IF EXISTS update_track_validationrule_updated_at ON "matching"."TrackingIntentValidationRule";
CREATE TRIGGER update_track_validationrule_updated_at
    BEFORE UPDATE ON "matching"."TrackingIntentValidationRule"
    FOR EACH ROW EXECUTE FUNCTION "matching".update_updated_at_column();

-- Sample ProductRules data (adjust category UUIDs as needed)
-- INSERT INTO "matching"."ProductRules" (category, type, min, max) VALUES 
-- ('your-electronics-category-uuid', 'price', 100, 50000),
-- ('your-electronics-category-uuid', 'price_per_unit', 50, 25000),
-- ('your-electronics-category-uuid', 'quantity', 1, 10);

-- Migration complete
-- Remember to:
-- 1. Update database.generated.ts after running this migration
-- 2. Migrate existing ProcessIntent data to new schema if needed
-- 3. Test all constraints and indexes
-- 4. Update application code to use new schema





 -- Grant usage on matching schema to authenticated users
  -- GRANT USAGE ON SCHEMA matching TO authenticated;

  -- Grant select permissions on all matching tables
  -- GRANT SELECT ON matching."ProcessIntent" TO authenticated;
  -- GRANT SELECT ON matching."ExtractIntent" TO authenticated;
  -- GRANT SELECT ON matching."TrackingIntent" TO authenticated;
  -- GRANT SELECT ON matching."AcquisitionIntent" TO authenticated;
  -- GRANT SELECT ON matching."AcquisitionIntentSpecsMatching" TO authenticated;
  -- GRANT SELECT ON matching."ProductRules" TO authenticated;
  -- GRANT SELECT ON matching."ProcessIntentAIUsage" TO authenticated;

  alter table "matching"."ProcessIntent" drop column "target_url";

alter table "matching"."ProcessIntent" alter column "type" drop not null;