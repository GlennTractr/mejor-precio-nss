-- Add tracking_enabled, acquisition_enabled and mode fields to ProcessIntent table
-- Migration date: 2025-09-29 00:00:00

-- Add the new mode fields to ProcessIntent table
ALTER TABLE "matching"."ProcessIntent"
ADD COLUMN IF NOT EXISTS "tracking_enabled" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "acquisition_enabled" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "mode" TEXT;
;

-- Add indexes for performance (optional but recommended if these fields will be queried frequently)
CREATE INDEX IF NOT EXISTS idx_processintent_tracking_enabled ON "matching"."ProcessIntent" ("tracking_enabled");
CREATE INDEX IF NOT EXISTS idx_processintent_acquisition_enabled ON "matching"."ProcessIntent" ("acquisition_enabled");
CREATE INDEX IF NOT EXISTS idx_processintent_mode ON "matching"."ProcessIntent" ("mode");

-- Add a comment to document the purpose of these fields
COMMENT ON COLUMN "matching"."ProcessIntent"."tracking_enabled" IS 'Enabled for tracking operations';
COMMENT ON COLUMN "matching"."ProcessIntent"."acquisition_enabled" IS 'Enabled for acquisition operations';
COMMENT ON COLUMN "matching"."ProcessIntent"."mode" IS 'Mode used for operations';