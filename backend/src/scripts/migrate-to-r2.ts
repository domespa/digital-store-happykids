import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateScreenDetox() {
  console.log('🔍 Searching for "THE 30-DAY SCREEN RESET"...');

  const product = await prisma.product.findFirst({
    where: {
      name: {
        contains: "30-DAY SCREEN RESET",
        mode: "insensitive",
      },
    },
  });

  if (!product) {
    console.log("❌ Product not found!");
    await prisma.$disconnect();
    return;
  }

  console.log("📦 Found product:", product.id);
  console.log("   Name:", product.name);
  console.log("   Current filePath:", product.filePath);
  console.log("");

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { filePath: "r2:screen-detox-guide.pdf" },
  });

  console.log("✅ Updated successfully!");
  console.log("   New filePath:", updated.filePath);
  console.log("");
  console.log("📋 BOTH PRODUCTS NOW READY:");
  console.log("   1. THE 30-DAY SCREEN RESET → r2:screen-detox-guide.pdf");
  console.log("   2. 5 Learning Workbooks Bundle → r2:workbooks-bundle.zip");
  console.log("");

  await prisma.$disconnect();
}

updateScreenDetox();
