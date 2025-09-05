# AI Context Enhancement Migration

**Migration File**: `20250830150000_ai_context_enhancement.sql`  
**Date**: August 30, 2025  
**Purpose**: Enhance AI prompt context capabilities with country/language scoping and quantity type system  

## Overview

This migration significantly enhances the database architecture to support more sophisticated AI-driven product extraction and analysis. The key improvements include:

- **Country Scoping**: All categories and shops are now scoped by country to avoid cross-country data pollution
- **Language Support**: Foundation for multi-language AI prompts with country-language associations  
- **AI Context Tables**: Rich contextual information for currency, quantity, and product specifications
- **UUID Consistency**: Complete migration from TEXT to UUID primary keys for better performance
- **Quantity Type System**: Structured approach to product quantity classification

## Business Rationale

### Problem Solved
1. **Cross-Country Pollution**: Previously, categories and shops weren't scoped by country, leading to irrelevant results
2. **AI Context Limitations**: Limited contextual information for AI prompts resulted in suboptimal product extraction
3. **Inconsistent ID Strategy**: Mix of TEXT and UUID primary keys created performance and consistency issues  
4. **Language Barriers**: No systematic approach to handle different languages for AI prompts
5. **AI Prompt Tracking**: No way to audit or debug AI prompts that were actually sent to models

### Benefits
- **Improved AI Accuracy**: Rich context helps AI better understand currency, quantities, and product specifications
- **Country-Specific Results**: Users only see products and shops relevant to their country
- **Scalable Architecture**: Easy to add new countries and languages without structural changes
- **Better Performance**: UUID primary keys with proper indexing improve query performance
- **Data Duplication Strategy**: Same brands/models can exist across countries with appropriate scoping
- **AI Prompt Auditing**: Full tracking of prompts and tools sent to AI models for debugging and optimization
- **Cost Analysis**: Better correlation between prompt content and token costs for optimization

## Database Schema Changes

### New Tables

#### `public.Language`
```sql
CREATE TABLE "public"."Language" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "label" TEXT NOT NULL UNIQUE  -- 'en', 'fr', 'es'
);
```

#### `public.QuantityType` 
```sql
CREATE TABLE "public"."QuantityType" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "label" TEXT NOT NULL,           -- 'Pañales' 
    "internal_label" TEXT NOT NULL,  -- 'panales'
    "unit_label" TEXT NOT NULL       -- 'per panales'
);
```

#### `matching.CountryPrompt`
```sql
CREATE TABLE "matching"."CountryPrompt" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "country" UUID NOT NULL UNIQUE REFERENCES "public"."Country"("id"),
    "ai_currency_context" TEXT NOT NULL
);
```

#### `matching.QuantityTypePrompt`
```sql  
CREATE TABLE "matching"."QuantityTypePrompt" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "quantity_type" UUID NOT NULL UNIQUE REFERENCES "public"."QuantityType"("id"),
    "ai_quantity_context" TEXT NOT NULL
);
```

#### `matching.ProductSpecsPrompt`
```sql
CREATE TABLE "matching"."ProductSpecsPrompt" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "product_spec" UUID NOT NULL UNIQUE REFERENCES "public"."ProductSpecs"("id"),
    "ai_specs_context" TEXT NOT NULL
);
```

#### `matching.CategoryPrompt`
```sql
CREATE TABLE "matching"."CategoryPrompt" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "category" UUID NOT NULL UNIQUE REFERENCES "public"."ProductCategory"("id"),
    "ai_price_context" TEXT NOT NULL,
    "ai_quantity_context" TEXT NOT NULL
);
```

### Enhanced Tables

#### `matching.ProcessIntentAIUsage` - Prompt Tracking Enhancement
**Before:**
```sql
"ProcessIntentAIUsage" (
    "id" UUID PRIMARY KEY,
    "process_intent" UUID,
    "label" TEXT,
    "model" TEXT, 
    "type" TEXT,
    "prompt_tokens" NUMBER,
    "completion_tokens" NUMBER,
    "total_tokens" NUMBER,
    "cost" NUMBER,
    "time" NUMBER
)
```

