import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testFullFlow() {
  console.log("🧪 Testing Complete Download Flow...");
  console.log("");

  // Trova ordine completato
  const order = await prisma.order.findFirst({
    where: {
      status: { in: ["COMPLETED", "PAID"] },
      paymentStatus: "SUCCEEDED",
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              filePath: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!order) {
    console.log("❌ No completed orders found.");
    console.log("");
    console.log("💡 Creating test order...");

    // Trova prodotto Screen Detox
    const product = await prisma.product.findFirst({
      where: {
        name: { contains: "30-DAY", mode: "insensitive" },
      },
    });

    if (!product) {
      console.log("❌ Product not found!");
      await prisma.$disconnect();
      return;
    }

    // Crea ordine di test
    const testOrder = await prisma.order.create({
      data: {
        customerEmail: "test@example.com",
        customerFirstName: "Test",
        customerLastName: "User",
        total: product.price,
        status: "COMPLETED",
        paymentStatus: "SUCCEEDED",
        orderItems: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price,
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                filePath: true,
              },
            },
          },
        },
      },
    });

    console.log("✅ Test order created!");
    console.log("   Order ID:", testOrder.id);
    console.log("");

    displayTestInstructions(testOrder);
  } else {
    console.log("✅ Found existing order:", order.id);
    console.log("   Email:", order.customerEmail);
    console.log("   Status:", order.status);
    console.log("   Payment:", order.paymentStatus);
    console.log(
      "   Download count:",
      order.downloadCount,
      "/",
      order.downloadLimit
    );

    const productWithFile = order.orderItems.find(
      (item) => item.product?.filePath
    );
    if (productWithFile) {
      console.log("   Product:", productWithFile.product!.name);
      console.log("   FilePath:", productWithFile.product!.filePath);
    }
    console.log("");

    displayTestInstructions(order);
  }

  await prisma.$disconnect();
}

function displayTestInstructions(order: any) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔗 TEST DOWNLOAD ENDPOINT:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("   http://localhost:3000/api/orders/download/" + order.id);
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 INSTRUCTIONS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("1. Copy the URL above");
  console.log("2. Open in browser (Chrome/Firefox/Safari)");
  console.log("3. Download should start immediately");
  console.log("4. Check Terminal 1 (backend) for logs");
  console.log("5. Try clicking again - downloadCount should increment");
  console.log("");
  console.log("✅ Expected: PDF/ZIP downloads");
  console.log("❌ If error: Check Terminal 1 for details");
  console.log("");
}

testFullFlow();
