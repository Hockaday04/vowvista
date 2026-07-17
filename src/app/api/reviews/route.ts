import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
  supplierId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        supplierId: validated.supplierId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this supplier' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        supplierId: validated.supplierId,
        rating: validated.rating,
        comment: validated.comment,
      },
      include: {
        user: { select: { name: true, avatar: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get('supplierId');

  if (!supplierId) {
    return NextResponse.json(
      { error: 'supplierId is required' },
      { status: 400 }
    );
  }

  const reviews = await prisma.review.findMany({
    where: { supplierId },
    include: {
      user: { select: { name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    reviews,
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length,
  });
}
