"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";
import { revalidateStore } from "@/lib/revalidate-store";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Server Action: Create Product with Colors, Sizes, Variants, and Inventory
 * All operations execute inside an atomic database transaction.
 */
export async function createProduct(
  values: ProductFormValues
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = productSchema.parse(values);

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return { success: false, error: "هذا الرابط الدائم (Slug) مستخدم بالفعل لمنتج آخر" };
    }

    const product = await prisma.$transaction(async (tx) => {
      // 1. Create base product
      const newProduct = await tx.product.create({
        data: {
          name: validated.name,
          slug: validated.slug,
          description: validated.description || null,
          price: validated.price,
          discountPercent: validated.discountPercent ?? null,
          isDiscountActive: validated.isDiscountActive,
          isFeatured: validated.isFeatured,
          isNewArrival: validated.isNewArrival,
          isBestSeller: validated.isBestSeller,
          isActive: validated.isActive,
          categoryId: validated.categoryId || null,
        },
      });

      // 2. Insert product images
      if (validated.images.length > 0) {
        await tx.productImage.createMany({
          data: validated.images.map((img, idx) => ({
            productId: newProduct.id,
            url: img.url,
            altText: img.altText || `${validated.name} - ${idx + 1}`,
            displayOrder: img.displayOrder ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        });
      }

      // 3. Create colors
      const colorRecords = await Promise.all(
        validated.colors.map((c) =>
          tx.productColor.create({
            data: {
              productId: newProduct.id,
              name: c.name,
              hexCode: c.hexCode,
            },
          })
        )
      );
      const colorMap = new Map(colorRecords.map((c) => [c.name, c.id]));

      // 4. Create sizes
      const sizeRecords = await Promise.all(
        validated.sizes.map((s, idx) =>
          tx.productSize.create({
            data: {
              productId: newProduct.id,
              name: s.name,
              displayOrder: s.displayOrder ?? idx,
            },
          })
        )
      );
      const sizeMap = new Map(sizeRecords.map((s) => [s.name, s.id]));

      // 5. Create variants and inventories
      for (const variant of validated.variants) {
        const colorId = colorMap.get(variant.colorName);
        const sizeId = sizeMap.get(variant.sizeName);

        if (!colorId || !sizeId) {
          throw new Error(`Color (${variant.colorName}) or Size (${variant.sizeName}) not found`);
        }

        const newVariant = await tx.productVariant.create({
          data: {
            productId: newProduct.id,
            colorId,
            sizeId,
            sku: variant.sku || null,
          },
        });

        await tx.inventory.create({
          data: {
            variantId: newVariant.id,
            quantity: variant.stock,
            lowStockThreshold: variant.lowStockThreshold ?? 2,
          },
        });
      }

      return newProduct;
    });

    // Revalidate dashboard cache
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    // 🔴 Revalidate Website cache (cross-process)
    await revalidateStore({
      paths: ["/", "/products"],
      action: "create_product",
      productId: product.id,
    });

    return { success: true, data: { id: product.id } };
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء حفظ المنتج";
    return { success: false, error: message };
  }
}

/**
 * Server Action: Update Product with Colors, Sizes, Variants, and Inventory
 */
export async function updateProduct(
  productId: string,
  values: ProductFormValues
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = productSchema.parse(values);

    // Check slug uniqueness excluding this product
    const existing = await prisma.product.findFirst({
      where: {
        slug: validated.slug,
        id: { not: productId },
      },
    });
    if (existing) {
      return { success: false, error: "هذا الرابط الدائم (Slug) مستخدم بالفعل لمنتج آخر" };
    }

    const product = await prisma.$transaction(async (tx) => {
      // 1. Update base product
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          name: validated.name,
          slug: validated.slug,
          description: validated.description || null,
          price: validated.price,
          discountPercent: validated.discountPercent ?? null,
          isDiscountActive: validated.isDiscountActive,
          isFeatured: validated.isFeatured,
          isNewArrival: validated.isNewArrival,
          isBestSeller: validated.isBestSeller,
          isActive: validated.isActive,
          categoryId: validated.categoryId || null,
        },
      });

      // 2. Re-create images
      await tx.productImage.deleteMany({
        where: { productId },
      });
      if (validated.images.length > 0) {
        await tx.productImage.createMany({
          data: validated.images.map((img, idx) => ({
            productId,
            url: img.url,
            altText: img.altText || `${validated.name} - ${idx + 1}`,
            displayOrder: img.displayOrder ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        });
      }

      // 3. Colors:
      const existingColors = await tx.productColor.findMany({ where: { productId } });
      const existingColorMap = new Map(existingColors.map((c) => [c.name, c]));
      const submittedColorNames = new Set(validated.colors.map((c) => c.name));

      const colorsToDelete = existingColors.filter((c) => !submittedColorNames.has(c.name));
      if (colorsToDelete.length > 0) {
        await tx.productColor.deleteMany({
          where: { id: { in: colorsToDelete.map((c) => c.id) } },
        });
      }

      const colorRecords = await Promise.all(
        validated.colors.map(async (c) => {
          const existingColor = existingColorMap.get(c.name);
          if (existingColor) {
            return tx.productColor.update({
              where: { id: existingColor.id },
              data: { hexCode: c.hexCode },
            });
          }
          return tx.productColor.create({
            data: {
              productId,
              name: c.name,
              hexCode: c.hexCode,
            },
          });
        })
      );
      const colorMap = new Map(colorRecords.map((c) => [c.name, c.id]));

      // 4. Sizes:
      const existingSizes = await tx.productSize.findMany({ where: { productId } });
      const existingSizeMap = new Map(existingSizes.map((s) => [s.name, s]));
      const submittedSizeNames = new Set(validated.sizes.map((s) => s.name));

      const sizesToDelete = existingSizes.filter((s) => !submittedSizeNames.has(s.name));
      if (sizesToDelete.length > 0) {
        await tx.productSize.deleteMany({
          where: { id: { in: sizesToDelete.map((s) => s.id) } },
        });
      }

      const sizeRecords = await Promise.all(
        validated.sizes.map(async (s, idx) => {
          const existingSize = existingSizeMap.get(s.name);
          if (existingSize) {
            return tx.productSize.update({
              where: { id: existingSize.id },
              data: { displayOrder: s.displayOrder ?? idx },
            });
          }
          return tx.productSize.create({
            data: {
              productId,
              name: s.name,
              displayOrder: s.displayOrder ?? idx,
            },
          });
        })
      );
      const sizeMap = new Map(sizeRecords.map((s) => [s.name, s.id]));

      // 5. Variants & Inventory:
      const existingVariants = await tx.productVariant.findMany({
        where: { productId },
        include: { inventory: true },
      });
      const existingVariantMap = new Map(
        existingVariants.map((v) => [`${v.colorId}-${v.sizeId}`, v])
      );

      const validVariantKeys = new Set<string>();

      for (const variant of validated.variants) {
        const colorId = colorMap.get(variant.colorName);
        const sizeId = sizeMap.get(variant.sizeName);
        if (!colorId || !sizeId) continue;

        const key = `${colorId}-${sizeId}`;
        validVariantKeys.add(key);

        const existingVar = existingVariantMap.get(key);
        if (existingVar) {
          await tx.productVariant.update({
            where: { id: existingVar.id },
            data: { sku: variant.sku || null },
          });
          if (existingVar.inventory) {
            await tx.inventory.update({
              where: { variantId: existingVar.id },
              data: {
                quantity: variant.stock,
                lowStockThreshold: variant.lowStockThreshold ?? 2,
              },
            });
          } else {
            await tx.inventory.create({
              data: {
                variantId: existingVar.id,
                quantity: variant.stock,
                lowStockThreshold: variant.lowStockThreshold ?? 2,
              },
            });
          }
        } else {
          const newVar = await tx.productVariant.create({
            data: {
              productId,
              colorId,
              sizeId,
              sku: variant.sku || null,
            },
          });
          await tx.inventory.create({
            data: {
              variantId: newVar.id,
              quantity: variant.stock,
              lowStockThreshold: variant.lowStockThreshold ?? 2,
            },
          });
        }
      }

      // Delete variants that are no longer valid
      const variantsToDelete = existingVariants.filter(
        (v) => !validVariantKeys.has(`${v.colorId}-${v.sizeId}`)
      );
      for (const v of variantsToDelete) {
        try {
          await tx.inventory.deleteMany({ where: { variantId: v.id } });
          await tx.productVariant.delete({ where: { id: v.id } });
        } catch {
          // If referenced in OrderItem, ignore deletion
        }
      }

      return updatedProduct;
    });

    // Revalidate dashboard cache
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");

    // 🔴 Revalidate Website cache (cross-process)
    await revalidateStore({
      paths: ["/", "/products", `/products/${product.slug}`],
      action: "update_product",
      productId: product.id,
    });

    return { success: true, data: { id: product.id } };
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء تحديث المنتج";
    return { success: false, error: message };
  }
}

