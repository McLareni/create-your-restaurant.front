import { Geist } from "next/font/google";
import { QueryProvider } from "@/shared/providers/queryProvider";
import { ThemeProvider } from "@/shared/providers/themeProvider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
});

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