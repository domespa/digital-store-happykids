import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { currencyService } from "../services/currencyService";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductDetailResponse,
  ProductMutationResponse,
  ProductResponse,
} from "../types/product";
import { prisma } from "../utils/prisma";
import { FileUploadService } from "../services/uploadService";
import { cloudinary } from "../services/uploadService";

declare global {
  namespace Express {
    interface Request {
      currency?: string;
    }
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

const getStringParam = (param: unknown): string | undefined => {
  return typeof param === "string" ? param : undefined;
};

// ============================================
// LISTA PRODOTTI PUBBLICI
// GET /api/products
// ============================================
export const getProducts = async (req: Request, res: Response) => {
  try {
    const search = getStringParam(req.query.search);
    const minPrice = getStringParam(req.query.minPrice);
    const maxPrice = getStringParam(req.query.maxPrice);
    const sortBy = getStringParam(req.query.sortBy) || "createdAt";
    const sortOrder = getStringParam(req.query.sortOrder) || "desc";
    const page = getStringParam(req.query.page) || "1";
    const limit = getStringParam(req.query.limit) || "10";

    const targetCurrency = req.currency || "EUR";

    // VALIDAZIONI PARAMETRI
    const validSortFields = ["name", "price", "createdAt"];
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const validSortOrder =
      sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc";

    // FILTRI
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // FILTRI PREZZO (converti target currency → product currency per filtering)
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        // Converti da targetCurrency a EUR (default DB currency) per filtrare
        let minPriceEUR = Number(minPrice);
        if (targetCurrency !== "EUR") {
          const conversion = await currencyService.convertPrice(
            Number(minPrice),
            targetCurrency,
            "EUR"
          );
          minPriceEUR = conversion.convertedAmount;
        }
        where.price.gte = minPriceEUR;
      }

      if (maxPrice !== undefined) {
        let maxPriceEUR = Number(maxPrice);
        if (targetCurrency !== "EUR") {
          const conversion = await currencyService.convertPrice(
            Number(maxPrice),
            targetCurrency,
            "EUR"
          );
          maxPriceEUR = conversion.convertedAmount;
        }
        where.price.lte = maxPriceEUR;
      }
    }

    // PAGINAZIONE
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          currency: true,
          compareAtPrice: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { [validSortBy]: validSortOrder },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    // CONVERTI PREZZI
    const productsWithCurrency = await Promise.all(
      rawProducts.map(async (product) => {
        const basePrice = product.price.toNumber();
        const productCurrency = product.currency || "EUR";
        const compareAt = product.compareAtPrice?.toNumber() || basePrice;

        // Stesso currency - no conversion
        if (targetCurrency === productCurrency) {
          return {
            ...product,
            price: basePrice,
            displayPrice: basePrice,
            currency: productCurrency,
            compareAtPrice: compareAt,
            displayCompareAtPrice: compareAt,
            originalPrice: basePrice,
            originalCurrency: productCurrency,
            formattedPrice: currencyService.formatPrice(
              basePrice,
              productCurrency
            ),
            formattedCompareAtPrice: currencyService.formatPrice(
              compareAt,
              productCurrency
            ),
            exchangeRate: 1,
            exchangeSource: "same" as const,
          };
        }

        // Converti da productCurrency → targetCurrency
        const priceConversion = await currencyService.convertPrice(
          basePrice,
          productCurrency,
          targetCurrency
        );

        const compareAtConversion = await currencyService.convertPrice(
          compareAt,
          productCurrency,
          targetCurrency
        );

        return {
          ...product,
          price: basePrice,
          displayPrice: priceConversion.convertedAmount,
          currency: targetCurrency,
          compareAtPrice: compareAt,
          displayCompareAtPrice: compareAtConversion.convertedAmount,
          originalPrice: basePrice,
          originalCurrency: productCurrency,
          formattedPrice: currencyService.formatPrice(
            priceConversion.convertedAmount,
            targetCurrency
          ),
          formattedCompareAtPrice: currencyService.formatPrice(
            compareAtConversion.convertedAmount,
            targetCurrency
          ),
          exchangeRate: priceConversion.rate,
          exchangeSource: priceConversion.source,
        };
      })
    );

    res.json({
      success: true,
      message: "Products retrieved successfully",
      products: productsWithCurrency,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      currency: {
        current: targetCurrency,
        supported: currencyService.getSupportedCurrencies(),
      },
    });
  } catch (error: unknown) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get products",
    } as ProductListResponse);
  }
};

