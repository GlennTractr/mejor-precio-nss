INSERT INTO "matching"."Sources" ("url", "disabled") VALUES 

-- Amazon - enfamil
('https://www.amazon.com.mx/s?rh=n%3A9482650011%2Cp_123%3A326522&dc&qid=1759685667&rnid=119962389011&ref=sr_nr_p_123_0', false),
('https://www.amazon.com.mx/s?i=baby&rh=n%3A9482650011%2Cp_123%3A326522&dc&page=2&qid=1759685671&rnid=119962389011&xpid=zXFsLduBsMSII&ref=sr_pg_2', false),

-- Amazon - NAN
('https://www.amazon.com.mx/s?rh=n%3A9482650011%2Cp_123%3A430949&dc&qid=1759685667&rnid=119962389011&ref=sr_nr_p_123_1', false),

-- Amazon - Similac
('https://www.amazon.com.mx/s?rh=n%3A9482650011%2Cp_123%3A232497&dc&qid=1759685667&rnid=119962389011&ref=sr_nr_p_123_2', false),
('https://www.amazon.com.mx/s?i=baby&rh=n%3A9482650011%2Cp_123%3A232497&dc&page=2&qid=1759685787&rnid=119962389011&xpid=8BW8kzITmV3Wz&ref=sr_pg_2', false);


INSERT INTO "matching"."Sources" ("url", "disabled") VALUES

-- Mercado libre - enfamil
('https://listado.mercadolibre.com.mx/bebes/comida-bebes/leche-bebes/enfamil/_NoIndex_True?original_category_landing=true#applied_filter_id%3DBRAND%26applied_filter_name%3DMarca%26applied_filter_order%3D5%26applied_value_id%3D1000001%26applied_value_name%3DEnfamil%26applied_value_order%3D1%26applied_value_results%3D310%26is_custom%3Dfalse', false),
('https://listado.mercadolibre.com.mx/bebes/comida-bebes/leche-bebes/enfamil/_Desde_49_NoIndex_True_original*category*landing_true?original_category_landing=true', false),

-- Mercado libre - NAN
('https://listado.mercadolibre.com.mx/bebes/comida-bebes/leche-bebes/nan/_NoIndex_True?original_category_landing=true#applied_filter_id%3DBRAND%26applied_filter_name%3DMarca%26applied_filter_order%3D5%26applied_value_id%3D2498951%26applied_value_name%3DNan%26applied_value_order%3D1%26applied_value_results%3D373%26is_custom%3Dfalse', false),
('https://listado.mercadolibre.com.mx/bebes/comida-bebes/leche-bebes/nan/_Desde_49_NoIndex_True_original*category*landing_true?original_category_landing=true', false),


-- Mercado libre - Similac
('https://listado.mercadolibre.com.mx/bebes/comida-bebes/leche-bebes/similac/_NoIndex_True?original_category_landing=true#origin=brand_carousel&position=2&id=2600597&applied_filter_id%3DBRAND%26applied_filter_name%3DMarca%26applied_filter_order%3D1%26applied_value_id%3D2600597%26applied_value_name%3DSimilac%26applied_value_order%3D3%26applied_value_results%3D198%26is_custom%3Dfalse', false),
('https://listado.mercadolibre.com.mx/bebes/comida-bebes/leche-bebes/similac/_Desde_49_NoIndex_True_original*category*landing_true?original_category_landing=true', false);



-- Ahorro
INSERT INTO "matching"."Sources" ("url", "disabled") VALUES
('https://www.fahorro.com/catalogsearch/result/?q=enfamil', false),
('https://www.fahorro.com/catalogsearch/result/?q=nan', false),
('https://www.fahorro.com/catalogsearch/result/?q=similac', false);


-- Aurrera
INSERT INTO "matching"."Sources" ("url", "disabled") VALUES
('https://despensa.bodegaaurrera.com.mx/browse/articulos-para-bebes-y-ninos/formula-lactea/02_0206?facet=brand%3ANAN', false),
('https://despensa.bodegaaurrera.com.mx/browse/articulos-para-bebes-y-ninos/formula-lactea/02_0206?facet=brand%3AEnfagrow', false);


-- Soriana
INSERT INTO "matching"."Sources" ("url", "disabled") VALUES
('https://www.soriana.com/bebes/nutricion-infantil/formulas-lacteas/', false),
('https://www.soriana.com/bebes/nutricion-infantil/formulas-lacteas/?cgid=formulas-lacteas&srule=undefined&start=24&sz=24&pageNumber=2&forceOldView=false&view=grid', false),
('https://www.soriana.com/bebes/nutricion-infantil/formulas-lacteas/?cgid=formulas-lacteas&srule=formulas-lacteas&start=48&sz=24&pageNumber=3&forceOldView=false&view=grid&cref=0', false);



-- Chedraui
INSERT INTO "matching"."Sources" ("url", "disabled") VALUES
('https://www.chedraui.com.mx/bebes/formulas-y-alimentos-infantiles/formulas-infantiles?srsltid=AfmBOoo4DX4acQvZShYpx-ct7eyOkKCGv8xLyAjb1x4WiLIv3xcMErDD', false),
('https://www.chedraui.com.mx/bebes/formulas-y-alimentos-infantiles/formulas-infantiles?page=2&srsltid=AfmBOoo4DX4acQvZShYpx-ct7eyOkKCGv8xLyAjb1x4WiLIv3xcMErDD', false);




-- Guadalajara
INSERT INTO "matching"."Sources" ("url", "disabled") VALUES
('https://www.farmaciasguadalajara.com/formulas-infantiles-es?#facet:-1002786578&productBeginIndex:0&facetLimit:&orderBy:&pageView:grid&minPrice:&maxPrice:&pageSize:40&', false),
('https://www.farmaciasguadalajara.com/formulas-infantiles-es?#facet:-100269787065777376,-10026978706571827987&productBeginIndex:0&facetLimit:&orderBy:&pageView:grid&minPrice:&maxPrice:&pageSize:40&', false),
('https://www.farmaciasguadalajara.com/formulas-infantiles-es?#facet:-100283737773766567&productBeginIndex:0&facetLimit:&orderBy:&pageView:grid&minPrice:&maxPrice:&pageSize:40&', false);


-- Walmart
INSERT INTO "matching"."Sources" ("url", "disabled") VALUES
('https://www.walmart.com.mx/browse/bebes/formula-lactea/265136_265144_780104?srsltid=AfmBOoq2zeIPDd-AM1rypZnHXt3SAPcDHTPy_6H95KC3mOGeVDzcEnlS&facet=brand%3ANAN%7C%7Cbrand%3AEnfamil%7C%7Cbrand%3AEnfagrow%7C%7Cbrand%3ASimilac+Comfort', false);
