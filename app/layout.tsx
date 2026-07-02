import "./globals.css";
import { playfairDisplay, ebGaramond, hankenGrotesk } from "@/lib/fonts";

export const metadata = {
  title: "Versos",
  description: "Palavras que florescem — poesia e portfólio criativo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${playfairDisplay.variable} ${ebGaramond.variable} ${hankenGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
