import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configurazione R2 Client
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export class R2Service {
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME!;
    this.publicUrl = process.env.R2_PUBLIC_URL!;

    if (!this.bucketName || !this.publicUrl) {
      throw new Error("R2 configuration missing in environment variables");
    }

    console.log("✅ R2Service initialized");
    console.log("📦 Bucket:", this.bucketName);
    console.log("🌐 Public URL:", this.publicUrl);
  }

  /**
   * Genera URL temporaneo firmato (5 minuti) per download sicuro
   * Questo URL scade dopo 5 minuti e può essere usato solo per download
   */
  async generateSignedDownloadUrl(
    fileName: string,
    expiresIn: number = 300 // 5 minuti default
  ): Promise<string> {
    try {
      console.log("🔗 Generating signed URL for:", fileName);

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
      });

      const signedUrl = await getSignedUrl(r2Client, command, {
        expiresIn,
      });

      console.log("✅ Signed URL generated (expires in", expiresIn, "seconds)");
      return signedUrl;
    } catch (error) {
      console.error("❌ Error generating signed URL:", error);
      throw new Error("Failed to generate download URL");
    }
  }

  /**
   * Upload file su R2 (per admin/nuovi prodotti)
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string = "application/octet-stream"
  ): Promise<{ fileName: string; publicUrl: string }> {
    try {
      console.log("📤 Uploading to R2:", fileName);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await r2Client.send(command);

      const publicUrl = `${this.publicUrl}/${fileName}`;

      console.log("✅ File uploaded successfully");
      console.log("🔗 Public URL:", publicUrl);

      return {
        fileName,
        publicUrl,
      };
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw new Error("Failed to upload file to R2");
    }
  }

  /**
   * Elimina file da R2
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      console.log("🗑️ Deleting from R2:", fileName);

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      await r2Client.send(command);

      console.log("✅ File deleted successfully");
    } catch (error) {
      console.error("❌ Delete error:", error);
      throw new Error("Failed to delete file from R2");
    }
  }

  /**
   * Gestisce download da varie fonti (R2, Cloudinary legacy, Google Drive legacy)
   * Formato filePath:
   * - "r2:screen-detox-guide.pdf" → Genera signed URL R2
   * - "gdrive:1ABC123XYZ" → Genera URL Google Drive
   * - "https://res.cloudinary.com/..." → Ritorna URL Cloudinary (legacy)
   */
  async generateDownload(filePath: string): Promise<string> {
    console.log("🔍 Processing download for filePath:", filePath);

    // R2 Storage (nuovo sistema)
    if (filePath.startsWith("r2:")) {
      const fileName = filePath.replace("r2:", "");
      console.log("📦 R2 file detected:", fileName);
      return this.generateSignedDownloadUrl(fileName);
    }

    // Google Drive (legacy/fallback)
    if (filePath.startsWith("gdrive:")) {
      const driveId = filePath.replace("gdrive:", "");
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      console.log("☁️ Google Drive file detected:", downloadUrl);
      return downloadUrl;
    }

    // Cloudinary (legacy - per ordini vecchi)
    if (filePath.includes("res.cloudinary.com")) {
      console.log("🌥️ Cloudinary URL detected (legacy)");
      return filePath;
    }

    // Fallback: assume sia Cloudinary public_id
    console.log("⚠️ Unknown format, assuming Cloudinary public_id");
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const publicId = filePath.endsWith(".pdf") ? filePath : `${filePath}.pdf`;
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  }

  /**
   * Test connessione R2
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log("🧪 Testing R2 connection...");

      // Prova a generare un signed URL per file test
      await this.generateSignedDownloadUrl("test.txt", 60);

      console.log("✅ R2 connection OK");
      return true;
    } catch (error) {
      console.error("❌ R2 connection failed:", error);
      return false;
    }
  }
}

export const r2Service = new R2Service();
