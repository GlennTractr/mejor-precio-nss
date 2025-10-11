-- Add image_validated field to Product table
ALTER TABLE "public"."Product"
ADD COLUMN "image_validated" boolean DEFAULT NULL;

-- Add comment to document the field
COMMENT ON COLUMN "public"."Product"."image_validated" IS 'Indicates whether the product image has been validated';