**After:**
```sql
"ProcessIntentAIUsage" (
    "id" UUID PRIMARY KEY,
    "process_intent" UUID,
    "label" TEXT,
    "model" TEXT,
    "type" TEXT, 
    "prompt_tokens" NUMBER,
    "completion_tokens" NUMBER,
    "total_tokens" NUMBER,
    "cost" NUMBER,
    "time" NUMBER,
    "prompt" TEXT NOT NULL,  -- NEW: Full AI prompt sent
    "tools" TEXT             -- NEW: AI tools metadata (optional)
)
```

### Modified Tables

#### `public.Country` - Primary Key Migration
**Before:**
```sql
"Country" (
    "label" TEXT PRIMARY KEY  -- 'MX', 'QC'
)
```

**After:**
```sql
"Country" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "label" TEXT NOT NULL,  -- 'MX', 'QC' 
    "language" UUID NOT NULL REFERENCES "public"."Language"("id")
)
```

#### `public.Shop` - Country Scoping
**Before:**
```sql
"Shop" (
    "id" UUID PRIMARY KEY,
    "label" TEXT,
    "img_url" TEXT
)
```

**After:**
```sql
"Shop" (
    "id" UUID PRIMARY KEY,
    "label" TEXT,
    "img_url" TEXT, 
    "country" UUID NOT NULL REFERENCES "public"."Country"("id")  -- NEW
)
```

#### `public.ProductCategory` - Enhanced Relationships
**Before:**
```sql
"ProductCategory" (
    "id" UUID PRIMARY KEY,
    "label" TEXT,
    "country" TEXT REFERENCES "public"."Country"("label")
)
```

**After:**
```sql
"ProductCategory" (
    "id" UUID PRIMARY KEY,
    "label" TEXT,
    "country" UUID NOT NULL REFERENCES "public"."Country"("id"),        -- UUID ref
    "quantity_type" UUID NOT NULL REFERENCES "public"."QuantityType"("id") -- NEW
)
```

## Migration Strategy

### Phase 1: Structure Creation (Safe)
1. Create Language table with seed data ('en', 'fr', 'es')
2. Create QuantityType table with 'Pañales' seed data  
3. Add temporary UUID column to Country table
4. Create AI context prompt tables in matching schema

### Phase 2: Data Migration (Critical)
1. Generate UUIDs for existing Country records
2. Create mapping table to track label→UUID relationships
3. Map countries to appropriate languages (MX→es, QC→fr)
4. Update all foreign key references to use new UUIDs
5. Migrate ProductCategory and Shop data with country associations

### Phase 3: Constraint Application (Finalization)
1. Drop old TEXT primary key constraints  
2. Establish UUID primary key on Country table
3. Add all new foreign key constraints
4. Apply NOT NULL constraints for required fields
5. Create performance indexes

### Phase 4: AI Context Seeding
1. Insert country-specific currency context for AI prompts
2. Add quantity type context for diaper extraction  
3. Populate sample product spec contexts
4. Apply RLS policies and permissions

## Sample AI Context Data

### CountryPrompt Examples
```sql
-- Mexico
'Mexican market uses Mexican Pesos (MXN). Prices typically shown without tax. 
Common ranges: diapers 50-500 MXN, baby food 20-200 MXN. 
Look for peso symbol ($) or MXN indicators.'

-- Quebec  
'Quebec market uses Canadian Dollars (CAD). Prices include taxes (GST/HST).
Common ranges: diapers 15-80 CAD, baby food 3-25 CAD.
Look for CAD currency or $ with Canadian context.'
```

### QuantityTypePrompt Example
```sql
'For diapers (pañales): Look for quantities like "paquete de 20", "84 unidades", 
"mega pack 132 pzas". Common sizes: 20-40 (small), 50-90 (medium), 100+ (bulk).
Extract numeric quantity and unit type (piezas, unidades, pañales).'
```

### CategoryPrompt Examples
```sql
-- Mexico (Spanish)
'Para pañales: Rangos de precios típicos 50-500 MXN dependiendo del tamaño del paquete y marca. 
Precios premium: 300-500 MXN, precios económicos: 50-200 MXN. 
Buscar indicadores: "oferta", "descuento", "precio especial", "rebaja".'

-- Quebec (French)  
'Pour couches: Gammes de prix typiques 15-80 CAD selon la taille du paquet et marque.
Prix premium: 40-80 CAD, prix économiques: 15-40 CAD.
Chercher indicateurs: "spécial", "rabais", "promotion", "solde".'
```