// ============================================
// DETTAGLIO PRODOTTO
// GET /api/products/:id
// ============================================
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const targetCurrency = req.currency || "EUR";

    const rawProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        compareAtPrice: true,
        isActive: true,
        createdAt: true,
        images: true,
      },
    });

    if (!rawProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      } as ProductDetailResponse);
    }

    if (!rawProduct.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      } as ProductDetailResponse);
    }

    const basePrice = rawProduct.price.toNumber();
    const productCurrency = rawProduct.currency || "EUR";
    const compareAt = rawProduct.compareAtPrice?.toNumber() || basePrice;

    let productWithCurrency;

    // Stesso currency - no conversion
    if (targetCurrency === productCurrency) {
      productWithCurrency = {
        ...rawProduct,
        price: basePrice,
        displayPrice: basePrice,
        currency: productCurrency,
        compareAtPrice: compareAt,
        displayCompareAtPrice: compareAt,
        originalPrice: basePrice,
        originalCurrency: productCurrency,
        formattedPrice: currencyService.formatPrice(basePrice, productCurrency),
        formattedCompareAtPrice: currencyService.formatPrice(
          compareAt,
          productCurrency
        ),
        exchangeRate: 1,
        exchangeSource: "same" as const,
      };
    } else {
      // Converti da productCurrency → targetCurrency
      const priceConversion = await currencyService.convertPrice(
        basePrice,
        productCurrency,
        targetCurrency
      );

      const compareAtConversion = await currencyService.convertPrice(
        compareAt,
        productCurrency,
        targetCurrency
      );

      productWithCurrency = {
        ...rawProduct,
        price: basePrice,
        displayPrice: priceConversion.convertedAmount,
        currency: targetCurrency,
        compareAtPrice: compareAt,
        displayCompareAtPrice: compareAtConversion.convertedAmount,
        originalPrice: basePrice,
        originalCurrency: productCurrency,
        formattedPrice: currencyService.formatPrice(
          priceConversion.convertedAmount,
          targetCurrency
        ),
        formattedCompareAtPrice: currencyService.formatPrice(
          compareAtConversion.convertedAmount,
          targetCurrency
        ),
        exchangeRate: priceConversion.rate,
        exchangeSource: priceConversion.source,
      };
    }

    res.json({
      success: true,
      message: "Product retrieved successfully",
      product: productWithCurrency,
      currency: {
        current: targetCurrency,
        supported: currencyService.getSupportedCurrencies(),
      },
    } as ProductDetailResponse);
  } catch (error: unknown) {
    console.error("Get product by id error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get product",
    } as ProductDetailResponse);
  }
};

// ============================================
// CREA PRODOTTO
// POST /api/admin/products
// ============================================
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      compareAtPrice,
      fileName,
      filePath,
      categoryId,
    }: CreateProductRequest = req.body;

    // VALIDAZIONE
    if (!name || !price || !fileName || !filePath) {
      return res.status(400).json({
        success: false,
        message: "Name, price, fileName, and filePath are required",
      } as ProductMutationResponse);
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      } as ProductMutationResponse);
    }

    // CONTROLLO DUPLICATO
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: name.trim(),
        isActive: true,
      },
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists",
      } as ProductMutationResponse);
    }

    // CREAZIONE
    const rawProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: generateSlug(name),
        description: description?.trim() || null,
        price: numPrice,
        currency: currency || "EUR",
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : numPrice,
        fileName: fileName.trim(),
        filePath: filePath.trim(),
        isActive: true,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        stock: 0,
        lowStockThreshold: 5,
        trackInventory: false,
        allowBackorder: false,
        viewCount: 0,
        downloadCount: 0,
        rating: 0,
        reviewCount: 0,
        isFeatured: false,
        isDigital: true,
      },
    });

    const newProduct: ProductResponse = {
      id: rawProduct.id,
      name: rawProduct.name,
      slug: rawProduct.slug,
      description: rawProduct.description,
      shortDescription: rawProduct.shortDescription,
      price: rawProduct.price.toNumber(),
      currency: rawProduct.currency || "EUR",
      compareAtPrice: rawProduct.compareAtPrice?.toNumber() || null,
      originalPrice: rawProduct.originalPrice?.toNumber() || null,
      fileName: rawProduct.fileName,
      filePath: rawProduct.filePath,
      createdAt: rawProduct.createdAt,
      updatedAt: rawProduct.updatedAt,
      publishedAt: rawProduct.publishedAt,
      stock: rawProduct.stock,
      lowStockThreshold: rawProduct.lowStockThreshold,
      trackInventory: rawProduct.trackInventory,
      allowBackorder: rawProduct.allowBackorder,
      viewCount: rawProduct.viewCount,
      downloadCount: rawProduct.downloadCount,
      rating: rawProduct.rating.toNumber(),
      reviewCount: rawProduct.reviewCount,
      isActive: rawProduct.isActive,
      isFeatured: rawProduct.isFeatured,
      isDigital: rawProduct.isDigital,
      seoTitle: rawProduct.seoTitle,
      seoDescription: rawProduct.seoDescription,
      categoryId: rawProduct.categoryId,
    };

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    } as ProductMutationResponse);
  } catch (error: unknown) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    } as ProductMutationResponse);
  }
};

