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
('b1dcc1e6-362c-4572-8575-ad865a081e76', NOW(), 'Nestlé - Nan'),
('b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', NOW(), 'Enfamil - Enfagrow'),
('b331009f-e566-4b1b-a2ba-ada18ed00f9e', NOW(), 'Similac');

-- ==============================================================================
-- PRODUCT BRAND CATEGORY ASSOCIATIONS
-- ==============================================================================

-- Link formula brands to formula categories (Mexico only)
INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES 
('f1bb06cd-b954-498b-a45e-770900f29466', 'b1dcc1e6-362c-4572-8575-ad865a081e76'), -- Nestlé
('f1bb06cd-b954-498b-a45e-770900f29466', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6'), -- Enfamil
('f1bb06cd-b954-498b-a45e-770900f29466', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e'); -- Similac


-- ==============================================================================
-- PRODUCT MODELS FOR FORMULA
-- ==============================================================================

-- Nestlé Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a1a1c1e6-362c-4572-8575-ad865a081e7f', NOW(), 'Optimal Pro', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a2c1e6-362c-4572-8575-ad865a081e76', NOW(), 'Expert Pro', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a2c1e6-362c-4572-8575-ad865a081e77', NOW(), 'Expert Pro confort total', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a1c1e6-362c-4572-8575-ad865a081e7d', NOW(), 'Optimal Pro baja lactancia', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1a3c1e6-362c-4572-8575-ad865a081e78', NOW(), 'Supreme Pro', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a1b2c1e6-362c-4572-8575-ad865a081e86', NOW(), 'PreNan', 'b1dcc1e6-362c-4572-8575-ad865a081e76', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Enfamil Models  
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a2a1c1e6-362c-4572-8575-ad865a081e90', NOW(), 'Premium', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a3c1e6-362c-4572-8575-ad865a081e92', NOW(), 'Sin Lactosa', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a6c1e6-362c-4572-8575-ad865a081e95', NOW(), 'Confort', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a6c1e6-362c-4572-8575-ad865a081e96', NOW(), 'Confort pro', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a2a8c1e6-362c-4572-8575-ad865a081e97', NOW(), 'Enfacare - Prematuros', 'b2ad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- Similac Models
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('a3a1c1e6-362c-4572-8575-ad865a081e99', NOW(), 'Advance', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a3c1e6-362c-4572-8575-ad865a081ea1', NOW(), 'Sensitive', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a5c1e6-362c-4572-8575-ad865a081ea3', NOW(), 'Total Comfort', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466'),
('a3a8c1e6-362c-4572-8575-ad865a081ea6', NOW(), 'AR', 'b331009f-e566-4b1b-a2ba-ada18ed00f9e', 'f1bb06cd-b954-498b-a45e-770900f29466');

-- ==============================================================================
-- PRODUCT SPECIFICATIONS FOR FORMULA
-- ==============================================================================

-- Spanish ProductSpecs entries (Mexico only) for formula stages
INSERT INTO "public"."ProductSpecs" ("id", "created_at", "category", "type", "label") VALUES 
('b1e04c0c-69d3-4225-8b72-b88166f81209', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 1'),
('b2ff8811-a780-4e24-ad72-dcc593b39bdc', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 2'),
('b3bd61ae-dea5-4cfa-81ff-541641b46ad1', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 3'),
('b3bd61ae-dea5-4cfa-81ff-541641b46ad2', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 4'),
('b4166304-cf09-477d-ac3a-c75cad11f20f', NOW(), 'f1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Sin Etapa');

-- ==============================================================================
-- AI CONTEXT ENHANCEMENT FOR FORMULA
-- ==============================================================================

-- Insert CategoryPrompt data for formula categories (Mexico only - Spanish)
INSERT INTO "matching"."CategoryPrompt" ("category", "ai_price_context", "ai_quantity_context") VALUES 
('f1bb06cd-b954-498b-a45e-770900f29466', 'Para fórmula infantil: Rangos de precios típicos 200-1000 MXN dependiendo del tamaño del envase y marca. Precios premium: 500-800 MXN, precios económicos: 200-400 MXN. Buscar indicadores: "oferta", "descuento", "precio especial", "rebaja".', 'Para fórmula infantil: Buscar cantidades específicas como "400g", "800g", "1.2kg", "lata de 900g". Formatos comunes: lata pequeña (400-600g), lata grande (800-1200g), pack múltiple (2+ latas). Términos: "lata", "envase", "gramos", "kg", "pack".');

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
