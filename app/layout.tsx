import type React from "react";
import type { Metadata } from "next";
import { Monoton, Monofett, Roboto, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/auth-context";
import { ShopProvider } from "@/contexts/shop-context";
import { Suspense } from "react";
import "./globals.css";
const geistSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "100",
});

const geistMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "100",
});

export const metadata: Metadata = {
  title: "AdautoStore - Tu tienda favorita",
  description:
    "Encuentra los mejores productos de tecnología, ropa, hogar y más",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <ShopProvider>{children}</ShopProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
