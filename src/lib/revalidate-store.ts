"use server";

/**
 * revalidateStore — triggers on-demand cache revalidation and live SSE
 * notification on the Website (separate Next.js process).
 */

interface RevalidateOptions {
  paths?: string[];
  tags?: string[];
  layout?: boolean;
  action?: string;
  productId?: string;
}

export async function revalidateStore({
  paths = [],
  tags = [],
  layout = false,
  action,
  productId,
}: RevalidateOptions = {}): Promise<void> {
  const storeUrl =
    process.env.STORE_URL ||
    process.env.NEXT_PUBLIC_STORE_URL ||
    "http://localhost:3000";
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret) {
    console.warn("[revalidateStore] REVALIDATION_SECRET not set — skipping store revalidation");
    return;
  }

  const endpoint = `${storeUrl}/api/revalidate?secret=${encodeURIComponent(secret)}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paths,
        layout,
        action,
        productId,
        tag: tags[0],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn("[revalidateStore] Store returned status:", res.status);
    }
  } catch (err) {
    console.warn("[revalidateStore] Failed to notify store:", err);
  }
}
