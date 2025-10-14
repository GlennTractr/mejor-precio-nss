
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
('c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', NOW(), 'Chicco'),
('cb22c1e6-362c-4572-8575-ad865a081e78', NOW(), 'UPPAbaby');

-- ==============================================================================
-- PRODUCT BRAND CATEGORY ASSOCIATIONS
-- ==============================================================================

-- Link carriola brands to carriola categories (Mexico only)
INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES
('c1bb06cd-b954-498b-a45e-770900f29466', 'c1dcc1e6-362c-4572-8575-ad865a081e76'), -- Graco
('c1bb06cd-b954-498b-a45e-770900f29466', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6'), -- Evenflo
('c1bb06cd-b954-498b-a45e-770900f29466', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413'), -- Chicco
('c1bb06cd-b954-498b-a45e-770900f29466', 'cb22c1e6-362c-4572-8575-ad865a081e78'); -- UPPAbaby

-- ==============================================================================
-- PRODUCT MODELS FOR CARRIOLAS
-- ==============================================================================

-- Graco Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES
('a1a1c1e6-362c-4572-8575-ad865a081e83', NOW(), 'Modes Jogger', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a1a2c1e6-362c-4572-8575-ad865a081e84', NOW(), 'Modes Element LX', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a1a3c1e6-362c-4572-8575-ad865a081e85', NOW(), 'Ready2Grow', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a1a4c1e6-362c-4572-8575-ad865a081e86', NOW(), 'FastAction', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a1a5c1e6-362c-4572-8575-ad865a081e87', NOW(), 'DuoGlider', 'c1dcc1e6-362c-4572-8575-ad865a081e76', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Evenflo Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES
('a2a1c1e6-362c-4572-8575-ad865a081e91', NOW(), 'Pivot Xpand', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a2a2c1e6-362c-4572-8575-ad865a081e92', NOW(), 'Pivot Xplore', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a2a3c1e6-362c-4572-8575-ad865a081e93', NOW(), 'Pivot', 'c2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- Chicco Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES
('a4a1c1e6-362c-4572-8575-ad865a081e9e', NOW(), 'Mini Bravo', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a2c1e6-362c-4572-8575-ad865a081e9f', NOW(), 'Mini Bravo Sport', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a3c1e6-362c-4572-8575-ad865a081ea0', NOW(), 'Bravo Primo', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a4c1e6-362c-4572-8575-ad865a081ea1', NOW(), 'Bravo', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a5c1e6-362c-4572-8575-ad865a081ea2', NOW(), 'Bravo LE', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a6c1e6-362c-4572-8575-ad865a081ea3', NOW(), 'Liteway', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a7c1e6-362c-4572-8575-ad865a081ea4', NOW(), 'Ohlala', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a8c1e6-362c-4572-8575-ad865a081ea5', NOW(), 'Corso', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4a9c1e6-362c-4572-8575-ad865a081ea6', NOW(), 'Bravo For2', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4aac1e6-362c-4572-8575-ad865a081ea7', NOW(), 'Together', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4abc1e6-362c-4572-8575-ad865a081ea8', NOW(), 'Viaro', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4acc1e6-362c-4572-8575-ad865a081ea9', NOW(), 'Activ3', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a4adc1e6-362c-4572-8575-ad865a081eaa', NOW(), 'Goody Plus', 'c43d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'c1bb06cd-b954-498b-a45e-770900f29466');

-- UPPAbaby Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES
('a11a1c1e-362c-4572-8575-ad865a081ec5', NOW(), 'CRUZ', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a11a2c1e-362c-4572-8575-ad865a081ec6', NOW(), 'G-LUXE', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a11a3c1e-362c-4572-8575-ad865a081ec7', NOW(), 'VISTA', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a11a4c1e-362c-4572-8575-ad865a081ec8', NOW(), 'MINU DUO', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a11a5c1e-362c-4572-8575-ad865a081ec9', NOW(), 'MINU V2', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466'),
('a11a6c1e-362c-4572-8575-ad865a081eca', NOW(), 'MINU V3', 'cb22c1e6-362c-4572-8575-ad865a081e78', 'c1bb06cd-b954-498b-a45e-770900f29466');


-- ==============================================================================
-- PRODUCT SPECIFICATIONS FOR CARRIOLAS
-- ==============================================================================

-- None

-- ==============================================================================
-- AI CONTEXT ENHANCEMENT FOR CARRIOLAS
-- ==============================================================================

-- Insert CategoryPrompt data for carriola categories (Mexico only - Spanish)
INSERT INTO "matching"."CategoryPrompt" ("category", "ai_price_context", "ai_quantity_context") VALUES 
('c1bb06cd-b954-498b-a45e-770900f29466', 'Para carriolas: Rangos de precios típicos 2000-25000 MXN dependiendo del tipo y marca. Precios premium: 15000-25000 MXN, precios económicos: 2000-8000 MXN, gama media: 8000-15000 MXN. Buscar indicadores: "oferta", "descuento", "precio especial", "rebaja", "liquidación".', 'Para carriolas: Buscar cantidades específicas como "1 carriola", "unidad", "pieza". Normalmente se vende una carriola por producto. Términos: "carriola", "stroller", "cochecito", "unidad", "pieza", "sistema completo".');

-- Insert QuantityTypePrompt data for AI quantity context (Spanish only)
INSERT INTO "matching"."QuantityTypePrompt" ("quantity_type", "ai_quantity_context") VALUES 
('990e8400-e29b-41d4-a716-446655440001', 'Para unidades: Buscar cantidades numéricas simples. Normalmente las carriolas se venden de una en una. Conversiones: "1 carriola" = 1 unidad, "pieza" = 1 unidad, "kit completo" = 1 unidad. Términos: "unidad", "pieza", "carriola", "set", "kit". Ejemplos: "1 carriola" → 1 unidad, "kit de viaje" → 1 unidad.');


-- ProductRules for Carriolas category (Mexico only)
INSERT INTO "matching"."ProductRules" (category, type, min, max) VALUES 
('c1bb06cd-b954-498b-a45e-770900f29466', 'price_per_unit', 1000, 50000),
('c1bb06cd-b954-498b-a45e-770900f29466', 'quantity', 0, 5),
('c1bb06cd-b954-498b-a45e-770900f29466', 'price', 1000, 50000);

-- ==============================================================================
-- FINAL MESSAGE
-- ==============================================================================

-- Carriola seed data completed successfully (Spanish only)
-- Added: 1 Category, 4 Brands, 27 Models, 5 Specs, AI context prompts, and product rules
-- Brands: Chicco (13 models), Graco (5 models), UPPAbaby (6 models), Evenflo (3 models)
-- Ready for use in Mexico market (Spanish language only)