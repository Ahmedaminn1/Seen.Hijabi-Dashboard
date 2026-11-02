import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "لوحة تحكم سين | Seen Hijabi Admin Dashboard",
  description: "لوحة التحكم الإدارية لمتجر سين للحجاب والأزياء",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
