import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

// GET /api/public/location
router.get("/location", async (req, res) => {
  try {
    let ip = (req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress) as string;

    if (ip === "::1" || ip === "127.0.0.1" || ip?.startsWith("::ffff:127")) {
      console.log("⚠️ Localhost detected, trying to get real public IP...");

      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = (await ipResponse.json()) as any;
        ip = ipData.ip;
        console.log(`✅ Real public IP: ${ip}`);
      } catch (err) {
        console.log("❌ Could not get public IP, using localhost fallback");
        ip = "8.8.8.8";
      }
    }

    console.log(`🌍 Fetching location for IP: ${ip}`);

    const response = await fetch(`http://ip-api.com/json/${ip}`);

    if (!response.ok) {
      throw new Error(`IP API failed with status ${response.status}`);
    }

    const data = (await response.json()) as any;

    // Mappa valuta in base al paese
    let currency = "EUR";
    if (data.countryCode === "US") currency = "USD";
    else if (data.countryCode === "GB") currency = "GBP";
    else if (data.countryCode === "CA") currency = "CAD";
    else if (data.countryCode === "AU") currency = "AUD";
    else if (data.countryCode === "JP") currency = "JPY";

    const location = {
      country: data.country || "Unknown",
      city: data.city || "Unknown",
      region: data.regionName || "",
      countryCode: data.countryCode || "",
      timezone: data.timezone || "",
      currency,
      ip: data.query || "",
    };

    console.log(
      `✅ Location: ${location.city}, ${location.country} (${location.currency})`,
    );

    res.json(location);
  } catch (error) {
    console.error("❌ Location API error:", error);
    res.json({
      country: "Unknown",
      city: "Unknown",
      region: "",
      countryCode: "",
      timezone: "",
      currency: "EUR",
    });
  }
});

export default router;
