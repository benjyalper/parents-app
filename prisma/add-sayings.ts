/**
 * Add sayings script — run with:
 * npm run db:add-sayings
 *
 * Clears existing sayings and inserts the full list fresh.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sayings = [
  // ── Classic Jewish / Hebrew proverbs ────────────────────────
  { textHe: 'חנוך לנער על פי דרכו',                                    textEn: 'Train a child according to his own way' },
  { textHe: 'גדול תלמוד שמביא לידי מעשה',                               textEn: 'Great is learning that leads to action' },
  { textHe: 'דרך ארץ קדמה לתורה',                                       textEn: 'Respect and good manners come before knowledge' },
  { textHe: 'איזוהי דרך ישרה? כל שהיא תפארת לעושיה',                   textEn: 'Which is the right path? One that brings honour to its maker' },
  { textHe: 'כל המלמד בן חברו תורה כאילו ילדו',                         textEn: 'One who teaches another\'s child is as if they gave birth to them' },
  { textHe: 'טוב שם טוב משמן טוב',                                      textEn: 'A good name is better than fine oil' },
  { textHe: 'סייג לחכמה שתיקה',                                         textEn: 'The fence of wisdom is silence' },
  { textHe: 'לא הביישן למד',                                             textEn: 'The shy one does not learn' },
  { textHe: 'במקום שאין אנשים השתדל להיות איש',                         textEn: 'Where there are no people, strive to be a person' },
  { textHe: 'אם אין אני לי מי לי',                                       textEn: 'If I am not for myself, who will be for me?' },
  { textHe: 'אם אין קמח אין תורה',                                       textEn: 'Without bread there is no learning' },
  { textHe: 'אם אין תורה אין קמח',                                       textEn: 'Without learning there is no bread' },

  // ── Parenting & boundaries ────────────────────────────────────
  { textHe: 'כל אדם צריך שיראו אותו',                                   textEn: 'Every person needs to be seen' },
  { textHe: 'ילד צריך גבולות כדי להרגיש בטוח',                          textEn: 'A child needs boundaries in order to feel safe' },
  { textHe: 'אהבה בלי גבולות מבלבלת',                                   textEn: 'Love without limits creates confusion' },
  { textHe: 'גבול ברור הוא מתנה לילד',                                  textEn: 'A clear boundary is a gift to a child' },
  { textHe: 'הקשבה היא תחילת החינוך',                                   textEn: 'Listening is the beginning of education' },
  { textHe: 'ילד לומד ממה שהוא רואה, לא ממה שאומרים לו',                textEn: 'A child learns from what they see, not from what they are told' },
  { textHe: 'דוגמה אישית היא החינוך האמיתי',                            textEn: 'Personal example is the true education' },
  { textHe: 'מילים בונות או הורסות',                                    textEn: 'Words either build or destroy' },
  { textHe: 'הורה רגוע מגדל ילד רגוע',                                  textEn: 'A calm parent raises a calm child' },
  { textHe: 'כעס רגעי עלול להשאיר סימן ארוך',                           textEn: 'A moment of anger can leave a lasting mark' },
  { textHe: 'סבלנות היא כוח',                                           textEn: 'Patience is strength' },
  { textHe: 'ילד זקוק לנוכחות יותר ממתנות',                             textEn: 'A child needs presence more than presents' },
  { textHe: 'זמן איכות עדיף מכמות זמן',                                 textEn: 'Quality time is better than quantity of time' },
  { textHe: 'הורה הוא מורה דרך לחיים',                                  textEn: 'A parent is a guide for life' },
  { textHe: 'ילד זוכר איך גרמו לו להרגיש',                              textEn: 'A child remembers how you made them feel' },
  { textHe: 'חינוך מתחיל בבית',                                         textEn: 'Education begins at home' },
  { textHe: 'שיחה טובה פותרת הרבה',                                     textEn: 'A good conversation solves a lot' },
  { textHe: 'הקשבה אמיתית היא אהבה',                                    textEn: 'True listening is love' },
  { textHe: 'כבוד הדדי בונה קשר',                                       textEn: 'Mutual respect builds connection' },
  { textHe: 'אין חינוך בלי גבולות',                                     textEn: 'There is no education without boundaries' },
  { textHe: 'אין גבולות בלי אהבה',                                      textEn: 'There are no boundaries without love' },
  { textHe: 'איזון הוא המפתח',                                          textEn: 'Balance is the key' },
  { textHe: 'ילד צריך גם חופש וגם מסגרת',                               textEn: 'A child needs both freedom and structure' },
  { textHe: 'אמון נבנה לאט ונהרס מהר',                                  textEn: 'Trust is built slowly and broken quickly' },
  { textHe: 'מילה טובה פותחת לב',                                       textEn: 'A kind word opens a heart' },
  { textHe: 'ביקורת בונה צריכה להיות עדינה',                            textEn: 'Constructive criticism must be gentle' },
  { textHe: 'כל ילד הוא עולם ומלואו',                                   textEn: 'Every child is a whole world' },
  { textHe: 'אין שני ילדים זהים',                                       textEn: 'No two children are the same' },
  { textHe: 'חינוך הוא תהליך ארוך',                                     textEn: 'Education is a long process' },
  { textHe: 'טעויות הן חלק מהלמידה',                                    textEn: 'Mistakes are part of learning' },
  { textHe: 'ילד צריך מקום לטעות',                                      textEn: 'A child needs room to make mistakes' },
  { textHe: 'הורה טוב לא מושלם',                                        textEn: 'A good parent is not a perfect parent' },
  { textHe: 'שלמות אינה מטרה',                                          textEn: 'Perfection is not the goal' },
  { textHe: 'חיבור חשוב יותר מהישג',                                    textEn: 'Connection matters more than achievement' },
  { textHe: 'הקשר קודם לכל',                                            textEn: 'The relationship comes first' },
  { textHe: 'הקשבה יוצרת קרבה',                                         textEn: 'Listening creates closeness' },
  { textHe: 'ילד זקוק להרגיש שרואים אותו',                              textEn: 'A child needs to feel seen' },
  { textHe: 'תשומת לב היא מזון לנפש',                                   textEn: 'Attention is food for the soul' },
  { textHe: 'אהבה מתבטאת במעשים קטנים',                                 textEn: 'Love is expressed in small acts' },
  { textHe: 'חיבוק אחד שווה אלף מילים',                                 textEn: 'One hug is worth a thousand words' },
  { textHe: 'נוכחות שקטה מרגיעה',                                       textEn: 'Quiet presence is calming' },
  { textHe: 'ילד זקוק לביטחון',                                         textEn: 'A child needs security' },
  { textHe: 'ביטחון נבנה דרך עקביות',                                   textEn: 'Security is built through consistency' },
  { textHe: 'עקביות יוצרת יציבות',                                      textEn: 'Consistency creates stability' },
  { textHe: 'גבולות ברורים מונעים בלבול',                               textEn: 'Clear limits prevent confusion' },
  { textHe: 'תקשורת פתוחה מחזקת קשר',                                   textEn: 'Open communication strengthens connection' },
  { textHe: 'שתיקה יכולה לפגוע',                                        textEn: 'Silence can hurt' },
  { textHe: 'דיבור מקרב',                                               textEn: 'Speaking brings us closer' },
  { textHe: 'שותפות דורשת הקשבה',                                       textEn: 'Partnership requires listening' },
  { textHe: 'זוגיות טובה מקרינה על הילדים',                             textEn: 'A healthy partnership radiates to the children' },
  { textHe: 'כבוד בין הורים הוא חינוך',                                 textEn: 'Respect between parents is itself education' },
  { textHe: 'מחלוקת אפשרית בלי פגיעה',                                  textEn: 'Disagreement is possible without harm' },
  { textHe: 'ויכוח צריך להיות מכבד',                                    textEn: 'Conflict should be respectful' },
  { textHe: 'הורה לומד כל הזמן',                                        textEn: 'A parent is always learning' },
  { textHe: 'גם הורה צריך תמיכה',                                       textEn: 'Parents need support too' },
  { textHe: 'הורות היא מסע משותף',                                      textEn: 'Parenthood is a shared journey' },
  { textHe: 'אין הורה שיודע הכול',                                      textEn: 'No parent knows everything' },
  { textHe: 'ללמוד יחד זו צמיחה',                                       textEn: 'Learning together is growth' },
  { textHe: 'חינוך הוא השקעה לעתיד',                                    textEn: 'Education is an investment in the future' },
  { textHe: 'ילד הוא אחריות גדולה',                                     textEn: 'A child is a great responsibility' },
  { textHe: 'אהבה אינה מובנת מאליה',                                    textEn: 'Love is not to be taken for granted' },
  { textHe: 'צריך לטפח קשר כל יום',                                     textEn: 'A relationship must be nurtured every day' },
  { textHe: 'תשומת לב יוצרת קרבה',                                      textEn: 'Attention creates closeness' },
  { textHe: 'ילד צריך להרגיש חשוב',                                     textEn: 'A child needs to feel important' },
  { textHe: 'תחושת ערך נבנית בבית',                                     textEn: 'A sense of worth is built at home' },
  { textHe: 'עידוד מחזק ביטחון',                                        textEn: 'Encouragement builds confidence' },
  { textHe: 'ביקורת מחלישה אם אינה עדינה',                              textEn: 'Criticism weakens if it is not gentle' },
  { textHe: 'איזון בין חום לגבול',                                      textEn: 'Balance between warmth and limit' },
  { textHe: 'ילד צריך שיקשיבו לו',                                      textEn: 'A child needs to be listened to' },
  { textHe: 'הורה צריך לדעת לעצור',                                     textEn: 'A parent needs to know how to pause' },
  { textHe: 'רגע של נשימה משנה הכול',                                   textEn: 'A moment to breathe changes everything' },
  { textHe: 'תגובה שקולה עדיפה מתגובה מהירה',                           textEn: 'A considered response is better than a fast one' },
  { textHe: 'הורה רגוע חושב טוב יותר',                                  textEn: 'A calm parent thinks more clearly' },
  { textHe: 'חינוך הוא גם שליטה עצמית',                                 textEn: 'Education is also self-control' },
  { textHe: 'ילד לומד שליטה מהורה',                                     textEn: 'A child learns self-control from a parent' },
  { textHe: 'דוגמה אישית חזקה מכל הסבר',                                textEn: 'Personal example is stronger than any explanation' },
  { textHe: 'אהבה היא בסיס הכול',                                       textEn: 'Love is the foundation of everything' },
  { textHe: 'קשר טוב שורד קושי',                                        textEn: 'A strong connection survives hardship' },
  { textHe: 'חיבור חשוב יותר מציות',                                    textEn: 'Connection matters more than obedience' },
  { textHe: 'ילד צריך להרגיש בטוח להביע',                               textEn: 'A child needs to feel safe to express themselves' },
  { textHe: 'פתיחות יוצרת אמון',                                        textEn: 'Openness creates trust' },
  { textHe: 'אמון הוא בסיס לקשר',                                       textEn: 'Trust is the foundation of connection' },
  { textHe: 'חינוך טוב נמדד לאורך זמן',                                 textEn: 'Good education is measured over time' },
  { textHe: 'הקשבה עמוקה יוצרת שינוי',                                  textEn: 'Deep listening creates change' },
  { textHe: 'הורה שמקשיב – משפיע',                                      textEn: 'A parent who listens — influences' },
  { textHe: 'אהבה וסמכות יכולות ללכת יחד',                              textEn: 'Love and authority can go together' },
  { textHe: 'גבול שנאמר באהבה מתקבל טוב יותר',                          textEn: 'A limit said with love is better received' },
  { textHe: 'חינוך הוא לב פתוח ושכל ישר',                               textEn: 'Education is an open heart and a straight mind' },
];

async function main() {
  console.log(`🌱 Adding ${sayings.length} sayings...`);

  // Clear existing sayings to avoid duplicates
  await prisma.saying.deleteMany({});
  console.log('🗑  Cleared existing sayings');

  for (const s of sayings) {
    await prisma.saying.create({ data: { ...s, active: true } });
  }

  console.log(`✅ Added ${sayings.length} sayings`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
