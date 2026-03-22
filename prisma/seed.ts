/**
 * Prisma seed script
 * Run: npm run db:seed
 *
 * Seeds demo participants, sayings, images, and sample entries.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Participants ──────────────────────────────────────────────
  // Change names here, or update via the database later.
  const personA = await prisma.participant.upsert({
    where: { label: 'personA' },
    update: {},
    create: { label: 'personA', name: 'אחד' },
  });

  const personB = await prisma.participant.upsert({
    where: { label: 'personB' },
    update: {},
    create: { label: 'personB', name: 'שתיים' },
  });

  console.log(`✅ Participants: ${personA.name}, ${personB.name}`);

  // ── Sayings ───────────────────────────────────────────────────
  const sayings = [
    {
      textHe: 'ילדים גדלים טוב יותר כשהם יודעים שהוריהם אוהבים זה את זה.',
      textEn: 'Children thrive when they know their parents love each other.',
      author: 'David Jeremiah',
    },
    {
      textHe: 'ההורות היא שותפות — גם לאחר הפרידה.',
      textEn: 'Parenting is a partnership — even after separation.',
      author: null,
    },
    {
      textHe: 'כל שיחה רגועה היא מתנה לילדים שלנו.',
      textEn: 'Every calm conversation is a gift to our children.',
      author: null,
    },
    {
      textHe: 'הכבוד ההדדי הוא הבסיס לכל שיתוף פעולה טוב.',
      textEn: 'Mutual respect is the foundation of every good collaboration.',
      author: null,
    },
    {
      textHe: 'לשמוע לא אומר להסכים — זה אומר לכבד.',
      textEn: 'Listening does not mean agreeing — it means respecting.',
      author: null,
    },
    {
      textHe: 'ילד שרואה הוריו מדברים בשקט — לומד להיות שלם.',
      textEn: 'A child who sees parents speak calmly learns to be whole.',
      author: null,
    },
    {
      textHe: 'השלום הוא בחירה שצריך לחדש בכל יום.',
      textEn: 'Peace is a choice that must be renewed every day.',
      author: null,
    },
  ];

  for (const s of sayings) {
    await prisma.saying.create({ data: s });
  }
  console.log(`✅ Created ${sayings.length} sayings`);

  // ── Daily Images ──────────────────────────────────────────────
  // Using Unsplash placeholder URLs. Replace with cloud storage URLs later.
  // To add more images: insert rows into the DailyImage table.
  const images = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600',
      altTextHe: 'שקיעה שקטה',
      altTextEn: 'Quiet sunset',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600',
      altTextHe: 'יד מושטת',
      altTextEn: 'Reaching hand',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1600',
      altTextHe: 'ילדים משחקים',
      altTextEn: 'Children playing',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600',
      altTextHe: 'טבע שלו',
      altTextEn: 'Calm nature',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1600',
      altTextHe: 'משפחה יחד',
      altTextEn: 'Family together',
    },
  ];

  for (const img of images) {
    await prisma.dailyImage.create({ data: img });
  }
  console.log(`✅ Created ${images.length} daily images`);

  // ── Sample Hurt Entries ───────────────────────────────────────
  const hurtEntries = [
    {
      text: 'דיברת עלי בלי לתת לי להסביר את עצמי.',
      writerId: personA.id,
      targetId: personB.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      text: 'התייחסת אליי בחוסר כבוד בפני הילדים.',
      writerId: personB.id,
      targetId: personA.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      text: 'שינית תוכניות ברגע האחרון בלי להתייעץ.',
      writerId: personA.id,
      targetId: personB.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  ];

  for (const entry of hurtEntries) {
    await prisma.hurtEntry.create({ data: entry });
  }
  console.log(`✅ Created ${hurtEntries.length} hurt entries`);

  // ── Sample Boundary Messages ──────────────────────────────────
  const boundaryMessages = [
    {
      text: 'המסר הזה הועבר לילדים ללא הסכמתי.',
      writerId: personA.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      text: 'ביקרת אותי בפני הילדים — זה לא מקובל עלי.',
      writerId: personB.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  ];

  for (const msg of boundaryMessages) {
    await prisma.boundaryMessage.create({ data: msg });
  }
  console.log(`✅ Created ${boundaryMessages.length} boundary messages`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
