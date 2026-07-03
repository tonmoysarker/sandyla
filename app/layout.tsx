import "./globals.css";
import { ThemeProvider } from "next-themes";
import { playfairDisplay, ebGaramond, hankenGrotesk } from "@/lib/fonts";
import { getSiteSettings } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/search/SearchOverlay";

export const metadata = {
  title: "Versos",
  description: "Palavras que florescem — poesia e portfólio criativo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSiteSettings();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${ebGaramond.variable} ${hankenGrotesk.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header nav={settings.nav} siteTitle={settings.siteTitle} />
          {children}
          <Footer settings={settings} />
          <SearchOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
