import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

async function testStripe() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    const balance = await stripe.balance.retrieve();
    console.log("✅ Stripe LIVE connection OK:", balance);
  } catch (error) {
    console.error("❌ Stripe connection failed:", error);
  }
}

testStripe();
