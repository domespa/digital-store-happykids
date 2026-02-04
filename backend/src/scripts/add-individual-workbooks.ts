import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addIndividualWorkbooks() {
  console.log("📚 Adding individual workbooks to database...");
  console.log("");

  const workbooks = [
    {
      name: "A Rainbow of Colors",
      slug: "rainbow-of-colors-workbook",
      description:
        "Explore colors through fun activities and creative exercises. Perfect for young learners ages 3-5 to discover the vibrant world of colors! (47 pages)",
      price: 5.0,
      pages: 47,
      ageRange: "3-5 years",
      fileName: "workbook-1-rainbow-colors.zip",
      filePath: "",
    },
    {
      name: "Letters and Numbers in Play",
      slug: "letters-numbers-workbook",
      description:
        "Learn letters A-Z and numbers 1-20 through engaging play-based activities. Trace, count, and discover! (60 pages)",
      price: 5.0,
      pages: 60,
      ageRange: "3-5 years",
      fileName: "workbook-2-letters-numbers.zip",
      filePath: "",
    },
    {
      name: "My First Writing Adventure",
      slug: "writing-adventure-workbook",
      description:
        "Build early writing skills through tracing letters and simple words. A fun journey into the world of writing! (59 pages)",
      price: 5.0,
      pages: 59,
      ageRange: "3-5 years",
      fileName: "workbook-3-writing-adventure.zip",
      filePath: "",
    },
    {
      name: "The Big Book of Animals and Dinosaurs",
      slug: "animals-dinosaurs-workbook",
      description:
        "Discover, learn, and have fun with animals and dinosaurs! Activities, coloring, and fascinating facts. (64 pages)",
      price: 5.0,
      pages: 64,
      ageRange: "3-5 years",
      fileName: "workbook-4-animals-dinosaurs.zip",
      filePath: "",
    },
    {
      name: "World of Shapes",
      slug: "shapes-workbook",
      description:
        "Explore geometric shapes through hands-on activities. Learn to recognize, trace, and create shapes! (65 pages)",
      price: 5.0,
      pages: 65,
      ageRange: "3-5 years",
      fileName: "workbook-5-shapes.zip",
      filePath: "",
    },
  ];

  const createdProducts = [];

  for (let i = 0; i < workbooks.length; i++) {
    const book = workbooks[i];

    console.log(`${i + 1}. Creating: ${book.name}...`);

    const product = await prisma.product.create({
      data: {
        name: book.name,
        slug: book.slug,
        description: book.description,
        price: book.price,
        isDigital: true,
        fileName: book.fileName,
        filePath: book.filePath,
        stock: 9999,
      },
    });

    createdProducts.push({
      id: product.id,
      name: product.name,
      filePath: product.filePath,
    });

    console.log("   ✅ Created! ID:", product.id);
    console.log("");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ ALL WORKBOOKS CREATED!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("📋 Product IDs (save these!):");
  console.log("");

  createdProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   File: ${product.filePath}`);
    console.log("");
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 NEXT STEPS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("1. Upload 5 ZIP files to Cloudflare R2:");
  console.log("   - workbook-1-rainbow-colors.zip");
  console.log("   - workbook-2-letters-numbers.zip");
  console.log("   - workbook-3-writing-adventure.zip");
  console.log("   - workbook-4-animals-dinosaurs.zip");
  console.log("   - workbook-5-shapes.zip");
  console.log("");
  console.log("2. Bucket: h4ppykids-products");
  console.log("");
  console.log("3. Test downloads for each product");
  console.log("");

  await prisma.$disconnect();
}

addIndividualWorkbooks();
