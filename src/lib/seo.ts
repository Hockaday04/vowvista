export const defaultSEO = {
  title: 'VowVista - UK Wedding Suppliers & Venues Directory',
  description: 'Discover and compare top-rated UK wedding suppliers and venues. From photographers to venues, find everything for your perfect day.',
  keywords: 'wedding suppliers, wedding venues UK, wedding photographers, wedding planners, wedding directory',
  ogImage: '/images/og-image.jpg',
};

export function generateSEO(overrides: {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}) {
  return {
    ...defaultSEO,
    ...overrides,
  };
}
