import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "";
  const password = "";

  try {
    console.log("🔐 Creating admin user...");
    console.log("📧 Email:", email);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        password: hashedPassword,
        emailVerified: true,
      },
      create: {
        email,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "ScreenDetox",
        role: "ADMIN",
        emailVerified: true,
      },
    });

    console.log("");
    console.log("✅ ✅ ✅ ADMIN CREATED SUCCESSFULLY! ✅ ✅ ✅");
    console.log("");
    console.log("📋 LOGIN CREDENTIALS:");
    console.log("   Email:", email);
    console.log("   Password:", password);
    console.log("");
    console.log("🔗 LOGIN URL:");
    console.log("   Production: https://screendetox.vercel.app/admin/login");
    console.log("   Local: http://localhost:5173/admin/login");
    console.log("");
    console.log("👤 Admin ID:", admin.id);
    console.log("");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
