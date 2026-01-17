import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestOrderWithBothProducts() {
  console.log("🧪 Creating test order with BOTH products...");
  console.log("");

  try {
    // 1. Trova Screen Detox
    const screenDetox = await prisma.product.findFirst({
      where: {
        name: { contains: "30-DAY", mode: "insensitive" },
      },
    });

    if (!screenDetox) {
      console.log("❌ Screen Detox product not found");
      await prisma.$disconnect();
      return;
    }

    console.log("✅ Found Screen Detox:", screenDetox.id);
    console.log("   Name:", screenDetox.name);
    console.log("   FilePath:", screenDetox.filePath);
    console.log("");

    // 2. Trova Workbooks
    const workbooks = await prisma.product.findFirst({
      where: { id: "cmkfg5osj0005mlb9u0blcig9" },
    });

    if (!workbooks) {
      console.log("❌ Workbooks product not found");
      await prisma.$disconnect();
      return;
    }

    console.log("✅ Found Workbooks:", workbooks.id);
    console.log("   Name:", workbooks.name);
    console.log("   FilePath:", workbooks.filePath);
    console.log("");

    // 3. Crea ordine con ENTRAMBI i prodotti
    const order = await prisma.order.create({
      data: {
        customerEmail: "test-both@example.com",
        customerFirstName: "Test",
        customerLastName: "BothProducts",
        total: Number(screenDetox.price) + Number(workbooks.price),
        status: "COMPLETED",
        paymentStatus: "SUCCEEDED",
        orderItems: {
          create: [
            {
              productId: screenDetox.id,
              quantity: 1,
              price: screenDetox.price,
            },
            {
              productId: workbooks.id,
              quantity: 1,
              price: workbooks.price,
            },
          ],
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

    console.log("✅ Test order created successfully!");
    console.log("   Order ID:", order.id);
    console.log("   Email:", order.customerEmail);
    console.log("   Total: €" + order.total);
    console.log("   Products:", order.orderItems.length);
    console.log("");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔗 TEST DOWNLOAD LINKS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    order.orderItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.product!.name}:`);
      console.log(
        `   http://localhost:5000/api/orders/download/${order.id}?productId=${
          item.product!.id
        }`
      );
      console.log("");
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 INSTRUCTIONS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("1. Make sure backend is running (npm run dev)");
    console.log("2. Copy each URL above");
    console.log("3. Open in browser - should download different files!");
    console.log("4. Check backend logs for tracking");
    console.log("5. Try both links multiple times");
    console.log("");
    console.log("✅ Each link downloads a DIFFERENT product");
    console.log("⚠️  Shared download counter: 4 downloads total for the order");
    console.log("");
  } catch (error) {
    console.error("❌ Error creating test order:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrderWithBothProducts();
