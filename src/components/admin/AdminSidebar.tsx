"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Settings,
  ExternalLink,
  LogOut,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "نظرة عامة | Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات | Products", icon: Package },
  { href: "/admin/products/new", label: "إضافة منتج | Add Product", icon: PlusCircle },
  { href: "/admin/inventory", label: "المخزون | Inventory", icon: Boxes },
  { href: "/admin/orders", label: "الطلبات | Orders", icon: ShoppingBag },
  { href: "/admin/settings", label: "الإعدادات | Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";

  return (
    <>
      {/* ─── Mobile Sticky Top Bar (< lg) ─── */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-[var(--card)] border-b border-[var(--border)] px-4 py-2.5 flex items-center justify-between shadow-xs">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 relative shrink-0">
            <Image
              src="/images/logo.png"
              alt="Seen Hijabi"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-sm font-serif font-medium tracking-tight text-[var(--foreground)]">
              Seen Hijabi
            </h1>
            <p className="text-[9px] text-[var(--muted-foreground)]">
              لوحة الإدارة &bull; Admin
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href={storeUrl}
            target="_blank"
            title="زيارة المتجر"
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="فتح القائمة الرئيسية"
            className="p-2 text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ─── Mobile Slide-over Drawer Backdrop & Panel (< lg) ─── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-[var(--card)] border-r border-[var(--border)] h-full flex flex-col justify-between p-4 shadow-xl z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 relative shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="Seen Hijabi"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-medium tracking-tight text-[var(--foreground)]">
                      Seen Hijabi
                    </h2>
                    <p className="text-[9px] text-[var(--muted-foreground)]">
                      لوحة الإدارة &bull; Admin Portal
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-sm transition-colors duration-150 ${
                        isActive
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "text-[var(--foreground)] hover:bg-[var(--muted)] active:bg-[var(--muted)]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-[var(--border)] space-y-2">
              <Link
                href={storeUrl}
                target="_blank"
                className="flex items-center justify-between px-3 py-2.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-sm transition-colors duration-150"
              >
                <span className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4" />
                  <span>زيارة المتجر | View Store</span>
                </span>
              </Link>

              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50/70 active:bg-red-100 rounded-sm transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج | Log Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── Desktop Fixed Sidebar (>= lg) ─── */}
      <aside className="hidden lg:flex w-64 bg-[var(--card)] border-r border-[var(--border)] min-h-screen sticky top-0 h-screen flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="px-3 py-2 border-b border-[var(--border)] pb-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 relative shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Seen Hijabi"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="text-base font-serif tracking-tight text-[var(--foreground)]">
                  Seen Hijabi
                </h2>
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  لوحة الإدارة &bull; Admin Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[var(--border)] space-y-2">
          <Link
            href={storeUrl}
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-sm transition-colors duration-150"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>زيارة المتجر | View Store</span>
            </span>
          </Link>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50/50 rounded-sm transition-colors duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج | Log Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
