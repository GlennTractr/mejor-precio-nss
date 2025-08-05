INSERT INTO "public"."Country" ("label") VALUES ('MX'), ('QC');

-- INSERT INTO "public"."File" ("id", "is_public", "file_bucket", "file_path") VALUES ('2eee2e9c-8be9-4da7-bf8c-89ffc4b3182a', true, 'product', 'not_found.png');

INSERT INTO "public"."ProductCategory" ("id", "created_at", "label", "slug", "image_bucket", "image_path", "country") VALUES 
('9b16f8f5-a36b-4a58-a81e-669a711556ba', '2024-10-26 23:49:02.148871+00', 'Toallitas', 'toallitas', null, null, 'MX'), 
('a1bb06cd-b954-498b-a45e-770900f29466', '2024-09-22 22:43:10.067073+00', 'Pañales', 'panales', null, null, 'MX');

/*
INSERT INTO "public"."ProductCategory" ("id", "created_at", "label", "slug", "image_bucket", "image_path", "country") VALUES 
('747061ba-376b-4214-8324-820caaf7febd', '2025-02-28 03:25:01.74025+00', 'Couche', 'couche', null, null, 'QC');
*/


INSERT INTO "public"."Shop" ("id", "label", "img_url") VALUES 
('192114b2-4c05-4a35-86dc-02c90327720a', 'Mercado Libre', '/shop/mercado-libre.png'),
('691a4aab-c095-4b3a-a547-df136e66ce25', 'Amazon', '/shop/amazon.png'),
('86cc689f-f2a6-4350-b88c-60b9d80bf228', 'Walmart', '/shop/walmart.png'),
('94b9d420-8c12-4b04-9699-a0bfa84649bf', 'Aurrera', '/shop/aurrera.png'),
('97610a47-57f5-46b4-882e-71df9b19f4a3', 'Ahorro', '/shop/ahorro.png'),
('b88cd8b0-bbf6-4226-ab94-fca45b41d02f', 'Sam''s club', '/shop/sams-club.png'),
('f5eb82b7-3d56-45f2-af8a-30d9c6c42779', 'Guadalajara', '/shop/guadalajara.png'),
('aa936c52-90b6-4010-8f4a-f4f368a871b0', 'Chedraui', '/shop/chedraui.png'),
('9f7fabe7-acca-40b5-a010-bfb2c5f22434', 'Soriana', '/shop/soriana.png');

/*
## SHOP QC
INSERT INTO "public"."Shop" ("id", "created_at", "label", "img_url") VALUES 
('286c36d4-d9fc-4776-a185-c6fc3098cbb4', '2025-02-28 04:49:54.065665+00', 'AmazonCA', '/shop/amazon-ca.png'),
('8f8fc18c-2afb-4838-b262-63d852225bed', '2025-02-28 04:49:23.800319+00', 'SuperC', '/shop/superc.png'),
('9ee99dcd-c884-49e0-9a64-c7badd496884', '2025-02-28 04:09:25.774291+00', 'Jean-Coutu', '/shop/jean.png'),; 
*/

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
('10', '9f7fabe7-acca-40b5-a010-bfb2c5f22434', 'soriana.com');


