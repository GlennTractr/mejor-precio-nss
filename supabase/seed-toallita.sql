-- ==============================================================================
-- SEED DATA FOR BABY WIPES PRODUCTS (TOALLITAS)
-- ==============================================================================
-- This seed file populates the daaabase with baby wipes daaa from toallita.json
-- Includes brands, models, categories, and specifications for Mexico and Quebec markets
-- Daaa source: toallita.json with brand/model structure

-- ==============================================================================
-- QUANTITY TYPES FOR TOALLITAS
-- ==============================================================================

-- Insert QuantityType daaa for toallitas (Spanish only, counting packages)
INSERT INTO "public"."QuantityType" ("id", "label", "internal_label", "unit_label") VALUES 
('880e8400-e29b-41d4-a716-446655440002', 'Paquetes', 'toallitas_package', 'por paquete');

-- ==============================================================================
-- PRODUCT BRANDS FOR TOALLITAS
-- ==============================================================================

-- Insert ProductBrand daaa for toallitas brands from toallita.json
INSERT INTO "public"."ProductBrand" ("id", "created_at", "label") VALUES 
('a1dcc1e6-362c-4572-8575-ad865a081e76', NOW(), 'Huggies'),
('a2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', NOW(), 'Pampers'),
('a331009f-e566-4b1b-a2ba-ada18ed00f9e', NOW(), 'Babysec'),
('a43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', NOW(), 'Kleenex'),
('a5b603fd-cef0-4732-9790-82925b987f41', NOW(), 'Johnson''s'),
('5fc07182-d26e-4a4f-b456-82cd7e9f0a60', NOW(), 'Suavinex'),
('a7cc1e6a-362c-4572-8575-ad865a081e77', NOW(), 'Neutrogena'),
('a8ad11d1-8617-4ea9-8889-e6ddd4ed51b7', NOW(), 'Parent''s Choice'),
('a9cc1e6b-362c-4572-8575-ad865a081e78', NOW(), 'WaterWipes'),
('aa0d11d2-8617-4ea9-8889-e6ddd4ed51b8', NOW(), 'Mustela'),
('ab31009f-e566-4b1b-a2ba-ada18ed00fa0', NOW(), 'Bbtips'),
('ac3d6fa3-7b7a-4ef0-9e25-c0af4cf40414', NOW(), 'BioBaby'),
('ad5b603f-cef0-4732-9790-82925b987f42', NOW(), 'Baby Dove'),
('ae0be820-d5fe-4e94-97e4-96630d3df970', NOW(), 'Member''s Mark'),
('af7cc1e6-362c-4572-8575-ad865a081e79', NOW(), 'Kirkland Signature'),
('f9a0b1c2-7c08-4149-bee0-2c708922a400', NOW(), 'Chicco'),
('0a0b1c2d-8d19-4050-bff1-3d819a33b510', NOW(), 'Pigeon'),
('aa0d11d3-8617-4ea9-8889-e6ddd4ed51c0', NOW(), 'Bambo Nature'),
('b131009a-e566-4b1b-a2ba-ada18ed00fa1', NOW(), 'The Honest Company'),
('b23d6fa4-7b7a-4ef0-9e25-c0af4cf40415', NOW(), 'Seventh Generation');

-- ==============================================================================
-- PRODUCT BRAND CATEGORY ASSOCIATIONS
-- ==============================================================================

