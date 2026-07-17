export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceRange(range: string): string {
  const ranges: Record<string, string> = {
    BUDGET: '£500 - £2,000',
    MID_RANGE: '£2,000 - £5,000',
    PREMIUM: '£5,000 - £10,000',
    LUXURY: '£10,000+',
  };
  return ranges[range] || range;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB').format(num);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).endsWith(' ') ? text.slice(0, length) : text.slice(0, text.lastIndexOf(' ', length)) + '...';
}

export function generateStarRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '½';
  stars += '☆'.repeat(5 - Math.ceil(rating));
  return stars;
}

export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    VENUE: 'Venue',
    PHOTOGRAPHER: 'Photographer',
    VIDEOGRAPHER: 'Videographer',
    CATERER: 'Caterer',
    FLORIST: 'Florist',
    BAND: 'Band',
    DJ: 'DJ',
    MAKEUP_ARTIST: 'Makeup Artist',
    HAIR_STYLIST: 'Hair Stylist',
    WEDDING_PLANNER: 'Wedding Planner',
    STATIONERY: 'Stationery',
    TRANSPORT: 'Transport',
    CAKE_DESIGNER: 'Cake Designer',
    OFFICIANT: 'Officiant',
    ENTERTAINMENT: 'Entertainment',
    OTHER: 'Other',
  };
  return names[category] || category;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    VENUE: '🏛️',
    PHOTOGRAPHER: '📸',
    VIDEOGRAPHER: '🎥',
    CATERER: '🍽️',
    FLORIST: '💐',
    BAND: '🎵',
    DJ: '🎧',
    MAKEUP_ARTIST: '💄',
    HAIR_STYLIST: '💇',
    WEDDING_PLANNER: '📋',
    STATIONERY: '✉️',
    TRANSPORT: '🚗',
    CAKE_DESIGNER: '🎂',
    OFFICIANT: '⛪',
    ENTERTAINMENT: '🎪',
    OTHER: '✨',
  };
  return icons[category] || '✨';
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
