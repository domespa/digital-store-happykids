import { Router } from "express";
import { createOrder, getOrderById } from "../controllers/orderController";
import { optionalAuth } from "../middleware/auth";
import { r2Service } from "../services/r2Service";
import { prisma } from "../utils/prisma";

const router = Router();

router.get("/download/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId } = req.query;

    console.log("📥 Download request for order:", orderId);
    if (productId) {
      console.log("📦 Specific product requested:", productId);
    }

    // 1. Trova ordine
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
        message: "This download link is invalid.",
      });
    }

    // 2. Verifica status ordine
    if (order.status !== "COMPLETED" && order.status !== "PAID") {
      return res.status(403).json({
        success: false,
        error: "Order not completed",
        message:
          "This order has not been completed yet. Please complete payment first.",
      });
    }

    if (order.paymentStatus !== "SUCCEEDED") {
      return res.status(403).json({
        success: false,
        error: "Payment not completed",
        message: "Payment for this order has not been completed.",
      });
    }

    // 3. Calcola scadenza (30 giorni dalla creazione)
    const expirationDate = new Date(order.createdAt);
    expirationDate.setDate(expirationDate.getDate() + 30);

    const now = new Date();
    const isExpired = now > expirationDate;

    if (isExpired) {
      const daysAgo = Math.floor(
        (now.getTime() - expirationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return res.status(410).json({
        success: false,
        error: "Download link expired",
        message: `This download link expired ${daysAgo} days ago (after 30 days from purchase).`,
        expiredOn: expirationDate.toISOString(),
        orderDate: order.createdAt.toISOString(),
      });
    }

    // 4. Verifica limite download (4 volte)
    const downloadLimit = order.downloadLimit || 4;
    const downloadCount = order.downloadCount || 0;

    if (downloadCount >= downloadLimit) {
      return res.status(403).json({
        success: false,
        error: "Download limit reached",
        message: `You have reached the maximum download limit (${downloadLimit} downloads). Please contact support if you need assistance.`,
        downloadCount: downloadCount,
        downloadLimit: downloadLimit,
      });
    }

    // 5. Trova il file da scaricare
    let productWithFile;

    if (productId) {
      productWithFile = order.orderItems.find(
        (item) => item.product?.id === productId && item.product?.filePath
      );

      if (!productWithFile) {
        return res.status(404).json({
          success: false,
          error: "Product not found in order",
          message: "The requested product is not part of this order.",
        });
      }
    } else {
      productWithFile = order.orderItems.find((item) => item.product?.filePath);
    }

    if (!productWithFile || !productWithFile.product?.filePath) {
      return res.status(404).json({
        success: false,
        error: "No downloadable file",
        message: "This order does not contain any downloadable files.",
      });
    }

    // 6. Incrementa contatore download
    await prisma.order.update({
      where: { id: orderId },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    const newDownloadCount = downloadCount + 1;
    const remainingDownloads = downloadLimit - newDownloadCount;

    console.log(
      `✅ Download authorized: ${newDownloadCount}/${downloadLimit} for order ${orderId}`
    );

    // 7. Genera URL download tramite R2Service
    const downloadUrl = await r2Service.generateDownload(
      productWithFile.product.filePath
    );

    // 8. Log per tracking
    console.log({
      orderId: order.id,
      productId: productWithFile.product.id,
      productName: productWithFile.product.name,
      downloadCount: newDownloadCount,
      remainingDownloads: remainingDownloads,
      expiresOn: expirationDate.toISOString(),
      customerEmail: order.customerEmail,
      fileSource: productWithFile.product.filePath.split(":")[0],
    });

    // 9. Redirect al file
    res.redirect(downloadUrl);
  } catch (error: any) {
    console.error("❌ Download error:", error);
    res.status(500).json({
      success: false,
      error: "Download failed",
      message:
        "An error occurred while processing your download. Please try again later.",
    });
  }
});

router.get("/test-production-analysis", async (req, res) => {
  try {
    const productsWithFiles = await prisma.product.findMany({
      where: {
        filePath: { not: null },
        isDigital: true,
      },
      select: {
        id: true,
        name: true,
        fileName: true,
        filePath: true,
      },
    });

    const analysis = productsWithFiles.map((product) => {
      const url = product.filePath || "";
      const isCloudinaryUrl = url.includes("res.cloudinary.com");
      const isAuthenticated =
        url.includes("/upload/") && !url.includes("/public/");
      const hasAttachment = url.includes("fl_attachment");

      return {
        productId: product.id,
        productName: product.name,
        fileName: product.fileName,
        currentUrl: product.filePath,
        status: {
          isCloudinaryUrl,
          accessMode: isAuthenticated ? "authenticated" : "public",
          hasAttachmentTransform: hasAttachment,
          needsMigration: isAuthenticated,
        },
      };
    });

    const needsMigration = analysis.filter((p) => p.status.needsMigration);

    res.json({
      success: true,
      totalProducts: productsWithFiles.length,
      needsMigration: needsMigration.length,
      products: analysis,
      recommendation:
        needsMigration.length > 0
          ? "⚠️ Some products need migration from authenticated to public access"
          : "✅ All products are correctly configured",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/test-existing-orders", async (req, res) => {
  try {
    const recentOrders = await prisma.order.findMany({
      where: {
        status: "COMPLETED",
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
                fileName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const ordersWithFiles = recentOrders
      .map((order) => ({
        orderId: order.id,
        orderDate: order.createdAt,
        items: order.orderItems
          .filter((item) => item.product?.filePath)
          .map((item) => ({
            productName: item.product!.name,
            currentDownloadUrl: item.product!.filePath,
            isWorking: item.product!.filePath?.includes("res.cloudinary.com"),
          })),
      }))
      .filter((order) => order.items.length > 0);

    res.json({
      success: true,
      totalOrdersWithDigitalProducts: ordersWithFiles.length,
      orders: ordersWithFiles,
      warning:
        "⚠️ These users have purchased digital products. Test their download URLs before migration!",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// CREA ORDINE DAL CARRELLO
// POST /api/orders
router.post("/", optionalAuth, createOrder);

// DETTAGLIO ORDINE
// GET /api/orders/:id
router.get("/:id", optionalAuth, getOrderById);

export default router;
