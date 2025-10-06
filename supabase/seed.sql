
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- instance_id constant
  'b0860eb9-faa5-48e7-92fa-5b9b3df2d3e9', -- id utilisateur
  'authenticated', -- aud
  'authenticated', -- role
  'glenn@tractr.net', -- email
  crypt('password', gen_salt('bf')), -- mot de passe bcrypt
  NOW(), -- email confirmé
  NOW(), -- last_sign_in_at
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert Language data
INSERT INTO "public"."Language" ("id", "label") VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'en'),
('550e8400-e29b-41d4-a716-446655440002', 'fr'), 
('550e8400-e29b-41d4-a716-446655440003', 'es');

-- Insert Country data with UUID ids and language references
INSERT INTO "public"."Country" ("id", "label", "language") VALUES 
('440e8400-e29b-41d4-a716-446655440001', 'MX', '550e8400-e29b-41d4-a716-446655440003'), -- Mexico -> Spanish
('440e8400-e29b-41d4-a716-446655440002', 'QC', '550e8400-e29b-41d4-a716-446655440002'),  -- Quebec -> French
('440e8400-e29b-41d4-a716-446655440003', 'DISABLED', '550e8400-e29b-41d4-a716-446655440001'); -- Disabled -> English

-- INSERT INTO "public"."File" ("id", "is_public", "file_bucket", "file_path") VALUES ('2eee2e9c-8be9-4da7-bf8c-89ffc4b3182a', true, 'product', 'not_found.png');


-- Insert Shop data with country references
-- Mexico shops
INSERT INTO "public"."Shop" ("id", "label", "img_url", "country") VALUES 
('192114b2-4c05-4a35-86dc-02c90327720a', 'Mercado Libre', '/shop/mercado-libre.png', '440e8400-e29b-41d4-a716-446655440001'),
('691a4aab-c095-4b3a-a547-df136e66ce25', 'Amazon', '/shop/amazon.png', '440e8400-e29b-41d4-a716-446655440001'),
('86cc689f-f2a6-4350-b88c-60b9d80bf228', 'Walmart', '/shop/walmart.png', '440e8400-e29b-41d4-a716-446655440001'),
('94b9d420-8c12-4b04-9699-a0bfa84649bf', 'Aurrera', '/shop/aurrera.png', '440e8400-e29b-41d4-a716-446655440001'),
('97610a47-57f5-46b4-882e-71df9b19f4a3', 'Ahorro', '/shop/ahorro.png', '440e8400-e29b-41d4-a716-446655440001'),
('b88cd8b0-bbf6-4226-ab94-fca45b41d02f', 'Sam''s club', '/shop/sams-club.png', '440e8400-e29b-41d4-a716-446655440001'),
('f5eb82b7-3d56-45f2-af8a-30d9c6c42779', 'Guadalajara', '/shop/guadalajara.png', '440e8400-e29b-41d4-a716-446655440001'),
('aa936c52-90b6-4010-8f4a-f4f368a871b0', 'Chedraui', '/shop/chedraui.png', '440e8400-e29b-41d4-a716-446655440001'),
('9f7fabe7-acca-40b5-a010-bfb2c5f22434', 'Soriana', '/shop/soriana.png', '440e8400-e29b-41d4-a716-446655440001'),
-- Quebec shops
('286c36d4-d9fc-4776-a185-c6fc3098cbb4', 'AmazonCA', '/shop/amazon-ca.png', '440e8400-e29b-41d4-a716-446655440002'),
('8f8fc18c-2afb-4838-b262-63d852225bed', 'SuperC', '/shop/superc.png', '440e8400-e29b-41d4-a716-446655440002'),
('9ee99dcd-c884-49e0-9a64-c7badd496884', 'Jean-Coutu', '/shop/jean.png', '440e8400-e29b-41d4-a716-446655440002');

INSERT INTO "public"."ShopIdentifier" ("id", "shop", "domain") VALUES 
('1', '94b9d420-8c12-4b04-9699-a0bfa84649bf', 'bodegaaurrera.com.mx'),
('2', '86cc689f-f2a6-4350-b88c-60b9d80bf228', 'super.walmart.com.mx'),
('3', '97610a47-57f5-46b4-882e-71df9b19f4a3', 'fahorro.com'),
('4', 'f5eb82b7-3d56-45f2-af8a-30d9c6c42779', 'farmaciasguadalajara.com'),
('5', 'b88cd8b0-bbf6-4226-ab94-fca45b41d02f', 'sams.com.mx'),
('6', 'aa936c52-90b6-4010-8f4a-f4f368a871b0', 'chedraui.com.mx'),
('7', '192114b2-4c05-4a35-86dc-02c90327720a', 'mercadolibre.com.mx'),
('8', '192114b2-4c05-4a35-86dc-02c90327720a', 'listado.mercadolibre.com.mx'),
('9', '691a4aab-c095-4b3a-a547-df136e66ce25', 'amazon.com.mx'),
('10', '9f7fabe7-acca-40b5-a010-bfb2c5f22434', 'soriana.com'),
('11', '94b9d420-8c12-4b04-9699-a0bfa84649bf', 'despensa.bodegaaurrera.com.mx');


-- Seed banned URLs
INSERT INTO "matching"."BannedUrl" (shop, url) VALUES
('691a4aab-c095-4b3a-a547-df136e66ce25', 'https://www.amazon.com.mx/sspa/click'),
('691a4aab-c095-4b3a-a547-df136e66ce25', 'https://www.amazon.com.mx/s');


-- Update existing user to admin role
UPDATE "public"."profiles" SET role = 'admin' WHERE id = 'b0860eb9-faa5-48e7-92fa-5b9b3df2d3e9';

-- Insert profile if not exists (fallback)
INSERT INTO "public"."profiles" (id, role) 
SELECT 'b0860eb9-faa5-48e7-92fa-5b9b3df2d3e9', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM "public"."profiles" WHERE id = 'b0860eb9-faa5-48e7-92fa-5b9b3df2d3e9');

-- ============================================================================
-- Normal Price System - Cron Jobs and Initial Data Population
-- ============================================================================

-- Set up pg_cron jobs for daily refresh (early morning hours)

-- Refresh product_sell_context_normal_price_view at 2:00 AM daily
SELECT cron.schedule(
    'refresh-sell-context-normal-prices', 
    '0 2 * * *', 
    'REFRESH MATERIALIZED VIEW product_sell_context_normal_price_view;'
);

-- Refresh product_packaging_normal_price_view at 3:00 AM daily (after sell context view)
SELECT cron.schedule(
    'refresh-packaging-normal-prices', 
    '0 3 * * *', 
    'REFRESH MATERIALIZED VIEW product_packaging_normal_price_view;'
);

-- Refresh product_normal_price_view at 4:00 AM daily (after packaging view)
SELECT cron.schedule(
    'refresh-product-normal-prices', 
    '0 4 * * *', 
    'REFRESH MATERIALIZED VIEW product_normal_price_view;'
);

-- Initial data population (run the views refresh immediately)

-- Refresh all materialized views to populate with existing data
REFRESH MATERIALIZED VIEW product_sell_context_normal_price_view;
REFRESH MATERIALIZED VIEW product_packaging_normal_price_view;
REFRESH MATERIALIZED VIEW product_normal_price_view;