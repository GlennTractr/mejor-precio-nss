-- Add user roles and RLS policies for matching schema
-- This migration adds role-based access control with admin/user roles

-- 1. Create profiles table for user roles
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'user'))
);

-- Create updated_at trigger for profiles
CREATE OR REPLACE FUNCTION "public".update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON "public"."profiles";
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON "public"."profiles" 
    FOR EACH ROW EXECUTE FUNCTION "public".update_profiles_updated_at();

-- 2. Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION "public".handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "public"."profiles" (id, role)
    VALUES (new.id, 'user');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION "public".handle_new_user();

-- 3. Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION "public".is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM "public"."profiles" 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable RLS on all matching schema tables
ALTER TABLE "matching"."ProcessIntent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."ExtractIntent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."TrackingIntent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."AcquisitionIntent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."AcquisitionIntentSpecsMatching" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."ProductRules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."ProcessIntentAIUsage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."BannedUrl" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."AcquisitionIntentValidationRule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."TrackingIntentValidationRule" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles table
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for matching schema tables - admin only access

-- ProcessIntent policies
DROP POLICY IF EXISTS "Admin can read ProcessIntent" ON "matching"."ProcessIntent";
CREATE POLICY "Admin can read ProcessIntent" 
    ON "matching"."ProcessIntent" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert ProcessIntent" ON "matching"."ProcessIntent";
CREATE POLICY "Admin can insert ProcessIntent" 
    ON "matching"."ProcessIntent" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update ProcessIntent" ON "matching"."ProcessIntent";
CREATE POLICY "Admin can update ProcessIntent" 
    ON "matching"."ProcessIntent" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete ProcessIntent" ON "matching"."ProcessIntent";
CREATE POLICY "Admin can delete ProcessIntent" 
    ON "matching"."ProcessIntent" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- ExtractIntent policies
DROP POLICY IF EXISTS "Admin can read ExtractIntent" ON "matching"."ExtractIntent";
CREATE POLICY "Admin can read ExtractIntent" 
    ON "matching"."ExtractIntent" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert ExtractIntent" ON "matching"."ExtractIntent";
CREATE POLICY "Admin can insert ExtractIntent" 
    ON "matching"."ExtractIntent" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update ExtractIntent" ON "matching"."ExtractIntent";
CREATE POLICY "Admin can update ExtractIntent" 
    ON "matching"."ExtractIntent" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete ExtractIntent" ON "matching"."ExtractIntent";
CREATE POLICY "Admin can delete ExtractIntent" 
    ON "matching"."ExtractIntent" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- TrackingIntent policies
DROP POLICY IF EXISTS "Admin can read TrackingIntent" ON "matching"."TrackingIntent";
CREATE POLICY "Admin can read TrackingIntent" 
    ON "matching"."TrackingIntent" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert TrackingIntent" ON "matching"."TrackingIntent";
CREATE POLICY "Admin can insert TrackingIntent" 
    ON "matching"."TrackingIntent" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update TrackingIntent" ON "matching"."TrackingIntent";
CREATE POLICY "Admin can update TrackingIntent" 
    ON "matching"."TrackingIntent" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete TrackingIntent" ON "matching"."TrackingIntent";
CREATE POLICY "Admin can delete TrackingIntent" 
    ON "matching"."TrackingIntent" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- AcquisitionIntent policies
DROP POLICY IF EXISTS "Admin can read AcquisitionIntent" ON "matching"."AcquisitionIntent";
CREATE POLICY "Admin can read AcquisitionIntent" 
    ON "matching"."AcquisitionIntent" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert AcquisitionIntent" ON "matching"."AcquisitionIntent";
CREATE POLICY "Admin can insert AcquisitionIntent" 
    ON "matching"."AcquisitionIntent" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update AcquisitionIntent" ON "matching"."AcquisitionIntent";
CREATE POLICY "Admin can update AcquisitionIntent" 
    ON "matching"."AcquisitionIntent" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete AcquisitionIntent" ON "matching"."AcquisitionIntent";
