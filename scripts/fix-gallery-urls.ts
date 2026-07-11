import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing galleryUrls data...');
  
  // Update all products with invalid galleryUrls
  const result = await prisma.$executeRaw`
    UPDATE "ShopProduct" 
    SET "galleryUrls" = NULL 
    WHERE "galleryUrls" IS NOT NULL
  `;
  
  console.log(`Updated ${result} products`);
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
