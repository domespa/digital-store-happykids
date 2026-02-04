import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestOrder() {
  console.log("🧪 Creating test order...");
  console.log("");

  // Trova Screen Detox
  const screenDetox = await prisma.product.findFirst({
    where: { name: { contains: "30-DAY", mode: "insensitive" } },
  });

  if (!screenDetox) {
    console.log("❌ Screen Detox not found!");
    await prisma.$disconnect();
    return;
  }

  console.log("✅ Found Screen Detox:", screenDetox.id);

  // Crea ordine
  const order = await prisma.order.create({
    data: {
      customerEmail: "test@example.com",
      customerFirstName: "Test",
      customerLastName: "User",
      total: screenDetox.price,
      status: "COMPLETED",
      paymentStatus: "SUCCEEDED",
      downloadCount: 0,
      downloadLimit: 4,
      orderItems: {
        create: {
          productId: screenDetox.id,
          quantity: 1,
          price: screenDetox.price,
        },
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  console.log("✅ Test order created!");
  console.log("   Order ID:", order.id);
  console.log("   Email:", order.customerEmail);
  console.log("   Total: €" + order.total);
  console.log("   Downloads:", order.downloadCount + "/" + order.downloadLimit);
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔗 TEST DOWNLOAD LINK:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log(`http://localhost:5000/api/orders/download/${order.id}`);
  console.log("");
  console.log("📋 INSTRUCTIONS:");
  console.log("1. Start backend: npm run dev");
  console.log("2. Copy URL above");
  console.log("3. Open in browser");
  console.log("4. Should download PDF!");
  console.log("");

  await prisma.$disconnect();
}

createTestOrder();
