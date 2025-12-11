import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articleId = 'M1732614119A706'; // Result of stripping dots from M.1732614119.A.706
  
  try {
    const result = await prisma.proofreading.upsert({
      where: { articleId },
      update: {
          articleTitle: '[TEST] Duplicate Check Existing',
      },
      create: {
        articleId,
        articleTitle: '[TEST] Duplicate Check Existing',
        englishSource: 'This is a test source for duplicate check.',
        googleTranslation: 'This is a test translation for duplicate check.',
        opTranslation: 'This is the OPs original translation.',
        proofreadResult: JSON.stringify([
            {
                originalSnippet: 'test',
                translatedSnippet: 'test',
                issueType: 'Test',
                explanation: 'Test explanation'
            }
        ]),
      }
    });
    console.log('Seeded article:', result.articleId);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
