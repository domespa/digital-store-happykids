import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  // UPLOAD FILE
  async uploadFile(
    filePath: string,
    fileName: string
  ): Promise<{ publicId: string; secureUrl: string }> {
    try {
      console.log("📤 Starting upload to Cloudinary...");
      console.log("📝 Original fileName:", fileName);

      const baseFileName = fileName.replace(/\.pdf$/i, "");
      console.log("📝 Base fileName:", baseFileName);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "Ebooks",
        public_id: baseFileName,
        resource_type: "raw",
        type: "upload",
        access_mode: "public",
        overwrite: true,
      });

      console.log("✅ Upload successful!");
      console.log("📋 Public ID:", result.public_id);
      console.log("🔗 Secure URL:", result.secure_url);

      return {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    } finally {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.warn("⚠️ Failed to delete temp file:", cleanupError);
      }
    }
  }

  // GENERA URL PUBBLICO (senza API, senza scadenza)
  async generateDownload(secureUrl: string): Promise<string> {
    console.log("🔗 Returning direct download URL");
    console.log("📋 URL:", secureUrl);

    // Se è già un URL completo con res.cloudinary.com, ritornalo così com'è
    if (secureUrl.includes("res.cloudinary.com")) {
      console.log("✅ Using direct secure_url from Cloudinary");
      return secureUrl;
    }

    // ✅ Altrimenti (se è solo il public_id), costruisci l'URL
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const publicId = secureUrl.endsWith(".pdf")
      ? secureUrl
      : `${secureUrl}.pdf`;

    // URL DIRETTO SENZA fl_attachment (non serve per file pubblici)
    const url = `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;

    console.log("🔗 Generated URL:", url);
    return url;
  }

  // ELIMINA FILE
  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
        type: "upload",
      });
      console.log("File eliminato", publicId);
    } catch (error) {
      console.error("Eliminazione non riuscita", error);
      throw error;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