## Data Impact Analysis

### Existing Data Handling
- **Country Records**: 'MX' and 'QC' preserved with new UUID structure  
- **ProductCategory**: Existing categories updated to UUID references + quantity type
- **Shop**: All shops assigned to Mexico by default (based on .mx domains)
- **ProductSpecs**: Unchanged, but now linked to AI context prompts

### New Data Additions
- **Languages**: 3 records (en, fr, es)
- **QuantityTypes**: 3 records (Spanish/French/English Pañales variants)
- **AI Context Prompts**: ~20 sample records across 4 prompt tables (CountryPrompt, QuantityTypePrompt, CategoryPrompt, ProductSpecsPrompt)
- **CategoryPrompt**: 3 records for category-specific price and quantity context (Spanish/French)
- **Quebec Data**: Previously commented Quebec entries now active

### Foreign Key Updates
- **ProductCategory.country**: TEXT → UUID (2 existing records updated)
- **Shop.country**: Added UUID field (12 shops assigned to countries)  
- **Country.language**: New required relationship (2 countries mapped)

## Performance Considerations

### Indexing Strategy
```sql
-- Primary performance indexes
CREATE INDEX idx_country_language ON "public"."Country"("language");
CREATE INDEX idx_productcategory_country ON "public"."ProductCategory"("country"); 
CREATE INDEX idx_productcategory_quantity_type ON "public"."ProductCategory"("quantity_type");
CREATE INDEX idx_shop_country ON "public"."Shop"("country");

-- AI context lookup indexes  
CREATE INDEX idx_countryprompt_country ON "matching"."CountryPrompt"("country");
CREATE INDEX idx_quantitytypeprompt_quantity_type ON "matching"."QuantityTypePrompt"("quantity_type");
CREATE INDEX idx_productspecsprompt_product_spec ON "matching"."ProductSpecsPrompt"("product_spec");
CREATE INDEX idx_categoryprompt_category ON "matching"."CategoryPrompt"("category");
```

### Query Performance Impact
- **Positive**: UUID primary keys with proper indexes improve JOIN performance
- **Positive**: Country scoping reduces result set sizes  
- **Neutral**: Additional AI context lookups balanced by better filtering
- **Migration Cost**: One-time migration complexity for long-term performance gains

## Security & Permissions

### Row Level Security (RLS)
```sql
-- New tables have RLS enabled by default
ALTER TABLE "public"."Language" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."QuantityType" ENABLE ROW LEVEL SECURITY;  
ALTER TABLE "matching"."CountryPrompt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."QuantityTypePrompt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."ProductSpecsPrompt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matching"."CategoryPrompt" ENABLE ROW LEVEL SECURITY;
```

### Permission Strategy
- **Public Tables**: Read access for all authenticated users
- **Matching Schema**: Service role access for AI processing
- **AI Context**: Read-only for service accounts, admin write access

## Usage Examples

### AI Prompt Enhancement
```typescript
// Before: Basic extraction
const prompt = `Extract product info from: ${html}`;

// After: Enhanced with context
const countryContext = await getCountryPrompt(countryId);
const quantityContext = await getQuantityTypePrompt(quantityTypeId);  
const categoryContext = await getCategoryPrompt(categoryId);
const specsContext = await getProductSpecsPrompt(specId);

const prompt = `
${countryContext.ai_currency_context}
${quantityContext.ai_quantity_context}
${categoryContext.ai_price_context}
${categoryContext.ai_quantity_context}
${specsContext.ai_specs_context}

Extract product info from: ${html}
`;
```

### Country-Scoped Queries
```sql
-- Get categories for Mexico only
SELECT c.* FROM "ProductCategory" c
JOIN "Country" co ON c.country = co.id  
WHERE co.label = 'MX';

-- Get shops with their country language
SELECT s.label, s.img_url, co.label as country, l.label as language
FROM "Shop" s
JOIN "Country" co ON s.country = co.id
JOIN "Language" l ON co.language = l.id;
```

## Rollback Strategy

### Emergency Rollback (if needed)
1. **Backup First**: Ensure complete database backup exists
2. **Reverse Migration**: Create rollback script to restore TEXT primary keys  
3. **Data Restoration**: Restore foreign key references to original TEXT format
4. **Cleanup**: Remove new tables and columns added by migration

