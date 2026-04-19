import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rent my Gear",
  description: "Marketplace premium de renta de equipo con fallback de imágenes AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${manrope.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-app-gradient text-slate-900">
        <div className="min-h-screen">
          {children}
          <Toaster richColors closeButton position="top-right" />
        </div>
      </body>
    </html>
  );
}