CREATE POLICY "Admin can delete AcquisitionIntent" 
    ON "matching"."AcquisitionIntent" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- AcquisitionIntentSpecsMatching policies
DROP POLICY IF EXISTS "Admin can read AcquisitionIntentSpecsMatching" ON "matching"."AcquisitionIntentSpecsMatching";
CREATE POLICY "Admin can read AcquisitionIntentSpecsMatching" 
    ON "matching"."AcquisitionIntentSpecsMatching" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert AcquisitionIntentSpecsMatching" ON "matching"."AcquisitionIntentSpecsMatching";
CREATE POLICY "Admin can insert AcquisitionIntentSpecsMatching" 
    ON "matching"."AcquisitionIntentSpecsMatching" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update AcquisitionIntentSpecsMatching" ON "matching"."AcquisitionIntentSpecsMatching";
CREATE POLICY "Admin can update AcquisitionIntentSpecsMatching" 
    ON "matching"."AcquisitionIntentSpecsMatching" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete AcquisitionIntentSpecsMatching" ON "matching"."AcquisitionIntentSpecsMatching";
CREATE POLICY "Admin can delete AcquisitionIntentSpecsMatching" 
    ON "matching"."AcquisitionIntentSpecsMatching" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- ProductRules policies
DROP POLICY IF EXISTS "Admin can read ProductRules" ON "matching"."ProductRules";
CREATE POLICY "Admin can read ProductRules" 
    ON "matching"."ProductRules" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert ProductRules" ON "matching"."ProductRules";
CREATE POLICY "Admin can insert ProductRules" 
    ON "matching"."ProductRules" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update ProductRules" ON "matching"."ProductRules";
CREATE POLICY "Admin can update ProductRules" 
    ON "matching"."ProductRules" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete ProductRules" ON "matching"."ProductRules";
CREATE POLICY "Admin can delete ProductRules" 
    ON "matching"."ProductRules" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- ProcessIntentAIUsage policies
DROP POLICY IF EXISTS "Admin can read ProcessIntentAIUsage" ON "matching"."ProcessIntentAIUsage";
CREATE POLICY "Admin can read ProcessIntentAIUsage" 
    ON "matching"."ProcessIntentAIUsage" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert ProcessIntentAIUsage" ON "matching"."ProcessIntentAIUsage";
CREATE POLICY "Admin can insert ProcessIntentAIUsage" 
    ON "matching"."ProcessIntentAIUsage" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update ProcessIntentAIUsage" ON "matching"."ProcessIntentAIUsage";
CREATE POLICY "Admin can update ProcessIntentAIUsage" 
    ON "matching"."ProcessIntentAIUsage" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete ProcessIntentAIUsage" ON "matching"."ProcessIntentAIUsage";
CREATE POLICY "Admin can delete ProcessIntentAIUsage" 
    ON "matching"."ProcessIntentAIUsage" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- BannedUrl policies
DROP POLICY IF EXISTS "Admin can read BannedUrl" ON "matching"."BannedUrl";
CREATE POLICY "Admin can read BannedUrl" 
    ON "matching"."BannedUrl" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert BannedUrl" ON "matching"."BannedUrl";
CREATE POLICY "Admin can insert BannedUrl" 
    ON "matching"."BannedUrl" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update BannedUrl" ON "matching"."BannedUrl";
CREATE POLICY "Admin can update BannedUrl" 
    ON "matching"."BannedUrl" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete BannedUrl" ON "matching"."BannedUrl";
CREATE POLICY "Admin can delete BannedUrl" 
    ON "matching"."BannedUrl" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- AcquisitionIntentValidationRule policies
DROP POLICY IF EXISTS "Admin can read AcquisitionIntentValidationRule" ON "matching"."AcquisitionIntentValidationRule";
CREATE POLICY "Admin can read AcquisitionIntentValidationRule" 
    ON "matching"."AcquisitionIntentValidationRule" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert AcquisitionIntentValidationRule" ON "matching"."AcquisitionIntentValidationRule";
