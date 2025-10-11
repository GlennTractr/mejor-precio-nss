-- Insert QuantityType data (language-specific)
INSERT INTO "public"."QuantityType" ("id", "label", "internal_label", "unit_label") VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Pañales', 'panales_es', 'por pañales');

-- Insert ProductCategory data with UUID country references and language-specific quantity_type
INSERT INTO "public"."ProductCategory" ("id", "created_at", "label", "slug", "image_bucket", "image_path", "country", "quantity_type", "description", "coming_soon") VALUES 
('a1bb06cd-b954-498b-a45e-770900f29466', '2024-09-22 22:43:10.067073+00', 'Pañales', 'panales', null, null, '440e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Descubre los pañales ideales para tu bebé al precio más conveniente. Comparamos todas las marcas, tallas y tiendas para que encuentres los pañales con mejor absorción, comodidad y precio por pañal. Desde recién nacido hasta etapa 7, incluyendo opciones para niño, niña y unisex. Tu tranquilidad y el bienestar de tu bebé son nuestra prioridad, por eso te mostramos dónde conseguir los mejores pañales al mejor precio.', false);

INSERT INTO "public"."ProductBrand" ("id", "created_at", "label") VALUES 
('21dcc1e6-362c-4572-8575-ad865a081e76', '2024-11-17 04:35:33.28119+00', 'Bio Baby'),
('4bad11d0-8617-4ea9-8889-e6ddd4ed51b6', '2024-11-17 04:34:35.682845+00', 'Chicolastic'),
('5631009f-e566-4b1b-a2ba-ada18ed00f9e', '2024-09-22 22:39:26.667658+00', 'Huggies'),
('6d3d6fa2-7b7a-4ef0-9e25-c0af4cf40413', '2024-11-17 04:32:33.454922+00', 'KleenBebé'),
('8bb603fd-cef0-4732-9790-82925b987f41', '2024-11-17 04:33:33.303266+00', 'BB Tips'),
('a0be820a-d5fe-4e94-97e4-96630d3df96f', '2024-10-29 02:29:57.427213+00', 'Gugu'),
('57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '2024-11-17 04:32:07.268153+00', 'Pampers'),
('f1e5c4a8-9b2d-4c3e-8f7a-1a2b3c4d5e6f', '2024-11-17 04:36:00.000000+00', 'Babysec');


INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES 
('a1bb06cd-b954-498b-a45e-770900f29466', '21dcc1e6-362c-4572-8575-ad865a081e76'),
('a1bb06cd-b954-498b-a45e-770900f29466', '4bad11d0-8617-4ea9-8889-e6ddd4ed51b6'),
('a1bb06cd-b954-498b-a45e-770900f29466', '5631009f-e566-4b1b-a2ba-ada18ed00f9e'),
('a1bb06cd-b954-498b-a45e-770900f29466', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7'),
('a1bb06cd-b954-498b-a45e-770900f29466', '6d3d6fa2-7b7a-4ef0-9e25-c0af4cf40413'),
('a1bb06cd-b954-498b-a45e-770900f29466', '8bb603fd-cef0-4732-9790-82925b987f41'),
('a1bb06cd-b954-498b-a45e-770900f29466', 'a0be820a-d5fe-4e94-97e4-96630d3df96f'),
('a1bb06cd-b954-498b-a45e-770900f29466', 'f1e5c4a8-9b2d-4c3e-8f7a-1a2b3c4d5e6f');



INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('699c4d3c-a8f5-4ff5-94f0-10ea9f518982', '2024-11-17 04:55:42.786599+00', 'Supreme', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('7073e360-67e0-40a1-ae7d-71c95f7e7b69', '2024-10-26 23:47:13.27697+00', 'UltraConfort', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('72845c43-907c-4413-a846-1d0134eecca8', '2024-11-17 04:38:08.979352+00', 'Pull-Ups', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('9dad3c4f-8cee-4c61-bf40-0552cf2649d6', '2024-11-17 04:38:22.256685+00', 'Little swimmer', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('b025f095-fa78-4030-a852-c7c23a7d9860', '2024-11-17 04:37:49.372313+00', 'All Around', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('efe76755-8452-465b-a70f-513b9ed49290', '2024-11-17 04:55:55.39221+00', 'Eco protect', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('efe76755-8452-465b-a70f-513b9ed49291', '2024-11-17 04:55:55.39221+00', 'Black label', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '2024-11-17 05:00:00.000000+00', 'Natural Care', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', '2024-11-17 05:01:00.000000+00', 'Swaddlers', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '2024-11-17 05:02:00.000000+00', 'Suavelastic', '6d3d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', '2024-11-17 05:03:00.000000+00', 'Movilastic', '6d3d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', '2024-11-17 05:04:00.000000+00', 'Absorsec', '6d3d6fa2-7b7a-4ef0-9e25-c0af4cf40413', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', '2024-11-17 05:05:00.000000+00', 'UltraSec', 'f1e5c4a8-9b2d-4c3e-8f7a-1a2b3c4d5e6f', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', '2024-11-17 05:06:00.000000+00', 'FlexProtect', 'f1e5c4a8-9b2d-4c3e-8f7a-1a2b3c4d5e6f', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', '2024-11-17 05:07:00.000000+00', 'Classic', '4bad11d0-8617-4ea9-8889-e6ddd4ed51b6', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '2024-11-17 05:08:00.000000+00', 'Sensitive', '8bb603fd-cef0-4732-9790-82925b987f41', 'a1bb06cd-b954-498b-a45e-770900f29466'),
-- New Huggies models
('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', '2024-11-17 05:09:00.000000+00', 'Little Snugglers', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', '2024-11-17 05:10:00.000000+00', 'Little Movers', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', '2024-11-17 05:11:00.000000+00', 'Skin Essentials', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', '2024-11-17 05:12:00.000000+00', 'Supreme Platino', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
-- New Pampers models
('4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', '2024-11-17 05:13:00.000000+00', 'Swaddlers Overnights', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', 'a1bb06cd-b954-498b-a45e-770900f29466'),
-- Pull-Ups variant
('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '2024-11-17 05:14:00.000000+00', 'Pull-Ups Steps', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466');   



INSERT INTO "public"."ProductSpecs" ("id", "created_at", "category", "type", "label") VALUES 
('59e04c0c-69d3-4225-8b72-b88166f81209', '2024-11-18 17:28:35.513398+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 1'),
('7ece90db-f69f-473f-b996-28c779518c93', '2024-11-08 17:08:15.536619+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'gender', 'Unisex'),
('8387b8b6-e051-4120-9380-10ae1451d3e9', '2024-10-29 15:58:43.776531+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 6'),
('88193926-2c46-498a-ae59-9c58e2c4642d', '2024-10-31 03:55:55.240114+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'gender', 'Niño'),
('887708cf-c48a-46a2-a117-e1da503542a2', '2024-11-17 04:40:35.218546+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 7'),
('92166304-cf09-477d-ac3a-c75cad11f20f', '2024-11-08 16:54:08.880688+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 4'),
('ab3d61ae-dea5-4cfa-81ff-541641b46ad1', '2024-11-08 16:53:50.161328+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 3'),
('c45fdfe9-384a-4515-b083-68d8ea8d2b2a', '2024-10-29 15:59:02.892477+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 5'),
('df8d9bc2-7301-4b92-9c90-fd3f74c1bd63', '2024-11-17 04:39:58.109428+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Entrenamiento'),
('ef1313f7-722a-43e5-91fa-c7049a1fbbc6', '2024-11-08 17:06:56.573521+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Recién nacido'),
('efea6e13-880b-4184-a65b-bb9bf4db4f02', '2024-10-31 03:56:13.849594+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'gender', 'Niña'),
('fbff8811-a780-4e24-ad72-dcc593b39bdc', '2024-11-08 17:06:26.115036+00', 'a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Etapa 2');

-- AI Context Prompt Data

-- Insert CountryPrompt data for AI currency context (language-specific, generic)
INSERT INTO "matching"."CountryPrompt" ("country", "ai_currency_context") VALUES 
('440e8400-e29b-41d4-a716-446655440001', 'El mercado mexicano usa Pesos Mexicanos (MXN). Los precios típicamente se muestran sin impuestos. Buscar símbolo de peso ($) o indicadores MXN. Términos clave: "pesos", "MXN", "$", "precio", "costo", "vale", "importe".'),
('440e8400-e29b-41d4-a716-446655440002', 'Le marché québécois utilise des Dollars Canadiens (CAD). Les prix incluent les taxes (TPS/TVH). Chercher devise CAD ou symbole $ avec contexte canadien. Mots-clés: "dollars", "CAD", "$", "prix", "coût", "montant", "valeur".');

-- Insert QuantityTypePrompt data for AI quantity context (language-specific)
INSERT INTO "matching"."QuantityTypePrompt" ("quantity_type", "ai_quantity_context") VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Para pañales: Buscar cantidades como "paquete de 20", "84 unidades", "mega pack 132 pzas". Tamaños comunes: 20-40 (paquetes pequeños), 50-90 (paquetes medianos), 100+ (paquetes grandes). Extraer cantidad numérica y tipo de unidad (piezas, unidades, pañales). Términos clave: "piezas", "pzas", "unidades", "uds", "pack", "paquete".');

-- Insert ProductSpecsPrompt data for AI specs context (category+type combinations)
-- Generic prompts for all spec values of each type within a category

-- Spanish/Mexico Pañales (category: a1bb06cd-b954-498b-a45e-770900f29466)
INSERT INTO "matching"."ProductSpecsPrompt" ("category", "type", "ai_specs_context") VALUES
('a1bb06cd-b954-498b-a45e-770900f29466', 'step', 'Pañales por etapa/talla según peso y edad del bebé. Buscar indicadores: "Recién nacido/RN/Newborn" (2-5kg), "Etapa 1" (2-5kg), "Etapa 2/Talla S" (3-6kg), "Etapa 3/Talla M" (5-10kg), "Etapa 4/Talla G" (9-13kg), "Etapa 5/Talla XG" (12-16kg), "Etapa 6/Talla XXG" (15-20kg), "Etapa 7" (20kg+), "Entrenamiento/Training/Pull-ups". Términos clave: etapa, talla, stage, size, peso, kg, meses.'),
('a1bb06cd-b954-498b-a45e-770900f29466', 'gender', 'Pañales según género del bebé. Buscar indicadores en este orden: 
- "Niño/Boy/Masculino" (azul, para él)
- "Niña/Girl/Femenino" (rosa, para ella)
- "Unisex/Mixto/Universal" (niño y niña)

Términos clave: género, sexo, boy, girl, unisex, azul, rosa.');

-- Insert CategoryPrompt data for category-specific price and quantity context (language-specific)
INSERT INTO "matching"."CategoryPrompt" ("category", "ai_price_context", "ai_quantity_context") VALUES 
-- Mexico categories (Spanish)
('a1bb06cd-b954-498b-a45e-770900f29466', 'Para pañales: Rangos de precios típicos 50-500 MXN dependiendo del tamaño del paquete y marca. Precios premium: 300-500 MXN, precios económicos: 50-200 MXN. Buscar indicadores: "oferta", "descuento", "precio especial", "rebaja".', 'Para pañales: Buscar cantidades específicas como "20 pañales", "84 unidades", "132 piezas". Formatos comunes: paquete pequeño (20-40), paquete grande (50-90), mega pack (100+). Términos: "paquete", "pack", "unidades", "piezas".');

-- ProductRules for Pañales category
INSERT INTO "matching"."ProductRules" (category, type, min, max) VALUES 
('a1bb06cd-b954-498b-a45e-770900f29466', 'price_per_unit', 1.5, 20),
('a1bb06cd-b954-498b-a45e-770900f29466', 'quantity', 10, 500),
('a1bb06cd-b954-498b-a45e-770900f29466', 'price', 50, 5000);
