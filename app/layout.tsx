import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/languageProvider";
import { ThemeProvider } from "@/components/themeProvider";
import { messages, type Locale } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get("planify-locale")?.value;
  const text = messages[locale === "en" ? "en" : "so"];
  return { title: text.pageTitle, description: text.pageDescription };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieLocale = (await cookies()).get("planify-locale")?.value;
  const locale: Locale = cookieLocale === "en" ? "en" : "so";
  const cookieTheme = (await cookies()).get("planify-theme")?.value;
  const theme = cookieTheme === "dark" ? "dark" : "light";

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
