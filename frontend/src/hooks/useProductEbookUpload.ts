import { useState } from "react";

const API_URL = "https://www.shethrivesadhd.com//api";

interface UploadEbookResponse {
  success: boolean;
  message: string;
  product: {
    id: string;
    name: string;
    filePath: string;
    fileName: string;
  };
  publicId: string;
  testDownloadLink: string;
  uploadedAt: string;
}

export const useProductEbookUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadEbook = async (
    productId: string,
    file: File
  ): Promise<UploadEbookResponse | null> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      console.log("📤 Starting upload...");
      console.log("📦 Product ID:", productId);
      console.log(
        "📄 File:",
        file.name,
        `(${(file.size / 1024 / 1024).toFixed(2)} MB)`
      );

      const formData = new FormData();
      formData.append("ebook", file);

      const xhr = new XMLHttpRequest();

      // Promise per gestire upload
      const uploadPromise = new Promise<UploadEbookResponse>(
        (resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const percentComplete = Math.round((e.loaded / e.total) * 100);
              setProgress(percentComplete);
              console.log(`📊 Upload progress: ${percentComplete}%`);
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              console.log("✅ Upload successful!");
              resolve(response);
            } else {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || "Upload failed"));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Network error during upload"));
          });

          xhr.addEventListener("abort", () => {
            reject(new Error("Upload cancelled"));
          });

          xhr.open(
            "POST",
            `${API_URL}/admin/products/${productId}/upload-ebook`
          );
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          // ❌ NON impostare Content-Type, FormData lo gestisce automaticamente
          xhr.send(formData);
        }
      );

      const data = await uploadPromise;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      console.error("❌ Upload error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    error,
    progress,
    uploadEbook,
  };
};