INSERT INTO "public"."ProductBrand" ("id", "created_at", "label") VALUES 
('21dcc1e6-362c-4572-8575-ad865a081e76', '2024-11-17 04:35:33.28119+00', 'Bio Baby'),
('4bad11d0-8617-4ea9-8889-e6ddd4ed51b6', '2024-11-17 04:34:35.682845+00', 'Chicolastic'),
('5631009f-e566-4b1b-a2ba-ada18ed00f9e', '2024-09-22 22:39:26.667658+00', 'Huggies'),
('6d3d6fa2-7b7a-4ef0-9e25-c0af4cf40413', '2024-11-17 04:32:33.454922+00', 'KleenBebé'),
('8bb603fd-cef0-4732-9790-82925b987f41', '2024-11-17 04:33:33.303266+00', 'BB Tips'),
('a0be820a-d5fe-4e94-97e4-96630d3df96f', '2024-10-29 02:29:57.427213+00', 'Gugu'),
('57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '2024-11-17 04:32:07.268153+00', 'Pampers');


INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES 
('9b16f8f5-a36b-4a58-a81e-669a711556ba', '5631009f-e566-4b1b-a2ba-ada18ed00f9e'),
('a1bb06cd-b954-498b-a45e-770900f29466', '21dcc1e6-362c-4572-8575-ad865a081e76'),
('a1bb06cd-b954-498b-a45e-770900f29466', '4bad11d0-8617-4ea9-8889-e6ddd4ed51b6'),
('a1bb06cd-b954-498b-a45e-770900f29466', '5631009f-e566-4b1b-a2ba-ada18ed00f9e'),
('a1bb06cd-b954-498b-a45e-770900f29466', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7'),
('a1bb06cd-b954-498b-a45e-770900f29466', '6d3d6fa2-7b7a-4ef0-9e25-c0af4cf40413'),
('a1bb06cd-b954-498b-a45e-770900f29466', '8bb603fd-cef0-4732-9790-82925b987f41'),
('a1bb06cd-b954-498b-a45e-770900f29466', 'a0be820a-d5fe-4e94-97e4-96630d3df96f');

/*
INSERT INTO "public"."ProductBrandCategory" ("category", "brand") VALUES 
('747061ba-376b-4214-8324-820caaf7febd', '5631009f-e566-4b1b-a2ba-ada18ed00f9e'),
('747061ba-376b-4214-8324-820caaf7febd', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7');
*/



INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('699c4d3c-a8f5-4ff5-94f0-10ea9f518982', '2024-11-17 04:55:42.786599+00', 'Supreme', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('7073e360-67e0-40a1-ae7d-71c95f7e7b69', '2024-10-26 23:47:13.27697+00', 'UltraConfort', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('72845c43-907c-4413-a846-1d0134eecca8', '2024-11-17 04:38:08.979352+00', 'Pull-Ups', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('9dad3c4f-8cee-4c61-bf40-0552cf2649d6', '2024-11-17 04:38:22.256685+00', 'Little swimmer', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('b025f095-fa78-4030-a852-c7c23a7d9860', '2024-11-17 04:37:49.372313+00', 'All Around', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466'),
('efe76755-8452-465b-a70f-513b9ed49290', '2024-11-17 04:55:55.39221+00', 'Eco protect', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', 'a1bb06cd-b954-498b-a45e-770900f29466');


/*
INSERT INTO "public"."ProductModel" ("id", "created_at", "label", "brand", "category") VALUES 
('000e3d35-e21a-4349-9cac-5a14d58ad8e1', '2025-03-23 04:33:07.194699+00', 'Little movers', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', '747061ba-376b-4214-8324-820caaf7febd'),
('31954f49-5e84-495e-95d7-3db1214650fc', '2025-02-28 03:33:41.63739+00', 'Swaddlers', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '747061ba-376b-4214-8324-820caaf7febd'),
('31ebd9d4-8211-46a8-a686-ec46c2a62b93', '2025-03-23 04:35:49.203001+00', 'Snug and dry', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', '747061ba-376b-4214-8324-820caaf7febd'),
('3a8c4573-3b4c-4150-b982-3031c8d162e9', '2025-02-28 03:34:52.661071+00', 'Pure Protection', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '747061ba-376b-4214-8324-820caaf7febd'),
('8933175a-bd40-40e3-8757-552b4e2ebdd1', '2025-03-23 04:34:51.440365+00', 'Overnight', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '747061ba-376b-4214-8324-820caaf7febd'),
('a96d12c9-56c8-4012-ae55-e6375e81aff0', '2025-03-23 04:37:29.192044+00', 'Overnites', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', '747061ba-376b-4214-8324-820caaf7febd'),
('c14afc22-145f-49cf-b76c-8a622bbaafe8', '2025-02-28 03:34:06.071422+00', 'Baby-Dry', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '747061ba-376b-4214-8324-820caaf7febd'),
('ddc8569a-7463-4cb4-84dc-d3c0b1c42c27', '2025-02-28 03:34:27.604579+00', 'Cruisers', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '747061ba-376b-4214-8324-820caaf7febd'),
('f4dea916-3c4b-4b02-938a-fdb4cc456cbb', '2025-03-23 04:33:58.314951+00', 'Little snugglers', '5631009f-e566-4b1b-a2ba-ada18ed00f9e', '747061ba-376b-4214-8324-820caaf7febd'),
('f993dee1-4487-42f5-8ab2-154768070aef', '2025-03-10 16:36:27.389476+00', 'Cruisers 360', '57d490e7-2bad-4bbd-8d6a-dcc1aa077af7', '747061ba-376b-4214-8324-820caaf7febd');
*/



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

/*
INSERT INTO "public"."ProductSpecs" ("id", "created_at", "category", "type", "label") VALUES 
('11597c71-dc20-4c05-84c3-d21172bd486b', '2025-02-28 03:36:52.514576+00', '747061ba-376b-4214-8324-820caaf7febd', 'gender', 'unisex'),
('20729b27-7824-4be5-9d2d-488126906396', '2025-02-28 03:39:19.038103+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', '3'),
('2953ab82-3faf-41dd-b0c9-5d8f1d8aa607', '2025-02-28 03:36:00.632638+00', '747061ba-376b-4214-8324-820caaf7febd', 'gender', 'garcon'),
('2e1f0e97-191b-49a1-965f-dec8e3f54c2b', '2025-02-28 03:39:06.392031+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', '2'),
('42a76d78-85f4-494b-8768-18945bc8a8f7', '2025-02-28 03:38:51.218423+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', '1'),
('52c3d92d-edce-4d00-9574-a4f91b920e94', '2025-02-28 03:39:29.583042+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', '4'),
('6b1a7832-60cf-4e7d-9733-ace74f16eba3', '2025-02-28 03:36:14.364189+00', '747061ba-376b-4214-8324-820caaf7febd', 'gender', 'fille'),
('ab928aec-7328-44fe-83e8-73cc812140fa', '2025-03-23 04:38:57.130625+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', '7'),
('c2305726-21be-4e17-a7e8-b15796654eeb', '2025-02-28 03:38:35.1222+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', 'P0'),
('c762120e-2b6e-4e8d-b48a-42ac1f8ae919', '2025-02-28 03:39:55.89228+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', '6'),
('cdc24c33-b849-42db-bf72-77fb6fe34f76', '2025-02-28 03:39:44.510538+00', '747061ba-376b-4214-8324-820caaf7febd', 'step', '5');
*/



INSERT INTO "matching"."Sources" 
("url", "disabled") 
VALUES 
( 'https://listado.mercadolibre.com.mx/huggies-ultra-confort?sb=all_mercadolibre#D[A:huggies%20ultra%20confort]', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=5&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/desechables/huggies-ultra-confort_Desde_145_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_289_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.chedraui.com.mx/bebes/panales?initialMap=c,c&initialQuery=bebes/panales&layout=grid&map=category-1,category-2,brand&page=2&query=/bebes/panales/huggies&searchState', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/desechables/huggies-ultra-confort_Desde_97_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_49_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=2&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/desechables/huggies-ultra-confort_Desde_49_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.bodegaaurrera.com.mx/search?catId=265136_265207_265214&facet=brand%3AHuggies', 'false'), 
('https://www.sams.com.mx/search?ss=selectPickupStore&catId=30168_30178_30179&facet=brand%3AHuggies', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_241_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.farmaciasguadalajara.com/SearchDisplay?categoryId=&storeId=10151&searchType=1001&catalogId=10052&langId=-24&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=100&searchTerm=huggies&#facet:&productBeginIndex:0&facetLimit:&orderBy:&pageView:grid&minPrice:&maxPrice:&pageSize:40&', 'false'), 
('https://super.walmart.com.mx/search?q=huggies&facet=category_names_level1%3ABeb%C3%A9s%7C%7Cbrand%3AHuggies&page=2', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=7&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://super.walmart.com.mx/search?q=huggies&facet=category_names_level1%3ABeb%C3%A9s%7C%7Cbrand%3AHuggies', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_145_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.soriana.com/bebes/panales-y-toallitas/huggies/?prefn1=brand&prefv1=Huggies&view=grid&cref=0&cgid=huggies&srule=huggies&start=48&sz=24&pageNumber=3&forceOldView=false', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_433_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.chedraui.com.mx/bebes/panales?initialMap=c,c&initialQuery=bebes/panales&layout=grid&map=category-1,category-2,brand&query=/bebes/panales/huggies&searchState', 'false'), 
('https://www.amazon.com.mx/s?k=huggies+supreme&crid=2PMS48RO7O6X2&sprefix=%2Caps%2C106&ref=nb_sb_ss_recent_1_0_recent', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_385_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_97_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=9&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=6&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://www.amazon.com.mx/s?rh=n%3A16687724011%2Cp_123%3A236240&dc&qid=1753743717&rnid=119962389011&ref=sr_nr_p_123_0', 'false'), 
('https://www.fahorro.com/catalogsearch/result/index/?q=huggies&product_list_limit=90', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=3&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://www.soriana.com/bebes/panales-y-toallitas/huggies/', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_193_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.chedraui.com.mx/bebes/panales?initialMap=c,c&initialQuery=bebes/panales&layout=grid&map=category-1,category-2,brand&page=3&query=/bebes/panales/huggies&searchState', 'false'), 
('https://listado.mercadolibre.com.mx/huggies-supreme?sb=all_mercadolibre#D[A:huggies%20supreme]', 'false'), 
('https://www.soriana.com/bebes/panales-y-toallitas/huggies/?prefn1=brand&prefv1=Huggies&view=grid&cref=0&cgid=huggies&srule=undefined&start=24&sz=24&pageNumber=2&forceOldView=false', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=10&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_NoIndex_True?sb=all_mercadolibre#applied_filter_id%3Dcategory%26applied_filter_name%3DCategor%C3%ADas%26applied_filter_order%3D3%26applied_value_id%3DMLM440833%26applied_value_name%3DPa%C3%B1ales%26applied_value_order%3D3%26applied_value_results%3D458%26is_custom%3Dfalse', 'false'), 
('https://listado.mercadolibre.com.mx/huggies-eco-protect?sb=all_mercadolibre#D[A:huggies%20eco%20protect]', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=8&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false'), 
('https://listado.mercadolibre.com.mx/bebes/higiene-cuidado-bebe/panales/huggies-supreme_Desde_337_NoIndex_True?sb=all_mercadolibre', 'false'), 
('https://www.amazon.com.mx/s?i=baby&rh=n%3A16687724011%2Cp_123%3A236240&dc&page=4&qid=1753850426&rnid=119962389011&xpid=gyrE9CoXmsWwh&ref=sr_pg_2', 'false');

-- ProductRules for Pañales category
INSERT INTO "matching"."ProductRules" (category, type, min, max) VALUES 
('a1bb06cd-b954-498b-a45e-770900f29466', 'price_per_unit', 3, 10),
('a1bb06cd-b954-498b-a45e-770900f29466', 'quantity', 10, 500),
('a1bb06cd-b954-498b-a45e-770900f29466', 'price', 50, 5000);