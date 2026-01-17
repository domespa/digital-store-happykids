import "dotenv/config";
import { r2Service } from "../services/r2Service";

async function testIndividualWorkbooks() {
  console.log("🧪 Testing individual workbooks downloads...");
  console.log("");

  const workbooks = [
    { name: "A Rainbow of Colors", file: "workbook-1-rainbow-colors.zip" },
    { name: "Letters and Numbers", file: "workbook-2-letters-numbers.zip" },
    { name: "Writing Adventure", file: "workbook-3-writing-adventure.zip" },
    { name: "Animals & Dinosaurs", file: "workbook-4-animals-dinosaurs.zip" },
    { name: "World of Shapes", file: "workbook-5-shapes.zip" },
  ];

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔗 DOWNLOAD URLs (valid 5 minutes):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");

  for (const book of workbooks) {
    try {
      console.log(`📚 ${book.name}:`);
      const url = await r2Service.generateDownload(`r2:${book.file}`);
      console.log(`   ${url}`);
      console.log("");
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`);
      console.log("");
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 TEST INSTRUCTIONS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("1. Copy each URL");
  console.log("2. Open in browser (within 5 minutes)");
  console.log("3. Should download ZIP file");
  console.log("4. Extract and verify PDF inside");
  console.log("");
  console.log("✅ If all download → R2 setup complete!");
  console.log("❌ If error → Check file names in R2");
  console.log("");
}

testIndividualWorkbooks();
