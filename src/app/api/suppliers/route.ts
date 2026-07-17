import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const page = parseInt(searchParams.get('page') || '1');
  const take = parseInt(searchParams.get('take') || '12');
  const skip = (page - 1) * take;

  const where: any = {};
  if (category) where.category = category;
  if (location) {
    where.OR = [
      { location: { contains: location, mode: 'insensitive' } },
      { coverage: { has: location } },
    ];
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      take,
      skip,
      orderBy: [{ subscriptionTier: 'desc' }, { createdAt: 'desc' }],
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { select: { rating: true } },
        user: { select: { name: true } },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  return NextResponse.json({
    suppliers,
    pagination: {
      page,
      take,
      total,
      totalPages: Math.ceil(total / take),
    },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'SUPPLIER') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const supplier = await prisma.supplier.create({
      data: {
        userId: session.user.id,
        businessName: body.businessName,
        category: body.category,
        description: body.description,
        location: body.location,
        latitude: body.latitude,
        longitude: body.longitude,
        coverage: body.coverage || [],
        website: body.website,
        phone: body.phone,
        email: body.email,
        pricing: body.pricing,
      },
    });

    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    console.error('Create supplier error:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier profile' },
      { status: 500 }
    );
  }
}
