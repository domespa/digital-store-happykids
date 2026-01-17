import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkCount() {
  const orderId = process.argv[2];

  if (!orderId) {
    console.log("Usage: npx tsx src/scripts/check-download-count.ts ORDER_ID");
    await prisma.$disconnect();
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      downloadCount: true,
      downloadLimit: true,
      status: true,
      paymentStatus: true,
    },
  });

  if (!order) {
    console.log("❌ Order not found");
    await prisma.$disconnect();
    return;
  }

  console.log("📦 Order Download Status:");
  console.log(
    "   Downloads used:",
    order.downloadCount,
    "/",
    order.downloadLimit
  );
  console.log("   Remaining:", order.downloadLimit! - order.downloadCount!);
  console.log("   Status:", order.status);
  console.log("   Payment:", order.paymentStatus);

  await prisma.$disconnect();
}

checkCount();
