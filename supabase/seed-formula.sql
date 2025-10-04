-- ==============================================================================
-- SEED DATA FOR BABY FORMULA PRODUCTS
-- ==============================================================================
-- This seed file populates the database with baby formula data from formula.json
-- Includes brands, models, categories, and specifications for Mexico and Quebec markets

-- ==============================================================================
-- QUANTITY TYPES FOR FORMULA
-- ==============================================================================

-- Insert QuantityType data for formula (Spanish only)
INSERT INTO "public"."QuantityType" ("id", "label", "internal_label", "unit_label") VALUES 
('880e8400-e29b-41d4-a716-446655440001', 'Kilogramos', 'kg_es', 'por kg');

-- ==============================================================================
-- PRODUCT CATEGORIES FOR FORMULA
-- ==============================================================================

-- Insert ProductCategory data for formula (Mexico only - Spanish)
INSERT INTO "public"."ProductCategory" ("id", "created_at", "label", "slug", "image_bucket", "image_path", "country", "quantity_type", "description") VALUES 
('f1bb06cd-b954-498b-a45e-770900f29466', NOW(), 'Fórmula Infantil', 'formula-infantil', null, null, '440e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Encuentra la fórmula infantil perfecta para tu bebé al mejor precio del mercado. Comparamos todas las marcas premium como Nestlé, Enfamil, Similac y más, en todas las tiendas para que elijas la nutrición ideal según la edad y necesidades específicas de tu pequeño. Desde etapa 1 para recién nacidos hasta fórmulas especializadas sin lactosa, de soya o hipoalergénicas. La alimentación de tu bebé es fundamental para su desarrollo, por eso te ayudamos a encontrar la mejor fórmula con la mejor relación calidad-precio.'); -- MX, Spanish Formula

-- ==============================================================================
-- PRODUCT BRANDS FOR FORMULA
-- ==============================================================================

-- Insert ProductBrand data for formula brands
INSERT INTO "public"."ProductBrand" ("id", "created_at", "label") VALUES 
('b1dcc1e6-362c-4572-8575-ad865a081e76', NOW(), 'Nestlé'),
('b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', NOW(), 'Enfamil'),
('b331009f-e566-4b1b-a2ba-ada18ed00f9e', NOW(), 'Similac'),
('b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', NOW(), 'Nutrilon'),
('b5b603fd-cef0-4732-9790-82925b987f41', NOW(), 'Kendamil'),
('b60be820-d5fe-4e94-97e4-96630d3df96f', NOW(), 'HiPP'),
('b7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', NOW(), 'Novamil'),
('b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', NOW(), 'Blemil'),
('b9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', NOW(), 'Capricare');

-- ==============================================================================
-- PRODUCT BRAND CATEGORY ASSOCIATIONS
-- ==============================================================================

