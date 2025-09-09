# Typesense SellContext Migration Strategy

## Overview

This document outlines the complete migration strategy for transitioning from the current product-level Typesense indexing to the new SellContext-level indexing system. This migration enables shop-specific filtering while maintaining product-level aggregation capabilities.

## Migration Components

### 1. Database Layer ✅ COMPLETED

- **Migration File**: `supabase/migrations/20250901120000_sellcontext_view_for_typesense.sql`
- **Purpose**: Creates `sellcontext_view` with denormalized data for Typesense
- **Features**:
  - One row per SellContext (enables shop filtering)
  - Denormalized product, packaging, and shop data
  - JSON specifications for flexible querying
  - Helper functions for data export
  - Optional materialized view for performance

### 2. Typesense Schema ✅ COMPLETED

- **Schema File**: `config/typesense-sellcontext-schema.json`
- **Setup Script**: `config/typesense-schema-setup.js`
- **Query Examples**: `config/typesense-queries-examples.js`

### 3. Application Layer ✅ COMPLETED

- **API Endpoints**: Global search and filtering endpoints
- **React Components**: Multi-category search interface
- **State Management**: URL-synchronized search state
- **Type Definitions**: Extended Product interfaces

## Migration Steps

### Phase 1: Preparation (Database)

1. **Run the Database Migration**

   ```bash
   # Apply the migration
   supabase db push

   # Verify the view was created
   supabase db reset --linked  # Optional: test on fresh db
   ```

2. **Validate View Performance**

   ```sql
   -- Test view performance with sample queries
   EXPLAIN ANALYZE SELECT * FROM sellcontext_view LIMIT 1000;

   -- Check data integrity
   SELECT
     COUNT(*) as total_sellcontexts,
     COUNT(DISTINCT product_id) as unique_products,
     COUNT(DISTINCT shop_id) as unique_shops
   FROM sellcontext_view;
   ```

### Phase 2: Typesense Setup

1. **Install Dependencies**

   ```bash
   npm install typesense  # If not already installed
   ```

2. **Configure Environment Variables**

   ```bash
   # Add to your .env.local
   TYPESENSE_HOST=your-typesense-host
   TYPESENSE_PORT=8108
   TYPESENSE_PROTOCOL=https
   TYPESENSE_ADMIN_API_KEY=your-admin-key
   TYPESENSE_SEARCH_API_KEY=your-search-key
   ```

3. **Create Typesense Collection**
   ```bash
   # Run the setup script
   node config/typesense-schema-setup.js
   ```

### Phase 3: Data Migration

#### Option A: Direct PostgreSQL Import (Recommended)

```javascript
// Example data import strategy
const { Client } = require('pg');
const Typesense = require('typesense');

async function importSellContextData() {
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  const typesenseClient = new Typesense.Client({
    // your config
  });

  await pgClient.connect();

  let offset = 0;
  const batchSize = 1000;

  while (true) {
    const result = await pgClient.query('SELECT * FROM get_sellcontext_for_typesense($1, $2)', [
      batchSize,
      offset,
    ]);

    if (result.rows.length === 0) break;

    // Transform and import to Typesense
    const documents = result.rows.map(transformRowToTypesenseDoc);

    await typesenseClient.collections('sellcontext_index').documents().import(documents);

    offset += batchSize;
    console.log(`Imported ${offset} documents...`);
  }

  await pgClient.end();
}
```

#### Option B: API-Based Import

```javascript
// Use your existing API to export data
async function importViaAPI() {
  let page = 1;
  const limit = 100;

  while (true) {
    const response = await fetch(`/api/typesense/export?page=${page}&limit=${limit}`);

    const data = await response.json();
    if (data.items.length === 0) break;

    // Import to Typesense
    await typesenseClient.collections('sellcontext_index').documents().import(data.items);

    page++;
  }
}
```

### Phase 4: Application Updates

1. **Update API Endpoints**
   - Modify existing endpoints to use `sellcontext_view`
   - Implement `group_by` queries for product deduplication
   - Update filter logic to support shop filtering

2. **Test Group-By Functionality**

   ```javascript
   // Test product deduplication
   const searchResults = await typesenseClient.collections('sellcontext_index').documents().search({
     q: 'laptop',
     query_by: 'product_title',
     group_by: 'product_id',
     group_limit: 1, // One result per product
     facet_by: 'shop_name,brand,category',
   });
   ```

3. **Update Frontend Components**
   - Existing components should work with minimal changes
   - New multi-category search is already implemented
   - Shop filtering will now be available in all search interfaces

