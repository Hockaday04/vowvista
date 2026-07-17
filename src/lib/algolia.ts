import algoliasearch from 'algoliasearch';

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID!;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY!;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'suppliers';

export const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
export const suppliersIndex = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);

export const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY!;

export async function indexSupplier(supplier: {
  objectID: string;
  businessName: string;
  category: string;
  description: string;
  location: string;
  coverage: string[];
  pricing: string;
  subscriptionTier: string;
  verified: boolean;
  latitude: number;
  longitude: number;
}) {
  return suppliersIndex.saveObject(supplier);
}

export async function removeSupplier(id: string) {
  return suppliersIndex.deleteObject(id);
}

export async function searchSuppliers(query: string, filters?: string) {
  const results = await suppliersIndex.search(query, {
    filters,
    hitsPerPage: 20,
    attributesToHighlight: ['businessName', 'description'],
  });

  return results;
}