-- Link formula brands to formula categories (Mexico only)
INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES 
('f1bb06cd-b954-498b-a45e-770900f29466', 'b1dcc1e6-362c-4572-8575-ad865a081e76'), -- Nestlé
('f1bb06cd-b954-498b-a45e-770900f29466', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6'), -- Enfamil
('f1bb06cd-b954-498b-a45e-770900f29466', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e'), -- Similac
('f1bb06cd-b954-498b-a45e-770900f29466', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413'), -- Nutrilon
('f1bb06cd-b954-498b-a45e-770900f29466', 'b5b603fd-cef0-4732-9790-82925b987f41'), -- Kendamil
('f1bb06cd-b954-498b-a45e-770900f29466', 'b60be820-d5fe-4e94-97e4-96630d3df96f'), -- HiPP
('f1bb06cd-b954-498b-a45e-770900f29466', 'b7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e'), -- Novamil
('f1bb06cd-b954-498b-a45e-770900f29466', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f'), -- Blemil
('f1bb06cd-b954-498b-a45e-770900f29466', 'b9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a'); -- Capricare

-- ==============================================================================
-- PRODUCT MODELS FOR FORMULA
-- ==============================================================================

-- Nestlé Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a1a1c1e6-362c-4572-8575-ad865a081e7f', NOW(), 'Nan Pro', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a2c1e6-362c-4572-8575-ad865a081e77', NOW(), 'Nan Optipro', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a3c1e6-362c-4572-8575-ad865a081e78', NOW(), 'Nan Supreme', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a4c1e6-362c-4572-8575-ad865a081e79', NOW(), 'Nan Sin Lactosa', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a5c1e6-362c-4572-8575-ad865a081e80', NOW(), 'Nan Soya', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a6c1e6-362c-4572-8575-ad865a081e81', NOW(), 'Nan AR', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a7c1e6-362c-4572-8575-ad865a081e82', NOW(), 'S-26 Gold', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a8c1e6-362c-4572-8575-ad865a081e83', NOW(), 'S-26 Progress', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a9c1e6-362c-4572-8575-ad865a081e84', NOW(), 'Nan HA', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1b1c1e6-362c-4572-8575-ad865a081e85', NOW(), 'Nan Confort Total', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1b2c1e6-362c-4572-8575-ad865a081e86', NOW(), 'PreNan', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1b3c1e6-362c-4572-8575-ad865a081e87', NOW(), 'Althéra', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1b4c1e6-362c-4572-8575-ad865a081e88', NOW(), 'Alfamino', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1b5c1e6-362c-4572-8575-ad865a081e89', NOW(), 'Nido Kinder 1+', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Enfamil Models  
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a2a1c1e6-362c-4572-8575-ad865a081e90', NOW(), 'Enfamil Premium', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a2c1e6-362c-4572-8575-ad865a081e91', NOW(), 'Enfamil ProSobee', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a3c1e6-362c-4572-8575-ad865a081e92', NOW(), 'Enfamil Sin Lactosa', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a4c1e6-362c-4572-8575-ad865a081e93', NOW(), 'Enfamil AR', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a5c1e6-362c-4572-8575-ad865a081e94', NOW(), 'Enfamil Gentlease', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a6c1e6-362c-4572-8575-ad865a081e95', NOW(), 'Enfamil Confort', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a7c1e6-362c-4572-8575-ad865a081e96', NOW(), 'Nutramigen LGG', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a8c1e6-362c-4572-8575-ad865a081e97', NOW(), 'Enfacare', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a9c1e6-362c-4572-8575-ad865a081e98', NOW(), 'Prematuros', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Similac Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a3a1c1e6-362c-4572-8575-ad865a081e99', NOW(), 'Similac Advance', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a2c1e6-362c-4572-8575-ad865a081ea0', NOW(), 'Similac Pro-Advance', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a3c1e6-362c-4572-8575-ad865a081ea1', NOW(), 'Similac Sensitive', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a4c1e6-362c-4572-8575-ad865a081ea2', NOW(), 'Similac Soya', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a5c1e6-362c-4572-8575-ad865a081ea3', NOW(), 'Similac Total Comfort', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a6c1e6-362c-4572-8575-ad865a081ea4', NOW(), 'Similac Alimentum', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a7c1e6-362c-4572-8575-ad865a081ea5', NOW(), 'Similac NeoSure', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a8c1e6-362c-4572-8575-ad865a081ea6', NOW(), 'Similac AR', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Nutrilon Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a4a1c1e6-362c-4572-8575-ad865a081ea7', NOW(), 'Nutrilon Profutura', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a4a2c1e6-362c-4572-8575-ad865a081ea8', NOW(), 'Nutrilon Premium', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a4a3c1e6-362c-4572-8575-ad865a081ea9', NOW(), 'Nutrilon Soya', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a4a4c1e6-362c-4572-8575-ad865a081eb0', NOW(), 'Nutrilon Sin Lactosa', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a4a5c1e6-362c-4572-8575-ad865a081eb1', NOW(), 'Nutrilon AR', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a4a6c1e6-362c-4572-8575-ad865a081eb2', NOW(), 'Nutrilon HA', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a4a7c1e6-362c-4572-8575-ad865a081eb3', NOW(), 'Nutrilon Confort', 'b43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Kendamil Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a5a1c1e6-362c-4572-8575-ad865a081eb4', NOW(), 'Kendamil Orgánica', 'b5b603fd-cef0-4732-9790-82925b987f41', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a5a2c1e6-362c-4572-8575-ad865a081eb5', NOW(), 'Kendamil Clásica', 'b5b603fd-cef0-4732-9790-82925b987f41', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a5a3c1e6-362c-4572-8575-ad865a081eb6', NOW(), 'Kendamil Goat', 'b5b603fd-cef0-4732-9790-82925b987f41', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- HiPP Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a6a1c1e6-362c-4572-8575-ad865a081eb7', NOW(), 'HiPP Orgánica', 'b60be820-d5fe-4e94-97e4-96630d3df96f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a6a2c1e6-362c-4572-8575-ad865a081eb8', NOW(), 'HiPP Comfort', 'b60be820-d5fe-4e94-97e4-96630d3df96f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a6a3c1e6-362c-4572-8575-ad865a081eb9', NOW(), 'HiPP HA Combiotic', 'b60be820-d5fe-4e94-97e4-96630d3df96f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a6a4c1e6-362c-4572-8575-ad865a081ec0', NOW(), 'HiPP AR', 'b60be820-d5fe-4e94-97e4-96630d3df96f', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Novamil Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a7a1c1e6-362c-4572-8575-ad865a081ec1', NOW(), 'Novamil', 'b7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a7a2c1e6-362c-4572-8575-ad865a081ec2', NOW(), 'Novamil AR', 'b7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a7a3c1e6-362c-4572-8575-ad865a081ec3', NOW(), 'Novamil Confort', 'b7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a7a4c1e6-362c-4572-8575-ad865a081ec4', NOW(), 'Novamil Sin Lactosa', 'b7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a7a5c1e6-362c-4572-8575-ad865a081ec5', NOW(), 'Novamil Soya', 'b7c4d8ea-f1b2-4d5a-9c6e-7f8a9b0c1d2e', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Blemil Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a8a1c1e6-362c-4572-8575-ad865a081ec6', NOW(), 'Blemil Plus', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a8a2c1e6-362c-4572-8575-ad865a081ec7', NOW(), 'Blemil Confort', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a8a3c1e6-362c-4572-8575-ad865a081ec8', NOW(), 'Blemil AR', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a8a4c1e6-362c-4572-8575-ad865a081ec9', NOW(), 'Blemil HA', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a8a5c1e6-362c-4572-8575-ad865a081ed0', NOW(), 'Blemil Sin Lactosa', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a8a6c1e6-362c-4572-8575-ad865a081ed1', NOW(), 'Blemil Soya', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a8a7c1e6-362c-4572-8575-ad865a081ed2', NOW(), 'Blemil Prematuros', 'b8e5f9db-a2c3-4e6b-8d9f-6a7b8c9d0e1f', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Capricare Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a9a1c1e6-362c-4572-8575-ad865a081ed3', NOW(), 'Capricare Cabra', 'b9f6a0ec-b3d4-4f7c-9e0a-5b6c7d8e9f0a', 'f1bb06cd-b954-498b-a45e-770900f29466');


-- ==============================================================================
-- PRODUCT SPECIFICATIONS FOR FORMULA
-- ==============================================================================

-- Spanish ProductSpecs entries (Mexico only) for formula stages
INSERT INTO "public"."ProductSpecs" ("id", "created_at", "category", "type", "label") VALUES 
('b1e04c0c-69d3-4225-8b72-b88166f81209', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 1'),
('b2ff8811-a780-4e24-ad72-dcc593b39bdc', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 2'),
('b3bd61ae-dea5-4cfa-81ff-541641b46ad1', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 3'),
('b4166304-cf09-477d-ac3a-c75cad11f20f', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Sin Etapa');

-- ==============================================================================
-- AI CONTEXT ENHANCEMENT FOR FORMULA
-- ==============================================================================

-- Insert CategoryPrompt data for formula categories (Mexico only - Spanish)
INSERT INTO "matching"."CategoryPrompt" ("category", "ai_price_context", "ai_quantity_context") VALUES 
('f1bb06cd-b954-498b-a45e-770900f29466', 'Para fórmula infantil: Rangos de precios típicos 200-800 MXN dependiendo del tamaño del envase y marca. Precios premium: 500-800 MXN, precios económicos: 200-400 MXN. Buscar indicadores: "oferta", "descuento", "precio especial", "rebaja".', 'Para fórmula infantil: Buscar cantidades específicas como "400g", "800g", "1.2kg", "lata de 900g". Formatos comunes: lata pequeña (400-600g), lata grande (800-1200g), pack múltiple (2+ latas). Términos: "lata", "envase", "gramos", "kg", "pack".');

-- Insert QuantityTypePrompt data for AI quantity context (Spanish only)
INSERT INTO "matching"."QuantityTypePrompt" ("quantity_type", "ai_quantity_context") VALUES 
('880e8400-e29b-41d4-a716-446655440001', 'Para peso en kg: Buscar cantidades en gramos o kilogramos. IMPORTANTE: Convertir siempre a kg. Conversiones: 500g = 0.5kg, 800g = 0.8kg, 1200g = 1.2kg. Términos: "gramos", "g", "kilogramos", "kg". Ejemplos: "400 gramos" → 0.4kg, "1.5 kg" → 1.5kg, "900g" → 0.9kg.');

-- Insert ProductSpecsPrompt data for AI specs context (category+type combinations)
-- Generic prompts for all spec values of each type within a category

-- Spanish/Mexico Formula Infantil (category: f1bb06cd-b954-498b-a45e-770900f29466)
INSERT INTO "matching"."ProductSpecsPrompt" ("category", "type", "ai_specs_context") VALUES
('f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Fórmula infantil por etapa según edad del bebé. Buscar indicadores: "Etapa 1/Stage 1" (recién nacidos 0-6 meses, primera etapa, inicio), "Etapa 2/Stage 2" (bebés 6-12 meses, continuación, segunda fórmula), "Etapa 3/Stage 3" (niños 12+ meses, crecimiento, tercera fórmula, transición), "Sin Etapa/Especializada" (sin lactosa, soya, AR, hipoalergénica, antirreflujo). Términos clave: etapa, stage, meses, edad, 0-6m, 6-12m, 12m+, continuación, crecimiento, especializada.');


-- ProductRules for Formula category (Mexico only)
INSERT INTO "matching"."ProductRules" (category, type, min, max) VALUES 
('f1bb06cd-b954-498b-a45e-770900f29466', 'price_per_unit', 50, 3000),
('f1bb06cd-b954-498b-a45e-770900f29466', 'quantity', 0, 3),
('f1bb06cd-b954-498b-a45e-770900f29466', 'price', 100, 4000);

-- ==============================================================================
-- FINAL MESSAGE
-- ==============================================================================

-- Formula seed data completed successfully (Spanish only)
-- Added: 1 Category, 9 Brands, 35 Models, 4 Specs, AI context prompts, and product rules
-- Ready for use in Mexico market (Spanish language only)