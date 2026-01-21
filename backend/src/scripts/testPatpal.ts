import { paypalService } from "../services/paypal";

async function testPayPal() {
  try {
    const ok = await paypalService.testConnection();
    if (ok) {
      console.log("✅ PayPal LIVE connection OK");
    } else {
      console.log("❌ PayPal connection failed");
    }
  } catch (error) {
    console.error("❌ PayPal connection failed:", error);
  }
}

testPayPal();
