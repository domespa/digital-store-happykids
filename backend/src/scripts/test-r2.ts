import "dotenv/config";
import { r2Service } from "../services/r2Service";

async function testR2() {
  console.log("🧪 Testing R2 Service...");
  console.log("");

  try {
    // Test 1: Genera URL per Screen Detox
    console.log("1️⃣ Testing Screen Detox download URL...");
    const screenDetoxUrl = await r2Service.generateDownload(
      "r2:screen-detox-guide.pdf"
    );
    console.log("   ✅ URL generated!");
    console.log("");

    // Test 2: Genera URL per Workbooks
    console.log("2️⃣ Testing Workbooks download URL...");
    const workbooksUrl = await r2Service.generateDownload(
      "r2:workbooks-bundle.zip"
    );
    console.log("   ✅ URL generated!");
    console.log("");

    console.log("✅ ALL TESTS PASSED!");
    console.log("");
    console.log("🔗 Test these URLs in browser (valid for 5 minutes):");
    console.log("");
    console.log("Screen Detox:");
    console.log(screenDetoxUrl);
    console.log("");
    console.log("Workbooks:");
    console.log(workbooksUrl);
    console.log("");
    console.log("⚠️ Copy and paste URLs in browser to test download!");
  } catch (error: any) {
    console.error("");
    console.error("❌ TEST FAILED:", error.message);
    console.error("");
    if (error.message.includes("credentials")) {
      console.error("💡 Check your .env file:");
      console.error("   R2_ACCESS_KEY_ID");
      console.error("   R2_SECRET_ACCESS_KEY");
    } else if (error.message.includes("NoSuchKey")) {
      console.error("💡 File not found in R2. Check file names:");
      console.error("   - screen-detox-guide.pdf");
      console.error("   - workbooks-bundle.zip");
    }
    console.error("");
    console.error("Full error:", error);
  }
}

testR2();
