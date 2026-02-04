import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addWorkbooksBundle() {
  console.log("📚 Creating Workbooks Bundle...");

  const product = await prisma.product.create({
    data: {
      name: "5 Learning Workbooks Bundle",
      slug: "5-learning-workbooks-bundle",
      description:
        "Complete educational bundle with 5 premium workbooks (295 pages total). Perfect for ages 3-5: Colors, Letters & Numbers, Writing, Animals & Dinosaurs, and Shapes. Save 40% compared to buying individually!",
      price: 15.0,
      isDigital: true,
      fileName: "workbooks-bundle.zip",
      filePath: "",
      stock: 9999,
    },
  });

  console.log("✅ Workbooks Bundle created!");
  console.log("   ID:", product.id);
  console.log("   Name:", product.name);
  console.log("   File:", product.filePath);
  console.log("");
  console.log("💡 IMPORTANT: Save this ID for CartSlideBar.tsx:");
  console.log(`   WORKBOOKS_BUNDLE_ID = "${product.id}"`);

  await prisma.$disconnect();
}

addWorkbooksBundle();