// ============================================
// MODIFICA PRODOTTO
// PUT /api/admin/products/:id
// ============================================
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateProductRequest = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      } as ProductMutationResponse);
    }

    const data: Prisma.ProductUpdateInput = {};

    if (updateData.name !== undefined) {
      data.name = updateData.name.trim();
      data.slug = generateSlug(updateData.name);
    }
    if (updateData.description !== undefined) {
      data.description = updateData.description?.trim() || null;
    }
    if (updateData.price !== undefined) {
      const numPrice = Number(updateData.price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number",
        } as ProductMutationResponse);
      }
      data.price = numPrice;
    }
    if (updateData.currency !== undefined) {
      data.currency = updateData.currency;
    }
    if (updateData.compareAtPrice !== undefined) {
      data.compareAtPrice = Number(updateData.compareAtPrice);
    }
    if (updateData.fileName !== undefined) {
      data.fileName = updateData.fileName.trim();
    }
    if (updateData.filePath !== undefined) {
      data.filePath = updateData.filePath.trim();
    }
    if (updateData.isActive !== undefined) {
      data.isActive = updateData.isActive;
    }
    if (updateData.categoryId !== undefined) {
      if (updateData.categoryId === null) {
        data.category = { disconnect: true };
      } else {
        data.category = { connect: { id: updateData.categoryId } };
      }
    }
    if (updateData.stock !== undefined) {
      data.stock = updateData.stock;
    }
    if (updateData.lowStockThreshold !== undefined) {
      data.lowStockThreshold = updateData.lowStockThreshold;
    }
    if (updateData.trackInventory !== undefined) {
      data.trackInventory = updateData.trackInventory;
    }
    if (updateData.allowBackorder !== undefined) {
      data.allowBackorder = updateData.allowBackorder;
    }

    // CONTROLLO NOME DUPLICATO
    if (updateData.name && updateData.name.trim() !== existingProduct.name) {
      const duplicateProduct = await prisma.product.findFirst({
        where: {
          name: updateData.name.trim(),
          isActive: true,
          id: { not: id },
        },
      });

      if (duplicateProduct) {
        return res.status(409).json({
          success: false,
          message: "Product with this name already exists",
        } as ProductMutationResponse);
      }
    }

    const rawUpdatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    const updatedProduct: ProductResponse = {
      id: rawUpdatedProduct.id,
      name: rawUpdatedProduct.name,
      slug: rawUpdatedProduct.slug,
      description: rawUpdatedProduct.description,
      shortDescription: rawUpdatedProduct.shortDescription,
      price: rawUpdatedProduct.price.toNumber(),
      currency: rawUpdatedProduct.currency || "EUR",
      compareAtPrice: rawUpdatedProduct.compareAtPrice?.toNumber() || null,
      originalPrice: rawUpdatedProduct.originalPrice?.toNumber() || null,
      fileName: rawUpdatedProduct.fileName,
      filePath: rawUpdatedProduct.filePath,
      createdAt: rawUpdatedProduct.createdAt,
      updatedAt: rawUpdatedProduct.updatedAt,
      publishedAt: rawUpdatedProduct.publishedAt,
      stock: rawUpdatedProduct.stock,
      lowStockThreshold: rawUpdatedProduct.lowStockThreshold,
      trackInventory: rawUpdatedProduct.trackInventory,
      allowBackorder: rawUpdatedProduct.allowBackorder,
      viewCount: rawUpdatedProduct.viewCount,
      downloadCount: rawUpdatedProduct.downloadCount,
      rating: rawUpdatedProduct.rating.toNumber(),
      reviewCount: rawUpdatedProduct.reviewCount,
      isActive: rawUpdatedProduct.isActive,
      isFeatured: rawUpdatedProduct.isFeatured,
      isDigital: rawUpdatedProduct.isDigital,
      seoTitle: rawUpdatedProduct.seoTitle,
      seoDescription: rawUpdatedProduct.seoDescription,
      categoryId: rawUpdatedProduct.categoryId,
    };

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    } as ProductMutationResponse);
  } catch (error: unknown) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    } as ProductMutationResponse);
  }
};

// ============================================
// ELIMINAZIONE (SOFT DELETE)
// DELETE /api/admin/products/:id
// ============================================
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      } as ProductMutationResponse);
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    } as ProductMutationResponse);
  } catch (error: unknown) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    } as ProductMutationResponse);
  }
};