-- Link toallitas brands to existing toallitas category (Mexico)
-- Note: Using existing category UUID from seed.sql: 9b16f8f5-a36b-4a58-a81e-669a711556ba
INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES 
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a1dcc1e6-362c-4572-8575-ad865a081e76'), -- Huggies
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a2ad11d0-8617-4ea9-8889-e6ddd4ed51b6'), -- Pampers
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a331009f-e566-4b1b-a2ba-ada18ed00f9e'), -- Babysec
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a43d6fa2-7b7a-4ef0-9e25-c0af4cf40413'), -- Kleenex
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a5b603fd-cef0-4732-9790-82925b987f41'), -- Johnson's
('9b16f8f5-a36b-4a58-a81e-669a711556ba', '5fc07182-d26e-4a4f-b456-82cd7e9f0a60'), -- Suavinex
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a7cc1e6a-362c-4572-8575-ad865a081e77'), -- Neutrogena
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a8ad11d1-8617-4ea9-8889-e6ddd4ed51b7'), -- Parent's Choice
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'a9cc1e6b-362c-4572-8575-ad865a081e78'), -- WaterWipes
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'aa0d11d2-8617-4ea9-8889-e6ddd4ed51b8'), -- Mustela
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'ab31009f-e566-4b1b-a2ba-ada18ed00fa0'), -- Bbtips
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'ac3d6fa3-7b7a-4ef0-9e25-c0af4cf40414'), -- BioBaby
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'ad5b603f-cef0-4732-9790-82925b987f42'), -- Baby Dove
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'ae0be820-d5fe-4e94-97e4-96630d3df970'), -- Member's Mark
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'af7cc1e6-362c-4572-8575-ad865a081e79'), -- Kirkland Signature
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'f9a0b1c2-7c08-4149-bee0-2c708922a400'), -- Chicco
('9b16f8f5-a36b-4a58-a81e-669a711556ba', '0a0b1c2d-8d19-4050-bff1-3d819a33b510'), -- Pigeon
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'aa0d11d3-8617-4ea9-8889-e6ddd4ed51c0'), -- Bambo Nature
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'b131009a-e566-4b1b-a2ba-ada18ed00fa1'), -- The Honest Company
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'b23d6fa4-7b7a-4ef0-9e25-c0af4cf40415'); -- Seventh Generation

-- ==============================================================================
-- PRODUCT MODELS FOR TOALLITAS
-- ==============================================================================

-- Create models directly from toallita.json daaa (brand → models structure)