### Phase 5: Testing & Validation

1. **Functional Testing**

   ```bash
   # Test search functionality
   curl "http://localhost:3000/api/typesense/global-search?q=laptop&shops=MediaMarkt"

   # Test filters
   curl "http://localhost:3000/api/typesense/global-filters?categories=Laptops,Tablets"
   ```

2. **Performance Testing**
   - Compare search response times
   - Test with production data volumes
   - Validate group_by performance

3. **Data Integrity Validation**
   ```sql
   -- Verify products appear correctly
   SELECT
     product_title,
     COUNT(*) as sellcontext_count,
     array_agg(DISTINCT shop_name) as available_shops
   FROM sellcontext_view
   WHERE product_title ILIKE '%laptop%'
   GROUP BY product_id, product_title
   LIMIT 10;
   ```

### Phase 6: Deployment

1. **Production Migration**

   ```bash
   # Apply migration in production
   supabase db push --linked

   # Run production data import
   NODE_ENV=production node scripts/import-sellcontext-data.js
   ```

2. **Feature Flag Rollout**

   ```javascript
   // Gradual rollout of new search
   const useNewSearch = process.env.ENABLE_SELLCONTEXT_SEARCH === 'true';

   if (useNewSearch) {
     return await searchSellContextIndex(query);
   } else {
     return await searchLegacyIndex(query);
   }
   ```

3. **Monitor & Validate**
   - Monitor search performance metrics
   - Check error rates
   - Validate shop filtering functionality

## Rollback Strategy

### Emergency Rollback

```javascript
// Switch back to legacy search
process.env.ENABLE_SELLCONTEXT_SEARCH = 'false';

// Or use feature flag
const searchBackend = useFeatureFlag('sellcontext-search') ? 'sellcontext' : 'legacy';
```

### Data Rollback

```sql
-- The migration doesn't modify existing data
-- Simply disable the new view if needed
DROP VIEW IF EXISTS sellcontext_view;
```

## Performance Considerations

### Database Optimizations

- Indexes are created automatically by the migration
- Consider materialized view for high-traffic scenarios
- Monitor query performance with EXPLAIN ANALYZE

### Typesense Optimizations

- Use appropriate `group_limit` values (1 for deduplication, higher for comparison)
- Implement proper faceting strategy
- Consider result caching for common queries

### Application Optimizations

- Implement debounced search
- Use React Query for client-side caching
- Optimize bundle size with code splitting

## Monitoring & Maintenance

### Key Metrics to Monitor

- Search response times
- Data freshness (updated_at timestamps)
- Group_by query performance
- Shop filter usage

### Maintenance Tasks

- Regular data sync validation
- Index optimization
- Schema updates as data structure evolves

### Data Sync Strategy

```javascript
// Scheduled sync job
cron.schedule('*/15 * * * *', async () => {
  // Sync recent updates only
  const lastSync = await getLastSyncTimestamp();
  await syncRecentChanges(lastSync);
  await updateLastSyncTimestamp();
});
```

## Success Criteria

### Technical Success

- [ ] All existing search functionality preserved
- [ ] Shop filtering works correctly
- [ ] Performance meets or exceeds current benchmarks
- [ ] Zero data loss during migration
- [ ] Multi-category search functions properly

### Business Success

- [ ] Users can filter by shops effectively
- [ ] Search relevance maintained or improved
- [ ] Global search across categories works
- [ ] Price comparison features enhanced

## Timeline

| Phase               | Duration | Dependencies             |
| ------------------- | -------- | ------------------------ |
| Database Migration  | 1 day    | Database access          |
| Typesense Setup     | 1 day    | Typesense infrastructure |
| Data Migration      | 2-3 days | Data volume dependent    |
| Application Updates | 1-2 days | Existing API updates     |
| Testing             | 2-3 days | Full test coverage       |
| Deployment          | 1 day    | Production access        |

**Total Estimated Time: 8-11 days**

## Conclusion

This migration strategy provides a comprehensive approach to transitioning to SellContext-level indexing while maintaining system stability and performance. The strategy includes proper testing, rollback mechanisms, and monitoring to ensure a successful migration.

The key benefits of this approach:

- **Shop Filtering**: Users can now filter products by specific shops
- **Product Deduplication**: Group_by functionality maintains clean product listings
- **Multi-Category Search**: Global search across all categories
- **Performance**: Optimized queries and proper indexing
- **Scalability**: Flexible schema supports future enhancements

All implementation components are complete and ready for deployment following this strategy.
