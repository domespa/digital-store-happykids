import { Router } from "express";
import express from "express";
import { PaymentController } from "../controllers/paymentController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

// WEBHOK
router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook
);
router.post("/webhook/paypal", PaymentController.paypalWebhook);

// OPERAZIONI UTENTI
router.post("/capture/:orderId", PaymentController.capturePayPalPayment);
router.get("/capture/:orderId", (req, res) => {
  console.log("🔥 GET /capture called for:", req.params.orderId);
  res.json({
    success: false,
    message: "Use POST method to capture payment",
    orderId: req.params.orderId,
  });
});
router.get(
  "/status/:orderId",
  authenticateToken,
  PaymentController.getPaymentStatus
);

// OPERAZIONI ADMIN
router.post("/refund/:orderId", requireAdmin, PaymentController.refundPayment);

export default router;
