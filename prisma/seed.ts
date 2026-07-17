import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const supplierCategories = [
  'VENUE', 'PHOTOGRAPHER', 'VIDEOGRAPHER', 'CATERER', 'FLORIST',
  'BAND', 'DJ', 'MAKEUP_ARTIST', 'HAIR_STYLIST', 'WEDDING_PLANNER',
  'STATIONERY', 'TRANSPORT', 'CAKE_DESIGNER', 'OFFICIANT', 'ENTERTAINMENT',
] as const;

const ukLocations = [
  { name: 'London', lat: 51.5074, lng: -0.1278, coverage: ['London', 'South East', 'Greater London'] },
  { name: 'Manchester', lat: 53.4808, lng: -2.2426, coverage: ['Manchester', 'Greater Manchester', 'North West'] },
  { name: 'Birmingham', lat: 52.4862, lng: -1.8904, coverage: ['Birmingham', 'West Midlands', 'Midlands'] },
  { name: 'Edinburgh', lat: 55.9533, lng: -3.1883, coverage: ['Edinburgh', 'Lothian', 'Scotland'] },
  { name: 'Bristol', lat: 51.4545, lng: -2.5879, coverage: ['Bristol', 'South West', 'Gloucestershire'] },
  { name: 'Leeds', lat: 53.8008, lng: -1.5491, coverage: ['Leeds', 'West Yorkshire', 'Yorkshire'] },
  { name: 'Liverpool', lat: 53.4084, lng: -2.9916, coverage: ['Liverpool', 'Merseyside', 'North West'] },
  { name: 'Oxford', lat: 51.7520, lng: -1.2577, coverage: ['Oxford', 'Oxfordshire', 'South East'] },
  { name: 'York', lat: 53.9600, lng: -1.0873, coverage: ['York', 'North Yorkshire', 'Yorkshire'] },
  { name: 'Brighton', lat: 50.8225, lng: -0.1372, coverage: ['Brighton', 'Sussex', 'South East'] },
];

