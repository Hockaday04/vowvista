import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const priceRange = searchParams.get('priceRange');

  const where: any = {};

  if (query) {
    where.OR = [
      { businessName: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
      { coverage: { has: query } },
    ];
  }

  if (category) where.category = category;
  if (location) {
    where.OR = [
      { location: { contains: location, mode: 'insensitive' } },
      { coverage: { has: location } },
    ];
  }
  if (priceRange) where.pricing = priceRange;

  const suppliers = await prisma.supplier.findMany({
    where,
    take: 20,
    orderBy: [{ subscriptionTier: 'desc' }, { verified: 'desc' }],
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
  });

  const suggestions = query
    ? await prisma.supplier.findMany({
        where: {
          OR: [
            { businessName: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { businessName: true, location: true, category: true },
        take: 5,
      })
    : [];

  return NextResponse.json({
    results: suppliers,
    suggestions,
  });
}
