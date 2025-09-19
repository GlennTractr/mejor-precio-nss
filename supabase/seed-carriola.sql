-- ==============================================================================
-- SEED DATA FOR STROLLER PRODUCTS (CARRIOLAS)
-- ==============================================================================
-- This seed file populates the database with stroller data from poussette-mx.json
-- Includes brands, models, categories, and specifications for Mexico market
--
-- ==============================================================================
-- QUANTITY TYPES FOR CARRIOLAS
-- ==============================================================================

-- Insert QuantityType data for carriolas (Spanish only)
INSERT INTO "public"."QuantityType" ("id", "label", "internal_label", "unit_label") VALUES 
('990e8400-e29b-41d4-a716-446655440001', 'Unidades', 'unidades_es', 'por unidad');

-- ==============================================================================
-- PRODUCT CATEGORIES FOR CARRIOLAS
-- ==============================================================================

-- Insert ProductCategory data for carriolas (Mexico only - Spanish)
INSERT INTO "public"."ProductCategory" ("id", "created_at", "label", "slug", "image_bucket", "image_path", "country", "quantity_type", "description") VALUES 
('c1bb06cd-b954-498b-a45e-770900f29466', NOW(), 'Carriolas', 'carriolas', null, null, '440e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'Descubre la carriola perfecta para tu bebé al mejor precio del mercado. Comparamos todas las marcas premium como Graco, Chicco, Baby Trend, Evenflo y más, en todas las tiendas para que elijas la carriola ideal según tus necesidades y estilo de vida. Desde carriolas ligeras para ciudad hasta sistemas de viaje completos y carriolas deportivas para correr. La comodidad y seguridad de tu bebé son fundamentales, por eso te ayudamos a encontrar la mejor carriola con la mejor relación calidad-precio.'); -- MX, Spanish Carriolas

-- ==============================================================================
-- PRODUCT BRANDS FOR CARRIOLAS
-- ==============================================================================

-- Insert ProductBrand data for carriola brands
INSERT INTO "public"."ProductBrand" ("id", "created_at", "label") VALUES 
('c1dcc1e6-362c-4572-8575-ad865a081e76', NOW(), 'Graco'),
('c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', NOW(), 'Evenflo'),
('c331009f-e566-4b1b-a2ba-ada18ed00f9e', NOW(), 'Baby Trend'),
('c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', NOW(), 'Chicco'),
('c5b603fd-cef0-4732-9790-82925b987f41', NOW(), 'Joie'),
('c60be820-d5fe-4e94-97e4-96630d3df96f', NOW(), 'Cybex'),
('c7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', NOW(), 'GB'),
('c8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', NOW(), 'Maxi-Cosi'),
('c9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', NOW(), 'Nuna'),
('ca11c1e6-362c-4572-8575-ad865a081e77', NOW(), 'Baby Jogger'),
('cb22c1e6-362c-4572-8575-ad865a081e78', NOW(), 'UPPAbaby'),
('cc33c1e6-362c-4572-8575-ad865a081e79', NOW(), 'Peg Perego'),
('cd44c1e6-362c-4572-8575-ad865a081e80', NOW(), 'Britax'),
('ce55c1e6-362c-4572-8575-ad865a081e81', NOW(), 'Cosco'),
('cf66c1e6-362c-4572-8575-ad865a081e82', NOW(), 'Safety 1st');

-- ==============================================================================
-- PRODUCT BRAND CATEGORY ASSOCIATIONS
-- ==============================================================================

-- Link carriola brands to carriola categories (Mexico only)
INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES 
('c1bb06cd-b954-498b-a45e-770900f29466', 'c1dcc1e6-362c-4572-8575-ad865a081e76'), -- Graco
('c1bb06cd-b954-498b-a45e-770900f29466', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6'), -- Evenflo
('c1bb06cd-b954-498b-a45e-770900f29466', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e'), -- Baby Trend
('c1bb06cd-b954-498b-a45e-770900f29466', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413'), -- Chicco
('c1bb06cd-b954-498b-a45e-770900f29466', 'c5b603fd-cef0-4732-9790-82925b987f41'), -- Joie
('c1bb06cd-b954-498b-a45e-770900f29466', 'c60be820-d5fe-4e94-97e4-96630d3df96f'), -- Cybex
('c1bb06cd-b954-498b-a45e-770900f29466', 'c7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e'), -- GB
('c1bb06cd-b954-498b-a45e-770900f29466', 'c8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f'), -- Maxi-Cosi
('c1bb06cd-b954-498b-a45e-770900f29466', 'c9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a'), -- Nuna
('c1bb06cd-b954-498b-a45e-770900f29466', 'ca11c1e6-362c-4572-8575-ad865a081e77'), -- Baby Jogger
('c1bb06cd-b954-498b-a45e-770900f29466', 'cb22c1e6-362c-4572-8575-ad865a081e78'), -- UPPAbaby
('c1bb06cd-b954-498b-a45e-770900f29466', 'cc33c1e6-362c-4572-8575-ad865a081e79'), -- Peg Perego
('c1bb06cd-b954-498b-a45e-770900f29466', 'cd44c1e6-362c-4572-8575-ad865a081e80'), -- Britax
('c1bb06cd-b954-498b-a45e-770900f29466', 'ce55c1e6-362c-4572-8575-ad865a081e81'), -- Cosco
('c1bb06cd-b954-498b-a45e-770900f29466', 'cf66c1e6-362c-4572-8575-ad865a081e82'); -- Safety 1st

-- ==============================================================================
-- PRODUCT MODELS FOR CARRIOLAS
-- ==============================================================================

-- Graco Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m1a1c1e6-362c-4572-8575-ad865a081e83', NOW(), 'Modes', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m1a2c1e6-362c-4572-8575-ad865a081e84', NOW(), 'FastAction', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m1a3c1e6-362c-4572-8575-ad865a081e85', NOW(), 'Pramette', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m1a4c1e6-362c-4572-8575-ad865a081e86', NOW(), 'Ready2Grow', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m1a5c1e6-362c-4572-8575-ad865a081e87', NOW(), 'Verb', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m1a6c1e6-362c-4572-8575-ad865a081e88', NOW(), 'LiteRider LX', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m1a7c1e6-362c-4572-8575-ad865a081e89', NOW(), 'Jogger', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m1a8c1e6-362c-4572-8575-ad865a081e90', NOW(), 'DuoGlider', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Evenflo Models  
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m2a1c1e6-362c-4572-8575-ad865a081e91', NOW(), 'Pivot', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m2a2c1e6-362c-4572-8575-ad865a081e92', NOW(), 'Pivot Xpand', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m2a3c1e6-362c-4572-8575-ad865a081e93', NOW(), 'Omni Plus', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m2a4c1e6-362c-4572-8575-ad865a081e94', NOW(), 'Sibby', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m2a5c1e6-362c-4572-8575-ad865a081e95', NOW(), 'Victory Jogger', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Baby Trend Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m3a1c1e6-362c-4572-8575-ad865a081e96', NOW(), 'Expedition Jogger', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m3a2c1e6-362c-4572-8575-ad865a081e97', NOW(), 'Sit N Stand', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m3a3c1e6-362c-4572-8575-ad865a081e98', NOW(), 'Tango', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m3a4c1e6-362c-4572-8575-ad865a081e99', NOW(), 'Skyview', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m3a5c1e6-362c-4572-8575-ad865a081e9a', NOW(), 'Tri-Fold Mini', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m3a6c1e6-362c-4572-8575-ad865a081e9b', NOW(), 'Navigator', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m3a7c1e6-362c-4572-8575-ad865a081e9c', NOW(), 'Range Jogger', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m3a8c1e6-362c-4572-8575-ad865a081e9d', NOW(), 'EZ Ride', 'c331009f-e566-4b1b-a2ba-ada18ed00f9e', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Chicco Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m4a1c1e6-362c-4572-8575-ad865a081e9e', NOW(), 'Bravo', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m4a2c1e6-362c-4572-8575-ad865a081e9f', NOW(), 'Bravo LE', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m4a3c1e6-362c-4572-8575-ad865a081ea0', NOW(), 'Mini Bravo', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m4a4c1e6-362c-4572-8575-ad865a081ea1', NOW(), 'Viaro', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m4a5c1e6-362c-4572-8575-ad865a081ea2', NOW(), 'Liteway', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m4a6c1e6-362c-4572-8575-ad865a081ea3', NOW(), 'Corso', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m4a7c1e6-362c-4572-8575-ad865a081ea4', NOW(), 'Activ3', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m4a8c1e6-362c-4572-8575-ad865a081ea5', NOW(), 'Goody Plus', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Joie Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m5a1c1e6-362c-4572-8575-ad865a081ea6', NOW(), 'Litetrax 4', 'c5b603fd-cef0-4732-9790-82925b987f41', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m5a2c1e6-362c-4572-8575-ad865a081ea7', NOW(), 'Versatrax', 'c5b603fd-cef0-4732-9790-82925b987f41', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m5a3c1e6-362c-4572-8575-ad865a081ea8', NOW(), 'Pact', 'c5b603fd-cef0-4732-9790-82925b987f41', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m5a4c1e6-362c-4572-8575-ad865a081ea9', NOW(), 'Mytrax', 'c5b603fd-cef0-4732-9790-82925b987f41', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m5a5c1e6-362c-4572-8575-ad865a081eaa', NOW(), 'Muze LX', 'c5b603fd-cef0-4732-9790-82925b987f41', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Cybex Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m6a1c1e6-362c-4572-8575-ad865a081eab', NOW(), 'Priam', 'c60be820-d5fe-4e94-97e4-96630d3df96f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m6a2c1e6-362c-4572-8575-ad865a081eac', NOW(), 'Mios', 'c60be820-d5fe-4e94-97e4-96630d3df96f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m6a3c1e6-362c-4572-8575-ad865a081ead', NOW(), 'Balios S', 'c60be820-d5fe-4e94-97e4-96630d3df96f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m6a4c1e6-362c-4572-8575-ad865a081eae', NOW(), 'Gazelle S', 'c60be820-d5fe-4e94-97e4-96630d3df96f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m6a5c1e6-362c-4572-8575-ad865a081eaf', NOW(), 'Eezy S Twist', 'c60be820-d5fe-4e94-97e4-96630d3df96f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m6a6c1e6-362c-4572-8575-ad865a081eb0', NOW(), 'Libelle', 'c60be820-d5fe-4e94-97e4-96630d3df96f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m6a7c1e6-362c-4572-8575-ad865a081eb1', NOW(), 'Talos S', 'c60be820-d5fe-4e94-97e4-96630d3df96f', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- GB Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m7a1c1e6-362c-4572-8575-ad865a081eb2', NOW(), 'Pockit', 'c7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m7a2c1e6-362c-4572-8575-ad865a081eb3', NOW(), 'Pockit+ All-City', 'c7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m7a3c1e6-362c-4572-8575-ad865a081eb4', NOW(), 'Qbit', 'c7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m7a4c1e6-362c-4572-8575-ad865a081eb5', NOW(), 'Qbit+ All-City', 'c7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Maxi-Cosi Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m8a1c1e6-362c-4572-8575-ad865a081eb6', NOW(), 'Zelia', 'c8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m8a2c1e6-362c-4572-8575-ad865a081eb7', NOW(), 'Adorra', 'c8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m8a3c1e6-362c-4572-8575-ad865a081eb8', NOW(), 'Lila', 'c8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m8a4c1e6-362c-4572-8575-ad865a081eb9', NOW(), 'Lara', 'c8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m8a5c1e6-362c-4572-8575-ad865a081eba', NOW(), 'Gia', 'c8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Nuna Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m9a1c1e6-362c-4572-8575-ad865a081ebb', NOW(), 'MIXX', 'c9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m9a2c1e6-362c-4572-8575-ad865a081ebc', NOW(), 'TRIV', 'c9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m9a3c1e6-362c-4572-8575-ad865a081ebd', NOW(), 'TAVO', 'c9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m9a4c1e6-362c-4572-8575-ad865a081ebe', NOW(), 'DEMI Grow', 'c9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m9a5c1e6-362c-4572-8575-ad865a081ebf', NOW(), 'TRVL', 'c9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Baby Jogger Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m10a1c1e-362c-4572-8575-ad865a081ec0', NOW(), 'City Mini 2', 'ca11c1e6-362c-4572-8575-ad865a081e77', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m10a2c1e-362c-4572-8575-ad865a081ec1', NOW(), 'City Mini GT2', 'ca11c1e6-362c-4572-8575-ad865a081e77', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m10a3c1e-362c-4572-8575-ad865a081ec2', NOW(), 'City Tour 2', 'ca11c1e6-362c-4572-8575-ad865a081e77', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m10a4c1e-362c-4572-8575-ad865a081ec3', NOW(), 'City Select 2', 'ca11c1e6-362c-4572-8575-ad865a081e77', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m10a5c1e-362c-4572-8575-ad865a081ec4', NOW(), 'City Elite 2', 'ca11c1e6-362c-4572-8575-ad865a081e77', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- UPPAbaby Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m11a1c1e-362c-4572-8575-ad865a081ec5', NOW(), 'VISTA', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m11a2c1e-362c-4572-8575-ad865a081ec6', NOW(), 'CRUZ', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m11a3c1e-362c-4572-8575-ad865a081ec7', NOW(), 'MINU', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m11a4c1e-362c-4572-8575-ad865a081ec8', NOW(), 'RIDGE', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Peg Perego Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m12a1c1e-362c-4572-8575-ad865a081ec9', NOW(), 'Book', 'cc33c1e6-362c-4572-8575-ad865a081e79', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m12a2c1e-362c-4572-8575-ad865a081eca', NOW(), 'Booklet', 'cc33c1e6-362c-4572-8575-ad865a081e79', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m12a3c1e-362c-4572-8575-ad865a081ecb', NOW(), 'YPSI', 'cc33c1e6-362c-4572-8575-ad865a081e79', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m12a4c1e-362c-4572-8575-ad865a081ecc', NOW(), 'Pliko Mini', 'cc33c1e6-362c-4572-8575-ad865a081e79', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m12a5c1e-362c-4572-8575-ad865a081ecd', NOW(), 'Selfie', 'cc33c1e6-362c-4572-8575-ad865a081e79', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Britax Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m13a1c1e-362c-4572-8575-ad865a081ece', NOW(), 'B-Lively', 'cd44c1e6-362c-4572-8575-ad865a081e80', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m13a2c1e-362c-4572-8575-ad865a081ecf', NOW(), 'B-Free', 'cd44c1e6-362c-4572-8575-ad865a081e80', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m13a3c1e-362c-4572-8575-ad865a081ed0', NOW(), 'B-Agile', 'cd44c1e6-362c-4572-8575-ad865a081e80', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Cosco Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m14a1c1e-362c-4572-8575-ad865a081ed1', NOW(), 'Lift & Stroll', 'ce55c1e6-362c-4572-8575-ad865a081e81', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m14a2c1e-362c-4572-8575-ad865a081ed2', NOW(), 'Simple Fold', 'ce55c1e6-362c-4572-8575-ad865a081e81', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m14a3c1e-362c-4572-8575-ad865a081ed3', NOW(), 'Umbrella', 'ce55c1e6-362c-4572-8575-ad865a081e81', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Safety 1st Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('m15a1c1e-362c-4572-8575-ad865a081ed4', NOW(), 'Teeny', 'cf66c1e6-362c-4572-8575-ad865a081e82', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m15a2c1e-362c-4572-8575-ad865a081ed5', NOW(), 'Riva', 'cf66c1e6-362c-4572-8575-ad865a081e82', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('m15a3c1e-362c-4572-8575-ad865a081ed6', NOW(), 'Smooth Ride', 'cf66c1e6-362c-4572-8575-ad865a081e82', 'c1bb06cd-b954-498b-a45e-770900f29466');


-- ==============================================================================
-- PRODUCT SPECIFICATIONS FOR CARRIOLAS
-- ==============================================================================

-- Spanish ProductSpecs entries (Mexico only) for carriola types
INSERT INTO "public"."ProductSpecs" ("id", "created_at", "category", "type", "label") VALUES 
('s1e04c0c-69d3-4225-8b72-b88166f81209', NOW(), 'c1bb06cd-b954-498b-a45e-770900f29466', 'type', 'Estándar'),
('s2ff8811-a780-4e24-ad72-dcc593b39bdc', NOW(), 'c1bb06cd-b954-498b-a45e-770900f29466', 'type', 'Jogger'),
('s3bd61ae-dea5-4cfa-81ff-541641b46ad1', NOW(), 'c1bb06cd-b954-498b-a45e-770900f29466', 'type', 'Sistema de Viaje'),
('s4166304-cf09-477d-ac3a-c75cad11f20f', NOW(), 'c1bb06cd-b954-498b-a45e-770900f29466', 'type', 'Paraguas'),
('s5277415-ea1a-588e-bd4b-d86dbe22e310', NOW(), 'c1bb06cd-b954-498b-a45e-770900f29466', 'type', 'Doble');

-- ==============================================================================
-- AI CONTEXT ENHANCEMENT FOR CARRIOLAS
-- ==============================================================================

-- Insert CategoryPrompt data for carriola categories (Mexico only - Spanish)
INSERT INTO "matching"."CategoryPrompt" ("category", "ai_price_context", "ai_quantity_context") VALUES 
('c1bb06cd-b954-498b-a45e-770900f29466', 'Para carriolas: Rangos de precios típicos 2000-25000 MXN dependiendo del tipo y marca. Precios premium: 15000-25000 MXN, precios económicos: 2000-8000 MXN, gama media: 8000-15000 MXN. Buscar indicadores: "oferta", "descuento", "precio especial", "rebaja", "liquidación".', 'Para carriolas: Buscar cantidades específicas como "1 carriola", "unidad", "pieza". Normalmente se vende una carriola por producto. Términos: "carriola", "stroller", "cochecito", "unidad", "pieza", "sistema completo".');

-- Insert QuantityTypePrompt data for AI quantity context (Spanish only)
INSERT INTO "matching"."QuantityTypePrompt" ("quantity_type", "ai_quantity_context") VALUES 
('990e8400-e29b-41d4-a716-446655440001', 'Para unidades: Buscar cantidades numéricas simples. Normalmente las carriolas se venden de una en una. Conversiones: "1 carriola" = 1 unidad, "pieza" = 1 unidad, "kit completo" = 1 unidad. Términos: "unidad", "pieza", "carriola", "set", "kit". Ejemplos: "1 carriola" → 1 unidad, "kit de viaje" → 1 unidad.');

-- Insert ProductSpecsPrompt data for AI specs context (language-specific)
-- Spanish ProductSpecs (Mexico)
INSERT INTO "matching"."ProductSpecsPrompt" ("product_spec", "ai_specs_context") VALUES 
('s1e04c0c-69d3-4225-8b72-b88166f81209', 'Carriola estándar para uso diario y paseos urbanos. Buscar indicadores: "estándar", "urbana", "paseo", "diario", "city", "ciudad". Términos comunes: "para ciudad", "uso diario", "estándar", "básica".'),
('s2ff8811-a780-4e24-ad72-dcc593b39bdc', 'Carriola jogger para actividades deportivas y terrenos irregulares. Buscar indicadores: "jogger", "deportiva", "running", "correr", "terreno", "todo terreno", "3 ruedas". Términos comunes: "para correr", "jogger", "deportiva", "off-road".'),
('s3bd61ae-dea5-4cfa-81ff-541641b46ad1', 'Sistema de viaje con asiento de auto incluido. Buscar indicadores: "sistema de viaje", "travel system", "con asiento", "car seat", "desde nacimiento", "4 en 1", "completo". Términos comunes: "sistema completo", "con car seat", "travel system".'),
('s4166304-cf09-477d-ac3a-c75cad11f20f', 'Carriola tipo paraguas, ligera y compacta. Buscar indicadores: "paraguas", "umbrella", "ligera", "compacta", "plegable", "viaje", "portátil". Términos comunes: "umbrella", "ligera", "compacta", "fácil plegado".'),
('s5277415-ea1a-588e-bd4b-d86dbe22e310', 'Carriola doble para gemelos o hermanos. Buscar indicadores: "doble", "gemelar", "twins", "hermanos", "2 niños", "side by side", "tándem". Términos comunes: "doble", "gemelar", "para dos".');


-- ProductRules for Carriolas category (Mexico only)
INSERT INTO "matching"."ProductRules" (category, type, min, max) VALUES 
('c1bb06cd-b954-498b-a45e-770900f29466', 'price_per_unit', 1000, 50000),
('c1bb06cd-b954-498b-a45e-770900f29466', 'quantity', 0, 5),
('c1bb06cd-b954-498b-a45e-770900f29466', 'price', 1000, 50000);

-- ==============================================================================
-- FINAL MESSAGE
-- ==============================================================================

-- Carriola seed data completed successfully (Spanish only)
-- Added: 1 Category, 15 Brands, 82 Models, 5 Specs, AI context prompts, and product rules
-- Ready for use in Mexico market (Spanish language only)