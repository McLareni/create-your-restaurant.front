import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QueryProvider } from "@/shared/providers/queryProvider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gastro | Управління закладом",
  description: "Платформа для управління ресторанами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={geist.className}>
      <body className="min-h-screen antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}