const businessNames: Record<string, string[]> = {
  VENUE: ['The Grand Manor Estate', 'Riverside Barn Venue', 'The Crystal Ballroom', 'Heritage Hall', 'The Garden Pavilion'],
  PHOTOGRAPHER: ['Golden Hour Photography', 'Eternal Moments Co', 'The Wedding Lens', 'Captured Bliss', 'Lumière Studios'],
  VIDEOGRAPHER: ['Cinematic Vows Films', 'Love Story Productions', 'Frame Perfect Weddings', 'Ethereal Films', 'Storybook Cinema'],
  CATERER: ['The Grand Table', 'Artisan Weddings Catering', 'Savoury Celebrations', 'The Gourmet Collective', 'Harvest & Vine'],
  FLORIST: ['Wildflower & Co', 'Bloom Wedding Florals', 'The Petal Studio', 'Garden Gate Florals', 'Rose & Thistle'],
  BAND: ['The Velvet Strings', 'Harmony Wedding Band', 'The Celebration Orchestra', 'Jazz & Soul Collective', 'The Grand Ensemble'],
  DJ: ['DJ Sparkle', 'The Party Starter', 'Melody Mix DJ', 'Groove Wedding DJ', 'Sound Wave Events'],
  MAKEUP_ARTIST: ['Glow Beauty Studio', 'The Bridal Glow', 'Radiant Makeup Co', 'Luxe Beauty Bar', 'Eternal Beauty'],
  HAIR_STYLIST: ['Tresses & Co', 'The Bridal Hair Studio', 'Elegant Locks', 'Crown & Curl', 'The Hair Atelier'],
  WEDDING_PLANNER: ['Dream Day Planners', 'The Perfect Tie', 'Celebrate & Co', 'Vow & Beyond', 'The Planning Collective'],
  STATIONERY: ['Ink & Paper Co', 'The Stationery Studio', 'Elegant Invites', 'Paper & Press', 'The Calligraphy Co'],
  TRANSPORT: ['Classic Car Hire', 'The Vintage Ride', 'Luxury Wedding Cars', 'Heritage Transport', 'Elegance Motors'],
  CAKE_DESIGNER: ['Sweet Celebrations', 'The Cake Atelier', 'Sugar & Spice Designs', 'Whisk & Frost', 'The Pastry Studio'],
};

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@vowvista.co.uk' },
    update: {},
    create: {
      email: 'admin@vowvista.co.uk',
      password: adminPassword,
      name: 'VowVista Admin',
      role: 'ADMIN',
    },
  });

  for (const location of ukLocations) {
    for (const category of supplierCategories) {
      const names = businessNames[category] || ['The Wedding Co'];
      const count = category === 'VENUE' ? 3 : 2;

      for (let i = 0; i < count; i++) {
        const password = await bcrypt.hash('supplier123', 10);
        const email = `${category.toLowerCase()}.${location.name.toLowerCase().replace(/\s/g, '.')}.${i}@example.com`;

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            password,
            name: `${names[i % names.length]} Team`,
            role: 'SUPPLIER',
          },
        });

        const tierRoll = Math.random();
        const tier = tierRoll > 0.7 ? 'PREMIUM' : tierRoll > 0.4 ? 'BASIC' : 'FREE';

        await prisma.supplier.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            businessName: names[i % names.length],
            category: category,
            description: `We are a premier ${category.toLowerCase()} based in ${location.name}, offering exceptional services for your special day. With years of experience and a passion for creating unforgettable moments, we bring creativity and professionalism to every wedding we touch. Our team works closely with each couple to understand their vision and deliver beyond expectations.`,
            location: location.name,
            latitude: location.lat + (Math.random() - 0.5) * 0.1,
            longitude: location.lng + (Math.random() - 0.5) * 0.1,
            coverage: location.coverage,
            website: `https://www.${names[i % names.length].toLowerCase().replace(/\s/g, '')}.co.uk`,
            phone: `+44 ${Math.floor(7000000000 + Math.random() * 9999999999)}`,
            email: `hello@${names[i % names.length].toLowerCase().replace(/\s/g, '')}.co.uk`,
            pricing: ['BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY'][Math.floor(Math.random() * 4)] as any,
            subscriptionTier: tier as any,
            verified: Math.random() > 0.3,
          },
        });
      }
    }
  }

  const couplePassword = await bcrypt.hash('couple123', 10);
  await prisma.user.create({
    data: {
      email: 'demo@couple.com',
      password: couplePassword,
      name: 'Sarah & James',
      role: 'COUPLE',
      weddingDate: new Date('2026-09-12'),
      weddingBudget: 35000,
      location: 'London',
    },
  });

  const checklistItems = [
    { title: 'Book wedding venue', category: 'Venue', dueDate: new Date('2025-12-01') },
    { title: 'Choose wedding date', category: 'Planning', dueDate: new Date('2025-11-01') },
    { title: 'Send save the dates', category: 'Stationery', dueDate: new Date('2026-03-01') },
    { title: 'Book photographer', category: 'Photography', dueDate: new Date('2026-01-01') },
    { title: 'Choose wedding dress', category: 'Attire', dueDate: new Date('2026-02-01') },
    { title: 'Book caterer', category: 'Catering', dueDate: new Date('2026-02-01') },
    { title: 'Book florist', category: 'Decor', dueDate: new Date('2026-03-01') },
    { title: 'Send invitations', category: 'Stationery', dueDate: new Date('2026-04-01') },
    { title: 'Book entertainment', category: 'Entertainment', dueDate: new Date('2026-03-01') },
    { title: 'Final headcount', category: 'Planning', dueDate: new Date('2026-08-01') },
  ];

  const couple = await prisma.user.findFirst({ where: { email: 'demo@couple.com' } });
  if (couple) {
    await prisma.weddingChecklist.createMany({
      data: checklistItems.map(item => ({
        ...item,
        userId: couple.id,
      })),
    });

    await prisma.budget.createMany({
      data: [
        { userId: couple.id, category: 'Venue', allocated: 12000, spent: 0 },
        { userId: couple.id, category: 'Catering', allocated: 8000, spent: 0 },
        { userId: couple.id, category: 'Photography', allocated: 3000, spent: 0 },
        { userId: couple.id, category: 'Florals', allocated: 2500, spent: 0 },
        { userId: couple.id, category: 'Entertainment', allocated: 2000, spent: 0 },
        { userId: couple.id, category: 'Attire', allocated: 3000, spent: 0 },
        { userId: couple.id, category: 'Stationery', allocated: 500, spent: 0 },
        { userId: couple.id, category: 'Miscellaneous', allocated: 4000, spent: 0 },
      ],
    });
  }

  const suppliers = await prisma.supplier.findMany({ take: 20 });
  const couples = await prisma.user.findMany({ where: { role: 'COUPLE' }, take: 5 });

  for (const supplier of suppliers.slice(0, 10)) {
    const reviewer = couples[Math.floor(Math.random() * couples.length)] || couple!;
    if (reviewer) {
      await prisma.review.create({
        data: {
          userId: reviewer.id,
          supplierId: supplier.id,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: 'Absolutely wonderful service! Highly recommend for any wedding.',
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('📧 Demo accounts:');
  console.log('   Admin: admin@vowvista.co.uk / admin123');
  console.log('   Couple: demo@couple.com / couple123');
  console.log('   Suppliers: category.location.0@example.com / supplier123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
