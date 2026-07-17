import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const favourites = await prisma.favourite.findMany({
    where: { userId: session.user.id },
    include: {
      supplier: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ favourites });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { supplierId } = await request.json();

    const favourite = await prisma.favourite.create({
      data: {
        userId: session.user.id,
        supplierId,
      },
      include: {
        supplier: true,
      },
    });

    return NextResponse.json({ favourite }, { status: 201 });
  } catch (error) {
    console.error('Add favourite error:', error);
    return NextResponse.json(
      { error: 'Failed to add favourite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { supplierId } = await request.json();

    await prisma.favourite.deleteMany({
      where: {
        userId: session.user.id,
        supplierId,
      },
    });

    return NextResponse.json({ message: 'Favourite removed' });
  } catch (error) {
    console.error('Remove favourite error:', error);
    return NextResponse.json(
      { error: 'Failed to remove favourite' },
      { status: 500 }
    );
  }
}
