import { useState, useEffect, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { adminProducts } from "../../services/adminApi";
import type {
  Product,
  CreateProductRequest,
  ApiError,
  ProductImage,
} from "../../types/admin";

interface CreateProductForm {
  name: string;
  description: string;
  price: string;
  fileName: string;
  filePath: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductForm>({
    name: "",
    description: "",
    price: "",
    fileName: "",
    filePath: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // SEARCH
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // IMAGE
  const [showGallery, setShowGallery] = useState(false);
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);

  // EBOOK UPLOAD
  const [showEbookUpload, setShowEbookUpload] = useState(false);
  const [ebookProduct, setEbookProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminProducts.getAll();
      setProducts(response.products || []);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const productData: CreateProductRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        fileName: formData.fileName.trim(),
        filePath: formData.filePath.trim(),
      };

      await adminProducts.create(productData);
      await loadProducts();
      resetForm();
      setShowCreateForm(false);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setFormLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        fileName: formData.fileName.trim(),
        filePath: formData.filePath.trim(),
      };

      await adminProducts.update(editingProduct.id, productData);
      await loadProducts();
      resetForm();
      setEditingProduct(null);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await adminProducts.delete(productId);
      await loadProducts();
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete product"
      );
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      fileName: product.fileName,
      filePath: product.filePath,
    });
    setShowCreateForm(true);
  };

  const openGallery = (product: Product) => {
    setGalleryProduct(product);
    setShowGallery(true);
  };

  const openEbookUpload = (product: Product) => {
    setEbookProduct(product);
    setShowEbookUpload(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      fileName: "",
      filePath: "",
    });
    setEditingProduct(null);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || product.isActive;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="text-gray-600">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadProducts} variant="secondary">
            Refresh
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <Card>
          <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </Card>
      )}

      {/* SEARCH */}
      <Card>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            Show inactive
          </label>
        </div>
      </Card>

      {/* CREATE/EDIT FORM */}
      {showCreateForm && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingProduct ? "Edit Product" : "Create New Product"}
            </h3>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateForm(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>

          <form
            onSubmit={
              editingProduct ? handleUpdateProduct : handleCreateProduct
            }
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                label="Price (EUR)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="File Name"
                value={formData.fileName}
                onChange={(e) =>
                  setFormData({ ...formData, fileName: e.target.value })
                }
                placeholder="product.pdf"
                required
              />
              <Input
                label="File Path"
                value={formData.filePath}
                onChange={(e) =>
                  setFormData({ ...formData, filePath: e.target.value })
                }
                placeholder="/uploads/products/product.pdf"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" loading={formLoading}>
                {formLoading
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* IMAGE GALLERY */}
      {showGallery && galleryProduct && (
        <ProductGalleryManager
          product={galleryProduct}
          onClose={() => {
            setShowGallery(false);
            setGalleryProduct(null);
          }}
          onUpdate={loadProducts}
        />
      )}

      {/* EBOOK UPLOAD MANAGER */}
      {showEbookUpload && ebookProduct && (
        <EbookUploadManager
          product={ebookProduct}
          onClose={() => {
            setShowEbookUpload(false);
            setEbookProduct(null);
          }}
          onUpdate={loadProducts}
        />
      )}

      {/* PRODUCTS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {product.description}
                    </p>
                  )}
                </div>
                <Badge variant={product.isActive ? "success" : "default"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>File:</span>
                  <span>{product.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              </div>

              {/* BOTTONI MODIFICATI */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startEditProduct(product)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openGallery(product)}
                >
                  🖼️ Images
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEbookUpload(product)}
                >
                  📤 Ebook
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && !loading && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No products found matching your search."
                : "No products found."}
            </p>
            {!showCreateForm && (
              <Button
                className="mt-4"
                onClick={() => {
                  resetForm();
                  setShowCreateForm(true);
                }}
              >
                Create your first product
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

// ==================== PRODUCT GALLERY MANAGER ====================

interface ProductGalleryManagerProps {
  product: Product;
  onClose: () => void;
  onUpdate: () => void;
}

function ProductGalleryManager({
  product,
  onClose,
  onUpdate,
}: ProductGalleryManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, [product.id]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await adminProducts.getImages(product.id);
      setImages(response.images || []);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    if (fileArray.length > 5) {
      setError("Maximum 5 images at a time");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await adminProducts.uploadImages(product.id, fileArray);
      await loadImages();
      onUpdate();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      await adminProducts.deleteImage(product.id, imageId);
      await loadImages();
      onUpdate();
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || "Failed to delete image");
    }
  };

  const handleSetFeatured = async (imageId: string) => {
    try {
      await adminProducts.setFeaturedImage(product.id, imageId);
      await loadImages();
      onUpdate();
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || "Failed to set featured image");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90dvh] overflow-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Product Images</h2>
            <p className="text-sm text-gray-600">{product.name}</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded border border-red-200">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* UPLOAD SECTION */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center py-4"
          >
            <span className="text-4xl mb-2">📸</span>
            <span className="text-sm font-medium text-gray-700">
              Click to upload images
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Max 5 images, PNG/JPG/WEBP
            </span>
          </label>
          {uploading && (
            <div className="text-center text-sm text-blue-600 mt-2">
              Uploading...
            </div>
          )}
        </div>

        {/* IMAGES GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No images yet. Upload some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group border-2 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
              >
                {/* FEATURED BADGE */}
                {image.isMain && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="success">⭐ Featured</Badge>
                  </div>
                )}

                {/* IMAGE */}
                <img
                  src={image.url}
                  alt={image.altText || product.name}
                  className="w-full aspect-square object-cover"
                />

                {/* ACTIONS OVERLAY */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!image.isMain && (
                    <button
                      onClick={() => handleSetFeatured(image.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      title="Set as featured"
                    >
                      ⭐ Featured
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    title="Delete image"
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* IMAGE INFO */}
                <div className="p-2 bg-gray-50 text-xs text-gray-600">
                  Order: {image.sortOrder + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          {images.length} image(s) • Featured image will be used on homepage
        </div>
      </Card>
    </div>
  );
}

// ==================== EBOOK UPLOAD MANAGER ====================

interface EbookUploadManagerProps {
  product: Product;
  onClose: () => void;
  onUpdate: () => void;
}

function EbookUploadManager({
  product,
  onClose,
  onUpdate,
}: EbookUploadManagerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSuccess(null);
    setError(null);

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `File too large. Max: 50MB, Your file: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    if (
      !confirm(
        `Upload ebook for "${product.name}"?\n\nFile: ${
          selectedFile.name
        }\nSize: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
      )
    ) {
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      // ✅ USA adminProducts.uploadEbook
      const result = await adminProducts.uploadEbook(
        product.id,
        selectedFile,
        (progressPercent) => {
          setProgress(progressPercent);
        }
      );

      setSuccess(`✅ Upload successful!\n\nPublic ID: ${result.publicId}`);

      // Reset
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Update products list
      setTimeout(() => {
        onUpdate();
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("❌ Upload error:", error);
      setError(error.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Ebook</h2>
            <p className="text-sm text-gray-600">{product.name}</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* CURRENT FILE INFO */}
        {product.filePath && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success">Current File</Badge>
            </div>
            <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded break-all">
              {product.filePath}
            </div>
            {product.fileName && (
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>📄</span>
                <span>{product.fileName}</span>
              </div>
            )}
          </div>
        )}

        {/* ERROR/SUCCESS ALERTS */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-xl">❌</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-green-600 text-xl">✅</span>
              <p className="text-sm text-green-600 whitespace-pre-line">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* FILE INPUT */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              file:cursor-pointer
              cursor-pointer
              disabled:opacity-50"
            disabled={uploading}
          />
        </div>

        {/* FILE INFO */}
        {selectedFile && !uploading && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl">📄</span>
                <span className="text-sm truncate">{selectedFile.name}</span>
              </div>
              <Badge variant="info">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            </div>
          </div>
        )}

        {/* PROGRESS BAR */}
        {uploading && (
          <div className="mb-6 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* UPLOAD BUTTON */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          loading={uploading}
          className="w-full mb-4"
        >
          {uploading
            ? `Uploading... ${progress}%`
            : product.filePath
            ? "🔄 Replace Ebook"
            : "📤 Upload Ebook"}
        </Button>

        {/* INFO BOX */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div className="text-xs text-yellow-800 space-y-2">
              <p className="font-semibold">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Only PDF files (max 50MB)</li>
                <li>File uploaded to Cloudinary (folder: "Ebooks")</li>
                <li>Type: "upload" (signed URLs)</li>
                <li>Product filePath automatically updated</li>
                <li>Old file replaced if exists</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
