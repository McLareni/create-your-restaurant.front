import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QueryProvider } from "@/shared/providers/queryProvider";
import { ThemeProvider } from "@/shared/providers/themeProvider";
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
    <html lang="uk" className={geist.className} suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className="min-h-screen antialiased bg-brand-cream text-brand-espresso dark:bg-brand-espresso dark:text-brand-cream transition-colors duration-300"
      >
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}