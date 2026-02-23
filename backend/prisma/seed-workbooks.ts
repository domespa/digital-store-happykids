import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedWorkbook() {
  console.log(" inizio ");

  const WD = [
    {
      id: "cml874iv70000j5ma3lmjfjzq",
      pages: 47,
      ageRange: "3-5 years",
      previewImages: [
        "/extractebooks/arainbow1.jpg",
        "/extractebooks/arainbow2.jpg",
        "/extractebooks/arainbow3.jpg",
        "/extractebooks/arainbow4.jpg",
      ],
    },
    {
      id: "cml874jfl0001j5ma9jkc2hl7",
      pages: 60,
      ageRange: "3-5 years",
      previewImages: [
        "/extractebooks/letter1.jpg",
        "/extractebooks/letter2.jpg",
        "/extractebooks/letter3.jpg",
        "/extractebooks/letter4.jpg",
      ],
    },
    {
      id: "cml874jyu0002j5mapb5yr6zg",
      pages: 59,
      ageRange: "3-5 years",
      previewImages: [
        "/extractebooks/writing1.jpg",
        "/extractebooks/writing2.jpg",
        "/extractebooks/writing3.jpg",
        "/extractebooks/writing4.jpg",
      ],
    },
    {
      id: "cml874ki50003j5macmb9lxda",
      pages: 64,
      ageRange: "3-5 years",
      previewImages: [
        "/extractebooks/animals1.jpg",
        "/extractebooks/animals2.jpg",
        "/extractebooks/animals3.jpg",
        "/extractebooks/animals4.jpg",
      ],
    },
    {
      id: "cml874l1f0004j5ma1ve5e511",
      pages: 65,
      ageRange: "3-5 years",
      previewImages: [
        "/extractebooks/shapes1.jpg",
        "/extractebooks/shapes2.jpg",
        "/extractebooks/shapes3.jpg",
        "/extractebooks/shapes4.jpg",
      ],
    },
    {
      id: "cml87a3250000140vhvtptbd6",
      pages: 295,
      ageRange: "3-5 years",
      previewImages: [
        "/extractebooks/arainbow1.jpg",
        "/extractebooks/letter1.jpg",
        "/extractebooks/writing1.jpg",
        "/extractebooks/animals1.jpg",
        "/extractebooks/shapes1.jpg",
      ],
    },
  ];

  for (const wb of WD) {
    try {
      const updated = await prisma.product.update({
        where: { id: wb.id },
        data: {
          pages: wb.pages,
          ageRange: wb.ageRange,
          previewImages: wb.previewImages,
        },
      });

      console.log(`Aggiornato: ${updated.name} ${wb.id}`);
    } catch (error) {
      console.error(`Fallito ${wb.id}`);
    }
  }

  console.log("tutto ok");
}

seedWorkbook()
  .catch((e) => {
    console.error("Fallito f", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
