import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addScreenDetox() {
  console.log("📱 Creating Screen Detox product...");

  const product = await prisma.product.create({
    data: {
      name: "THE 30-DAY SCREEN RESET",
      slug: "screen-detox-30-day-reset",
      description:
        "Transform your relationship with technology in just 30 days. A comprehensive guide with daily challenges, practical exercises, and actionable strategies to reduce screen time and reclaim your focus, productivity, and well-being.",
      price: 25.0,
      isDigital: true,
      fileName: "screen-detox-guide.pdf",
      filePath:
        "https://pub-cc8c8053c68c4d28bf339e7b1bdd6e76.r2.dev/screen-detox-guide.pdf",
      stock: 9999,
    },
  });

  console.log("✅ Screen Detox created!");
  console.log("   ID:", product.id);
  console.log("   Name:", product.name);
  console.log("   File:", product.filePath);

  await prisma.$disconnect();
}

addScreenDetox();