### Rollback Complexity: **HIGH**
⚠️ **Warning**: Due to UUID primary key changes and data transformations, rollback is complex and should only be attempted in emergency situations. Thorough testing recommended.

## Post-Migration Tasks

### Required Actions
1. **Type Generation**: Run `npm run gen:types` to update TypeScript definitions
2. **Application Updates**: Update queries to use UUID references instead of TEXT  
3. **AI Integration**: Integrate new context prompts into AI processing pipeline
4. **Testing**: Verify country scoping works correctly across all features
5. **Data Validation**: Confirm all foreign key relationships are intact

### Validation Queries
```sql  
-- Verify UUID migration
SELECT COUNT(*) FROM "Country" WHERE id IS NOT NULL;

-- Check country-shop relationships
SELECT co.label, COUNT(s.id) as shop_count 
FROM "Country" co 
LEFT JOIN "Shop" s ON co.id = s.country 
GROUP BY co.label;

-- Validate AI context completeness
SELECT 'CountryPrompt' as table_name, COUNT(*) as records FROM "matching"."CountryPrompt"
UNION ALL
SELECT 'QuantityTypePrompt', COUNT(*) FROM "matching"."QuantityTypePrompt"  
UNION ALL
SELECT 'CategoryPrompt', COUNT(*) FROM "matching"."CategoryPrompt"
UNION ALL
SELECT 'ProductSpecsPrompt', COUNT(*) FROM "matching"."ProductSpecsPrompt";

-- Verify prompt tracking fields
SELECT 
  COUNT(*) as total_usage_records,
  COUNT(prompt) as records_with_prompt,
  COUNT(tools) as records_with_tools
FROM "matching"."ProcessIntentAIUsage";
```

### AI Prompt Tracking Usage

The new prompt tracking fields enable comprehensive AI audit capabilities:

```sql
-- Log AI usage with full prompt tracking
INSERT INTO "matching"."ProcessIntentAIUsage" (
    "process_intent",
    "label", 
    "model",
    "type",
    "prompt",
    "tools",
    "prompt_tokens",
    "completion_tokens", 
    "cost",
    "time"
) VALUES (
    'process-uuid',
    'product_extraction',
    'gpt-4o',
    'extraction',
    'El mercado mexicano usa Pesos Mexicanos... Extract product info from: <html>...</html>',
    '{"temperature": 0.1, "max_tokens": 1000, "functions": ["extract_product"]}',
    1250,
    340,
    0.025,
    2.5
);

-- Analyze prompt effectiveness by country
SELECT 
    co.label as country,
    AVG(ai.cost) as avg_cost,
    AVG(ai.prompt_tokens) as avg_prompt_tokens,
    COUNT(*) as usage_count
FROM "matching"."ProcessIntentAIUsage" ai
JOIN "matching"."ProcessIntent" pi ON ai.process_intent = pi.id  
JOIN "public"."Country" co ON ai.prompt LIKE '%mexicano%' 
WHERE ai.created_at > NOW() - INTERVAL '30 days'
GROUP BY co.label;

-- Debug failed extractions by analyzing prompts
SELECT 
    ai.label,
    ai.model,
    LEFT(ai.prompt, 200) as prompt_preview,
    ai.tools,
    ai.cost,
    pi.status
FROM "matching"."ProcessIntentAIUsage" ai
JOIN "matching"."ProcessIntent" pi ON ai.process_intent = pi.id
WHERE pi.status = 'failed'
ORDER BY ai.created_at DESC
LIMIT 10;
```

## Future Considerations

### Scalability  
- **New Countries**: Add to Language and Country tables, update AI contexts
- **New Languages**: Add to Language table, create country-language mappings
- **New Quantity Types**: Extend QuantityType table with appropriate AI contexts
- **AI Context Evolution**: Update prompt texts as AI models improve

### Technical Debt Reduction
- **Consistent UUIDs**: All tables now use UUID primary keys uniformly
- **Proper Indexing**: Performance optimized for country-scoped queries
- **Clean Architecture**: Separation of business logic (public) and AI context (matching)

---

**Next Steps**: Apply migration, update application code, and begin leveraging enhanced AI context capabilities for improved product extraction accuracy.