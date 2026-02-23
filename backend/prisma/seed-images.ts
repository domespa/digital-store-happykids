import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProductImages() {
  console.log("🖼️ Starting images seed...");

  const imagesToAdd = [
    {
      productId: "cml874iv70000j5ma3lmjfjzq", // A Rainbow of Colors
      url: "/cover-ebook/ranibowofcolors.jpg",
      altText: "A Rainbow of Colors workbook cover",
      isMain: true,
      sortOrder: 0,
    },
    {
      productId: "cml874jfl0001j5ma9jkc2hl7", // Letters and Numbers
      url: "/cover-ebook/lettersnumbersinplay.jpg",
      altText: "Letters and Numbers in Play workbook cover",
      isMain: true,
      sortOrder: 0,
    },
    {
      productId: "cml874jyu0002j5mapb5yr6zg", // My First Writing
      url: "/cover-ebook/myfirstadventure.jpg",
      altText: "My First Writing Adventure workbook cover",
      isMain: true,
      sortOrder: 0,
    },
    {
      productId: "cml874ki50003j5macmb9lxda", // Animals and Dinosaurs
      url: "/cover-ebook/animals.jpg",
      altText: "The Big Book of Animals and Dinosaurs cover",
      isMain: true,
      sortOrder: 0,
    },
    {
      productId: "cml874l1f0004j5ma1ve5e511", // World of Shapes
      url: "/cover-ebook/worldofshapes.jpg",
      altText: "World of Shapes workbook cover",
      isMain: true,
      sortOrder: 0,
    },
    {
      productId: "cml87a3250000140vhvtptbd6", // Bundle
      url: "/cover-ebook/ranibowofcolors.jpg", // Usa la prima come cover
      altText: "5 Learning Workbooks Bundle",
      isMain: true,
      sortOrder: 0,
    },
  ];

  for (const img of imagesToAdd) {
    try {
      // Controlla se l'immagine esiste già
      const exists = await prisma.productImage.findFirst({
        where: {
          productId: img.productId,
          url: img.url,
        },
      });

      if (exists) {
        console.log(`⏭️ Skipped: Image already exists for ${img.productId}`);
        continue;
      }

      // Crea l'immagine
      const created = await prisma.productImage.create({
        data: img,
      });

      console.log(`✅ Added image for product: ${img.productId}`);
    } catch (error) {
      console.log(`⚠️ Error adding image for ${img.productId}:`, error);
    }
  }

  console.log("✅ Images seed completed!");
}

seedProductImages()
  .catch((e) => {
    console.error("❌ Images seed failed:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
