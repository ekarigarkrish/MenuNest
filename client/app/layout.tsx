import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import CsrfProvider from "@/components/providers/CsrfProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MenuNest | Smart Restaurant Automation",
  description: "Automate your restaurant, increase sales, and delight customers with MenuNest's intelligent table-ordering system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <CsrfProvider>
            {children}
          </CsrfProvider>
        </QueryProvider>

        <Toaster position="top-right" richColors
          toastOptions={{
            style: {
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }
          }} />
      </body>
    </html>
  );
}