/**
 * Server Action: Delete or Archive a Product
 */
export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    // Get slug before deleting so we can revalidate its page too
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    // 🔴 Revalidate Website cache (cross-process)
    const paths = ["/", "/products"];
    if (product?.slug) {
      paths.push(`/products/${product.slug}`);
    }
    await revalidateStore({
      paths,
      action: "delete_product",
      productId,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting product:", error);
    return { success: false, error: "تعذر حذف المنتج، قد يكون مرتبطاً بطلبات سابقة." };
  }
}

/**
 * Server Action: Toggle Product Active State
 */
export async function toggleProductStatus(
  productId: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { isActive },
      select: { slug: true },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    // 🔴 Revalidate Website cache (cross-process)
    const paths = ["/", "/products"];
    if (product?.slug) {
      paths.push(`/products/${product.slug}`);
    }
    await revalidateStore({
      paths,
      action: "delete_product",
      productId,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error toggling product status:", error);
    return { success: false, error: "تعذر تحديث حالة المنتج" };
  }
}

/**
 * Server Action: Update Variant Stock atomically
 */
export async function updateVariantStock(
  variantId: string,
  newQuantity: number
): Promise<ActionResult> {
  try {
    if (newQuantity < 0) {
      return { success: false, error: "الكمية لا يمكن أن تكون سالبة" };
    }

    // Get product slug so we can revalidate the product detail page too
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { product: { select: { slug: true } } },
    });

    await prisma.inventory.update({
      where: { variantId },
      data: { quantity: newQuantity },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/products");

    // 🔴 Revalidate Website cache (cross-process)
    const paths = ["/", "/products"];
    if (variant?.product?.slug) {
      paths.push(`/products/${variant.product.slug}`);
    }
    await revalidateStore({
      paths,
      action: "update_stock",
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating stock:", error);
    return { success: false, error: "تعذر تحديث كمية المخزون" };
  }
}
