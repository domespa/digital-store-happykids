import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testPrisma() {
  console.log("🧪 Testing Prisma Client...\n");

  try {
    // Test 1: Fetch prodotti
    const products = await prisma.product.findMany({
      take: 2,
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        compareAtPrice: true,
      },
    });

    console.log("✅ Prisma Client funziona!");
    console.log("📦 Prodotti:", JSON.stringify(products, null, 2));
  } catch (error: any) {
    console.error("❌ Errore:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
