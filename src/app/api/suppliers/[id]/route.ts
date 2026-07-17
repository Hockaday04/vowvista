import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        reviews: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        user: {
          select: { name: true, email: true, role: true },
        },
        _count: {
          select: { reviews: true, images: true },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    const avgRating =
      supplier.reviews.length > 0
        ? supplier.reviews.reduce((a, b) => a + b.rating, 0) / supplier.reviews.length
        : 0;

    return NextResponse.json({
      ...supplier,
      averageRating: Math.round(avgRating * 10) / 10,
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supplier' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
  });

  if (!supplier || supplier.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();

    const updated = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        businessName: body.businessName,
        description: body.description,
        location: body.location,
        coverage: body.coverage,
        website: body.website,
        phone: body.phone,
        pricing: body.pricing,
      },
    });

    return NextResponse.json({ supplier: updated });
  } catch (error) {
    console.error('Update supplier error:', error);
    return NextResponse.json(
      { error: 'Failed to update supplier' },
      { status: 500 }
    );
  }
}