// ... (resto delle funzioni images rimangono identiche) ...

export const getProductImages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product images retrieved successfully",
      images: product.images,
      total: product.images.length,
    });
  } catch (error: unknown) {
    console.error("Get product images error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product images",
    });
  }
};

export const uploadProductImages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const fileUploadService = new FileUploadService();
    const uploadedImages = await fileUploadService.uploadProductGallery(
      files,
      id,
      req.user?.id
    );

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      images: uploadedImages,
    });
  } catch (error: unknown) {
    console.error("Upload product images error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload images",
    });
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params;

    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id,
      },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.isMain) {
      const otherImage = await prisma.productImage.findFirst({
        where: {
          productId: id,
          id: { not: imageId },
        },
        orderBy: { sortOrder: "asc" },
      });

      if (otherImage) {
        await prisma.productImage.update({
          where: { id: otherImage.id },
          data: { isMain: true },
        });
      }
    }

    try {
      const publicId = FileUploadService.extractPublicIdFromUrl(image.url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
    }

    await prisma.productImage.delete({
      where: { id: imageId },
    });

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete product image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
    });
  }
};

export const setFeaturedImage = async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params;

    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id,
      },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    await prisma.productImage.updateMany({
      where: {
        productId: id,
        id: { not: imageId },
      },
      data: { isMain: false },
    });

    const updatedImage = await prisma.productImage.update({
      where: { id: imageId },
      data: { isMain: true },
    });

    res.json({
      success: true,
      message: "Featured image set successfully",
      image: updatedImage,
    });
  } catch (error: unknown) {
    console.error("Set featured image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set featured image",
    });
  }
};

// ============================================
// LISTA PRODOTTI ADMIN
// GET /api/admin/products
// ============================================
export const getProductsAdmin = async (req: Request, res: Response) => {
  try {
    const search = getStringParam(req.query.search);
    const minPrice = getStringParam(req.query.minPrice);
    const maxPrice = getStringParam(req.query.maxPrice);
    const isActive = getStringParam(req.query.isActive);
    const sortBy = getStringParam(req.query.sortBy) || "createdAt";
    const sortOrder = getStringParam(req.query.sortOrder) || "desc";
    const page = getStringParam(req.query.page) || "1";
    const limit = getStringParam(req.query.limit) || "10";

    const validSortFields = ["name", "price", "createdAt"];
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const validSortOrder =
      sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc";

    const where: Prisma.ProductWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = Number(maxPrice);
      }
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [validSortBy]: validSortOrder },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const products: ProductResponse[] = rawProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price.toNumber(),
      currency: product.currency || "EUR",
      compareAtPrice: product.compareAtPrice?.toNumber() || null,
      originalPrice: product.originalPrice?.toNumber() || null,
      fileName: product.fileName,
      filePath: product.filePath,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      publishedAt: product.publishedAt,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      trackInventory: product.trackInventory,
      allowBackorder: product.allowBackorder,
      viewCount: product.viewCount,
      downloadCount: product.downloadCount,
      rating: product.rating.toNumber(),
      reviewCount: product.reviewCount,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isDigital: product.isDigital,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      categoryId: product.categoryId,
    }));

    res.json({
      success: true,
      message: "Products retrieved successfully",
      products,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      currency: "EUR",
    });
  } catch (error: unknown) {
    console.error("Get admin products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};

// ============================================
// CONVERSIONE PREZZO MANUALE
// POST /api/products/:id/convert
// ============================================
export const convertProductPrice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        message: "fromCurrency and toCurrency are required",
      });
    }

    let priceToConvert = amount;

    if (!amount && id) {
      const product = await prisma.product.findUnique({
        where: { id },
        select: { price: true, currency: true, isActive: true, name: true },
      });

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: "Product not found or not active",
        });
      }

      priceToConvert = product.price.toNumber();
    }

    if (!priceToConvert) {
      return res.status(400).json({
        success: false,
        message: "Amount or valid product ID required",
      });
    }

    const conversion = await currencyService.convertPrice(
      priceToConvert,
      fromCurrency,
      toCurrency
    );

    res.json({
      success: true,
      data: {
        originalAmount: priceToConvert,
        convertedAmount: conversion.convertedAmount,
        fromCurrency,
        toCurrency,
        exchangeRate: conversion.rate,
        source: conversion.source,
        formattedPrice: currencyService.formatPrice(
          conversion.convertedAmount,
          toCurrency
        ),
        timestamp: conversion.timestamp,
      },
    });
  } catch (error) {
    console.error("Convert price error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to convert price",
    });
  }
};
