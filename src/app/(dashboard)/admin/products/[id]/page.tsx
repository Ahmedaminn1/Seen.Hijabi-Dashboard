import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm, type InitialProductData } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        colors: true,
        sizes: { orderBy: { displayOrder: "asc" } },
        variants: {
          include: {
            color: true,
            size: true,
            inventory: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialProduct: InitialProductData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    isDiscountActive: product.isDiscountActive,
    discountPercent: product.discountPercent,
    categoryId: product.categoryId,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    isActive: product.isActive,
    images: product.images.map((img) => ({
      url: img.url,
      altText: img.altText || "",
      isPrimary: img.isPrimary,
      displayOrder: img.displayOrder,
    })),
    colors: product.colors.map((c) => ({
      name: c.name,
      hexCode: c.hexCode,
    })),
    sizes: product.sizes.map((s) => ({
      name: s.name,
      displayOrder: s.displayOrder,
    })),
    variants: product.variants.map((v) => ({
      colorName: v.color.name,
      sizeName: v.size.name,
      sku: v.sku,
      stock: v.inventory?.quantity ?? 0,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
        <Link
          href="/admin/products"
          className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-sm hover:bg-[var(--muted)] transition-colors"
          title="العودة للمنتجات"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-serif tracking-tight text-[var(--foreground)]">
            تعديل المنتج | Edit Product
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            تعديل بيانات المنتج: {product.name}
          </p>
        </div>
      </div>

      <ProductForm categories={categories} initialProduct={initialProduct} />
    </div>
  );
}

