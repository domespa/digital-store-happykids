import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

// GET /api/public/location
router.get("/location", async (req, res) => {
  try {
    let ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      (req.socket.remoteAddress as string);
    if (
      !ip ||
      ip === "::1" ||
      ip === "127.0.0.1" ||
      ip?.startsWith("::ffff:127") ||
      ip?.startsWith("10.") ||
      ip?.startsWith("172.") ||
      ip?.startsWith("192.168")
    ) {
      console.log(`⚠️ Private IP detected: ${ip}, fetching real IP...`);

      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = (await ipResponse.json()) as any;
        ip = ipData.ip;
        console.log(`✅ Real IP from ipify: ${ip}`);
      } catch (err) {
        console.error("❌ ipify failed, using 1.1.1.1 fallback");
        ip = "1.1.1.1";
      }
    }

    console.log(`🌍 Fetching location for IP: ${ip}`);

    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) {
      throw new Error(`IP API failed: ${response.status}`);
    }

    const data = (await response.json()) as any;

    let currency = "EUR";
    if (data.countryCode === "US") currency = "USD";
    else if (data.countryCode === "GB") currency = "GBP";
    else if (data.countryCode === "CA") currency = "CAD";
    else if (data.countryCode === "AU") currency = "AUD";

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
