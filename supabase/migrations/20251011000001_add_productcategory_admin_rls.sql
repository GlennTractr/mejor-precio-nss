-- Add RLS policies for ProductCategory - admin only for insert, update, delete

-- INSERT policy: Only admins can insert
DROP POLICY IF EXISTS "Admin can insert ProductCategory" ON "public"."ProductCategory";
CREATE POLICY "Admin can insert ProductCategory"
    ON "public"."ProductCategory" FOR INSERT
    TO authenticated
    WITH CHECK ("public".is_admin());

-- UPDATE policy: Only admins can update
DROP POLICY IF EXISTS "Admin can update ProductCategory" ON "public"."ProductCategory";
CREATE POLICY "Admin can update ProductCategory"
    ON "public"."ProductCategory" FOR UPDATE
    TO authenticated
    USING ("public".is_admin())
    WITH CHECK ("public".is_admin());

-- DELETE policy: Only admins can delete
DROP POLICY IF EXISTS "Admin can delete ProductCategory" ON "public"."ProductCategory";
CREATE POLICY "Admin can delete ProductCategory"
    ON "public"."ProductCategory" FOR DELETE
    TO authenticated
    USING ("public".is_admin());
