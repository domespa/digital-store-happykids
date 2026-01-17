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

  // GENERA URL DOWNLOAD (supporta Cloudinary + Google Drive)
  async generateDownload(filePath: string): Promise<string> {
    console.log("🔗 Generating download URL for:", filePath);

    // GOOGLE DRIVE SUPPORT
    if (filePath.startsWith("gdrive:")) {
      const driveId = filePath.replace("gdrive:", "");
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      console.log("✅ Google Drive download URL:", downloadUrl);
      return downloadUrl;
    }

    // CLOUDINARY
    if (filePath.includes("res.cloudinary.com")) {
      console.log("✅ Using direct Cloudinary URL");
      return filePath;
    }

    // Costruisci URL Cloudinary da public_id
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const publicId = filePath.endsWith(".pdf") ? filePath : `${filePath}.pdf`;
    const url = `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;

    console.log("🔗 Generated Cloudinary URL:", url);
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