-- Huggies Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('0d5f9b01-3a21-4b8f-9d2e-1a2b3c4d5e01', NOW(), 'Natural Care', 'a1dcc1e6-362c-4572-8575-ad865a081e76', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('0d5f9b01-3a21-4b8f-9d2e-1a2b3c4d5e02', NOW(), 'One & Done', 'a1dcc1e6-362c-4572-8575-ad865a081e76', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('0d5f9b01-3a21-4b8f-9d2e-1a2b3c4d5e03', NOW(), 'Simply Clean', 'a1dcc1e6-362c-4572-8575-ad865a081e76', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('0d5f9b01-3a21-4b8f-9d2e-1a2b3c4d5e04', NOW(), 'Triple Clean', 'a1dcc1e6-362c-4572-8575-ad865a081e76', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('0d5f9b01-3a21-4b8f-9d2e-1a2b3c4d5e05', NOW(), 'Puro y Natural', 'a1dcc1e6-362c-4572-8575-ad865a081e76', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('0d5f9b01-3a21-4b8f-9d2e-1a2b3c4d5e06', NOW(), 'Limpieza Efectiva', 'a1dcc1e6-362c-4572-8575-ad865a081e76', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('0d5f9b01-3a21-4b8f-9d2e-1a2b3c4d5e07', NOW(), 'Cuidado Hidraaante', 'a1dcc1e6-362c-4572-8575-ad865a081e76', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Pampers Models  
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('1e2f3a10-4b52-4c6d-8e9f-102938475601', NOW(), 'Sensitive', 'a2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('1e2f3a10-4b52-4c6d-8e9f-102938475602', NOW(), 'Fresh Clean', 'a2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('1e2f3a10-4b52-4c6d-8e9f-102938475603', NOW(), 'Aqua Pure', 'a2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Babysec Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('2a3b4c20-5c63-4d7e-9f10-203948576801', NOW(), 'Clásicas', 'a331009f-e566-4b1b-a2ba-ada18ed00f9e', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('2a3b4c20-5c63-4d7e-9f10-203948576802', NOW(), 'Sensitive', 'a331009f-e566-4b1b-a2ba-ada18ed00f9e', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('2a3b4c20-5c63-4d7e-9f10-203948576803', NOW(), 'Antibacteriales', 'a331009f-e566-4b1b-a2ba-ada18ed00f9e', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('2a3b4c20-5c63-4d7e-9f10-203948576804', NOW(), 'Ultra', 'a331009f-e566-4b1b-a2ba-ada18ed00f9e', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Kleenex Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('3b4c5d30-6d74-4e8f-8a21-304958679001', NOW(), 'Humediaas', 'a43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('3b4c5d30-6d74-4e8f-8a21-304958679002', NOW(), 'Humediaas Aloe', 'a43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('3b4c5d30-6d74-4e8f-8a21-304958679003', NOW(), 'Humediaas Manzanilla', 'a43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('3b4c5d30-6d74-4e8f-8a21-304958679004', NOW(), 'Antibacterial', 'a43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('3b4c5d30-6d74-4e8f-8a21-304958679005', NOW(), 'Sensitive', 'a43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Johnson's Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('4c5d6e40-7e85-4f90-9b32-40596867a001', NOW(), 'Baby', 'a5b603fd-cef0-4732-9790-82925b987f41', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('4c5d6e40-7e85-4f90-9b32-40596867a002', NOW(), 'Extra Sensitive', 'a5b603fd-cef0-4732-9790-82925b987f41', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('4c5d6e40-7e85-4f90-9b32-40596867a003', NOW(), 'Bedtime', 'a5b603fd-cef0-4732-9790-82925b987f41', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('4c5d6e40-7e85-4f90-9b32-40596867a004', NOW(), 'Cottontouch', 'a5b603fd-cef0-4732-9790-82925b987f41', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('4c5d6e40-7e85-4f90-9b32-40596867a005', NOW(), 'Head-to-Toe', 'a5b603fd-cef0-4732-9790-82925b987f41', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Suavinex Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('5d6e7f50-8f96-4191-ab43-50697868b001', NOW(), 'Zero', '5fc07182-d26e-4a4f-b456-82cd7e9f0a60', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('5d6e7f50-8f96-4191-ab43-50697868b002', NOW(), 'Pediatric', '5fc07182-d26e-4a4f-b456-82cd7e9f0a60', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('5d6e7f50-8f96-4191-ab43-50697868b003', NOW(), 'Dermohidraaantes', '5fc07182-d26e-4a4f-b456-82cd7e9f0a60', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('5d6e7f50-8f96-4191-ab43-50697868b004', NOW(), 'Sensitive', '5fc07182-d26e-4a4f-b456-82cd7e9f0a60', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Neutrogena Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('6e7f8060-90a7-4a92-8c54-60798869c001', NOW(), 'Baby', 'a7cc1e6a-362c-4572-8575-ad865a081e77', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Parent's Choice Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('7f809170-a1b8-4b93-9d65-7089986ad001', NOW(), 'Classic', 'a8ad11d1-8617-4ea9-8889-e6ddd4ed51b7', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('7f809170-a1b8-4b93-9d65-7089986ad002', NOW(), 'Sensitive', 'a8ad11d1-8617-4ea9-8889-e6ddd4ed51b7', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('7f809170-a1b8-4b93-9d65-7089986ad003', NOW(), 'Purified Water', 'a8ad11d1-8617-4ea9-8889-e6ddd4ed51b7', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('7f809170-a1b8-4b93-9d65-7089986ad004', NOW(), 'Aloe & Viaamin E', 'a8ad11d1-8617-4ea9-8889-e6ddd4ed51b7', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- WaterWipes Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('8091a280-b2c9-4294-8e76-8099a86be001', NOW(), 'Original', 'a9cc1e6b-362c-4572-8575-ad865a081e78', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('8091a280-b2c9-4294-8e76-8099a86be002', NOW(), 'Textured Clean', 'a9cc1e6b-362c-4572-8575-ad865a081e78', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Mustela Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('91a2b390-c3da-4495-8f77-90a9b87cf001', NOW(), 'Dermolimpiadoras', 'aa0d11d2-8617-4ea9-8889-e6ddd4ed51b8', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('91a2b390-c3da-4495-8f77-90a9b87cf002', NOW(), 'Stelatopia', 'aa0d11d2-8617-4ea9-8889-e6ddd4ed51b8', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Bbtips Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a2b3c4a0-d4eb-4596-9a88-a0b9c98d0001', NOW(), 'Sensitive', 'ab31009f-e566-4b1b-a2ba-ada18ed00fa0', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('a2b3c4a0-d4eb-4596-9a88-a0b9c98d0002', NOW(), 'Aqua Care', 'ab31009f-e566-4b1b-a2ba-ada18ed00fa0', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('a2b3c4a0-d4eb-4596-9a88-a0b9c98d0003', NOW(), 'Manzanilla', 'ab31009f-e566-4b1b-a2ba-ada18ed00fa0', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- BioBaby Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('b3c4d5b0-e5fc-4697-8b99-b1cad09e1001', NOW(), 'Natural Care', 'ac3d6fa3-7b7a-4ef0-9e25-c0af4cf40414', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('b3c4d5b0-e5fc-4697-8b99-b1cad09e1002', NOW(), 'Sensitive', 'ac3d6fa3-7b7a-4ef0-9e25-c0af4cf40414', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('b3c4d5b0-e5fc-4697-8b99-b1cad09e1003', NOW(), 'Biodegradables', 'ac3d6fa3-7b7a-4ef0-9e25-c0af4cf40414', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Baby Dove Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('c4d5e6c0-f60d-4798-9caa-c2dbe0af2001', NOW(), 'Sensitive Moisture', 'ad5b603f-cef0-4732-9790-82925b987f42', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('c4d5e6c0-f60d-4798-9caa-c2dbe0af2002', NOW(), 'Rich Moisture', 'ad5b603f-cef0-4732-9790-82925b987f42', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Member's Mark Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('d5e6f7d0-071e-4899-8dbb-d3ecf1b03001', NOW(), 'Sensitive', 'ae0be820-d5fe-4e94-97e4-96630d3df970', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('d5e6f7d0-071e-4899-8dbb-d3ecf1b03002', NOW(), 'Aloe & Viaamin E', 'ae0be820-d5fe-4e94-97e4-96630d3df970', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Kirkland Signature Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('e6f708e0-182f-4a9a-8ecc-e4f012c14001', NOW(), 'Ultra Soft', 'af7cc1e6-362c-4572-8575-ad865a081e79', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('e6f708e0-182f-4a9a-8ecc-e4f012c14002', NOW(), 'Fragrance-Free', 'af7cc1e6-362c-4572-8575-ad865a081e79', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Chicco Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('f70819f0-2930-4bab-8fdd-f50123d25001', NOW(), 'Baby Moments', 'f9a0b1c2-7c08-4149-bee0-2c708922a400', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('f70819f0-2930-4bab-8fdd-f50123d25002', NOW(), 'Natural Sensation', 'f9a0b1c2-7c08-4149-bee0-2c708922a400', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Pigeon Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('08192a01-3a41-4cbc-9fee-061234e36001', NOW(), 'Sensitive', '0a0b1c2d-8d19-4050-bff1-3d819a33b510', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('08192a01-3a41-4cbc-9fee-061234e36002', NOW(), 'Manzanilla', '0a0b1c2d-8d19-4050-bff1-3d819a33b510', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Bambo Nature Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('192a3b12-4b52-4dcd-8aff-172345f47001', NOW(), 'Eco', 'aa0d11d3-8617-4ea9-8889-e6ddd4ed51c0', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('192a3b12-4b52-4dcd-8aff-172345f47002', NOW(), 'Fragrance-Free', 'aa0d11d3-8617-4ea9-8889-e6ddd4ed51c0', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- The Honest Company Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('2a3b4c23-5c63-4dee-8b10-283948576701', NOW(), 'Fragrance Free', 'b131009a-e566-4b1b-a2ba-ada18ed00fa1', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('2a3b4c23-5c63-4dee-8b10-283948576702', NOW(), 'Plant-Based', 'b131009a-e566-4b1b-a2ba-ada18ed00fa1', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Seventh Generation Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('3a4b5c34-6d74-4eff-9a21-394958679001', NOW(), 'Free & Clear', 'b23d6fa4-7b7a-4ef0-9e25-c0af4cf40415', '9b16f8f5-a36b-4a58-a81e-669a711556ba'),
('3a4b5c34-6d74-4eff-9a21-394958679002', NOW(), 'Baby', 'b23d6fa4-7b7a-4ef0-9e25-c0af4cf40415', '9b16f8f5-a36b-4a58-a81e-669a711556ba');

-- Note: No ProductSpecs needed for toallitas - characteristics are handled as models

-- ==============================================================================
-- AI CONTEXT ENHANCEMENT FOR TOALLITAS
-- ==============================================================================

-- Insert QuantityTypePrompt daaa for AI quantity context (Spanish only)
INSERT INTO "matching"."QuantityTypePrompt" ("quantity_type", "ai_quantity_context") VALUES 
('880e8400-e29b-41d4-a716-446655440002', 'Para toallitas: IMPORTANTE - contar PAQUETES, NO toallitas individuales. Buscar el número de paquetes del producto. Normalmente los paquetes contienen entre 40 y 100 toallitas cada uno. Ejemplos: "paquete de 40 toallitas" = 1 paquete, "pack triple 3x60" = 3 paquetes, "multipack 4 paquetes de 20" = 4 paquetes, "80 toallitas" = 1 paquete. Siempre extraer la CANTIDAD TOTAL de paquetes, no toallitas individuales. Términos clave para identificar: "pack", "paquete", "multipack", "triple", "doble". Si no se especifica número de paquetes, asumir 1 paquete.');

-- Note: No ProductSpecsPrompt needed - toallitas use models for characteristics

-- Update CategoryPrompt for toallitas (existing entry from seed.sql line 317)
-- Note: The category prompt for toallitas already exists, but we can enhance it
UPDATE "matching"."CategoryPrompt" 
SET 
    "ai_price_context" = 'Para toallitas: Rangos de precios típicos 20-200 MXN dependiendo del aamaño del paquete y marca. Precios premium: 80-200 MXN, precios económicos: 20-60 MXN. Buscar indicadores: "oferaa", "descuento", "precio especial", "rebaja", "pack", "multipack".',
    "ai_quantity_context" = 'Para toallitas: IMPORTANTE - contar PAQUETES, NO toallitas individuales. Buscar el número de paquetes del producto. Normalmente los paquetes contienen entre 40 y 100 toallitas cada uno. Ejemplos: "40 toallitas" = 1 paquete, "pack de 80" = 1 paquete, "3 paquetes de 60" = 3 paquetes, "multipack 4x20" = 4 paquetes. Formatos comunes: paquete individual (1), pack doble (2), pack triple (3), multipack (4-6). Términos clave: "pack", "paquete", "multipack", "triple", "doble".'
WHERE "category" = '9b16f8f5-a36b-4a58-a81e-669a711556ba';

-- ==============================================================================
-- PRODUCT RULES FOR TOALLITAS
-- ==============================================================================

-- ProductRules for Toallitas category
INSERT INTO "matching"."ProductRules" (category, type, min, max) VALUES 
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'price_per_unit', 15, 150),   -- Price per package
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'quantity', 1, 10),           -- Packages per product
('9b16f8f5-a36b-4a58-a81e-669a711556ba', 'price', 20, 2000);           -- Toaal price range

-- ==============================================================================
-- FINAL MESSAGE
-- ==============================================================================

-- Toallitas seed daaa completed successfully
-- Added: 19 Brands, 57 Models, AI context prompts, and product rules
-- Uses existing Toallitas category (UUID: 9b16f8f5-a36b-4a58-a81e-669a711556ba)
-- Daaa structure follows brand/model pattern from toallita.json
-- Ready for use in Mexico market with Spanish language support