CREATE POLICY "Admin can insert AcquisitionIntentValidationRule" 
    ON "matching"."AcquisitionIntentValidationRule" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update AcquisitionIntentValidationRule" ON "matching"."AcquisitionIntentValidationRule";
CREATE POLICY "Admin can update AcquisitionIntentValidationRule" 
    ON "matching"."AcquisitionIntentValidationRule" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete AcquisitionIntentValidationRule" ON "matching"."AcquisitionIntentValidationRule";
CREATE POLICY "Admin can delete AcquisitionIntentValidationRule" 
    ON "matching"."AcquisitionIntentValidationRule" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- TrackingIntentValidationRule policies
DROP POLICY IF EXISTS "Admin can read TrackingIntentValidationRule" ON "matching"."TrackingIntentValidationRule";
CREATE POLICY "Admin can read TrackingIntentValidationRule" 
    ON "matching"."TrackingIntentValidationRule" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admin can insert TrackingIntentValidationRule" ON "matching"."TrackingIntentValidationRule";
CREATE POLICY "Admin can insert TrackingIntentValidationRule" 
    ON "matching"."TrackingIntentValidationRule" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can update TrackingIntentValidationRule" ON "matching"."TrackingIntentValidationRule";
CREATE POLICY "Admin can update TrackingIntentValidationRule" 
    ON "matching"."TrackingIntentValidationRule" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

DROP POLICY IF EXISTS "Admin can delete TrackingIntentValidationRule" ON "matching"."TrackingIntentValidationRule";
CREATE POLICY "Admin can delete TrackingIntentValidationRule" 
    ON "matching"."TrackingIntentValidationRule" FOR DELETE
    TO authenticated
    USING ("public".is_admin());

-- 6. Profiles table RLS policies
DROP POLICY IF EXISTS "Users can read own profile" ON "public"."profiles";
CREATE POLICY "Users can read own profile" 
    ON "public"."profiles" FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON "public"."profiles";
CREATE POLICY "Users can update own profile" 
    ON "public"."profiles" FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON "public"."profiles";
CREATE POLICY "Admins can read all profiles" 
    ON "public"."profiles" FOR SELECT
    TO authenticated
    USING ("public".is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON "public"."profiles";
CREATE POLICY "Admins can update all profiles" 
    ON "public"."profiles" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

-- 7. Grant permissions
GRANT USAGE ON SCHEMA "public" TO authenticated;
GRANT ALL ON "public"."profiles" TO authenticated;

-- Remove previous broad permissions and grant specific ones
REVOKE ALL ON matching."ProcessIntent" FROM authenticated;
REVOKE ALL ON matching."ExtractIntent" FROM authenticated;
REVOKE ALL ON matching."TrackingIntent" FROM authenticated;
REVOKE ALL ON matching."AcquisitionIntent" FROM authenticated;
REVOKE ALL ON matching."AcquisitionIntentSpecsMatching" FROM authenticated;
REVOKE ALL ON matching."ProductRules" FROM authenticated;
REVOKE ALL ON matching."ProcessIntentAIUsage" FROM authenticated;
REVOKE ALL ON matching."BannedUrl" FROM authenticated;
REVOKE ALL ON matching."AcquisitionIntentValidationRule" FROM authenticated;
REVOKE ALL ON matching."TrackingIntentValidationRule" FROM authenticated;

-- Grant basic permissions (RLS policies will control actual access)
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."ProcessIntent" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."ExtractIntent" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."TrackingIntent" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."AcquisitionIntent" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."AcquisitionIntentSpecsMatching" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."ProductRules" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."ProcessIntentAIUsage" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."BannedUrl" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."AcquisitionIntentValidationRule" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matching."TrackingIntentValidationRule" TO authenticated;

-- Migration complete
-- To make a user admin, run:
-- UPDATE "public"."profiles" SET role = 'admin' WHERE id = 'user-uuid';