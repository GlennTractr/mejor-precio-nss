-- ==============================================================================
-- SEED DATA FOR NEW MEXICAN SHOPS
-- ==============================================================================
-- This seed file adds three new shops to the Mexico market:
-- - Liverpool: https://www.liverpool.com.mx/
-- - Sears: https://www.sears.com.mx/
-- - El Palacio de Hierro: https://www.elpalaciodehierro.com/
--
-- Date: 2025-10-13
-- Market: Mexico (MX)
-- ==============================================================================

-- ==============================================================================
-- SHOP ENTRIES
-- ==============================================================================

-- Insert new shops with Mexico country reference
INSERT INTO "public"."Shop" ("id", "label", "img_url", "country") VALUES
('d1f2e3a4-b5c6-47d8-89e0-f1a2b3c4d5e6', 'Liverpool', '/shop/liverpool.png', '440e8400-e29b-41d4-a716-446655440001'),
('e2a3b4c5-d6e7-48f9-90a1-b2c3d4e5f6a7', 'Sears', '/shop/sears.png', '440e8400-e29b-41d4-a716-446655440001'),
('f3b4c5d6-e7f8-49a0-a1b2-c3d4e5f6a7b8', 'El Palacio de Hierro', '/shop/palacio-hierro.png', '440e8400-e29b-41d4-a716-446655440001');

-- ==============================================================================
-- SHOP IDENTIFIERS (DOMAINS)
-- ==============================================================================

-- Insert domain identifiers for the new shops
-- Note: IDs continue from last existing ID (11) in main seed.sql
INSERT INTO "public"."ShopIdentifier" ("shop", "domain") VALUES
('d1f2e3a4-b5c6-47d8-89e0-f1a2b3c4d5e6', 'liverpool.com.mx'),
('d1f2e3a4-b5c6-47d8-89e0-f1a2b3c4d5e6', 'www.liverpool.com.mx'),
('e2a3b4c5-d6e7-48f9-90a1-b2c3d4e5f6a7', 'sears.com.mx'),
('e2a3b4c5-d6e7-48f9-90a1-b2c3d4e5f6a7', 'www.sears.com.mx'),
('f3b4c5d6-e7f8-49a0-a1b2-c3d4e5f6a7b8', 'elpalaciodehierro.com'),
('f3b4c5d6-e7f8-49a0-a1b2-c3d4e5f6a7b8', 'www.elpalaciodehierro.com');

-- ==============================================================================
-- SHOP INFORMATION
-- ==============================================================================

-- Shop: Liverpool
-- - One of Mexico's largest department store chains
-- - Wide range of baby and children products
-- - Website: https://www.liverpool.com.mx/
-- - Domains: liverpool.com.mx, www.liverpool.com.mx

-- Shop: Sears
-- - International department store with strong presence in Mexico
-- - Carries various baby care products and strollers
-- - Website: https://www.sears.com.mx/
-- - Domains: sears.com.mx, www.sears.com.mx

-- Shop: El Palacio de Hierro
-- - Premium department store chain in Mexico
-- - High-end baby products and designer brands
-- - Website: https://www.elpalaciodehierro.com/
-- - Domains: elpalaciodehierro.com, www.elpalaciodehierro.com

-- ==============================================================================
-- FINAL NOTES
-- ==============================================================================

-- New shops seed data completed successfully
-- Added: 3 Shops, 6 ShopIdentifier entries (2 domains per shop)
-- Ready for use in Mexico market

-- Next steps:
-- 1. Add shop logo images to /public/shop/ directory:
--    - /public/shop/liverpool.png
--    - /public/shop/sears.png
--    - /public/shop/palacio-hierro.png
-- 2. Configure crawling/scraping sources for these shops if needed
-- 3. Update any shop selection UI components to include new shops
