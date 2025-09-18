// SECURITY NOTICE: This file has been deprecated for security reasons.
// Direct Typesense client access has been removed to prevent exposure of admin credentials.
// 
// All Typesense operations are now handled through secure API endpoints:
// - Category operations: /api/typesense/category/*
// - Global search: /api/typesense/global/*
// - Home products: /api/typesense/home/*
// - Other operations: /api/typesense/*
//
// Use the corresponding query functions in:
// - src/lib/api/category-queries.ts (for category-specific operations)
// - src/lib/api/global-search-queries.ts (for global search operations)
//
// DO NOT import or use this file. It will throw an error if accessed.

export const typesenseClient = new Proxy({}, {
  get() {
    throw new Error(
      'Direct Typesense client access is disabled for security reasons. ' +
      'Use API endpoints instead: /api/typesense/* or query functions in src/lib/api/'
    );
  }
});

// This export is maintained for backward compatibility but will throw on use
export default typesenseClient;