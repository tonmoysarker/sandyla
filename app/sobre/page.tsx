import path from "path";
import { parseMdxFile } from "@/lib/mdx";
import { z } from "zod";
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";

const AboutFrontmatterSchema = z.object({ title: z.string() });

export const metadata = {
  title: "Sobre Mim | Versos",
  description: "Apaixonada por palavras, natureza e tudo que toca a alma.",
};

export default function SobrePage() {
  const filePath = path.join(process.cwd(), "content/pages/about.mdx");
  const { frontmatter, content } = parseMdxFile(filePath, AboutFrontmatterSchema);

  return (
    <main className="mx-auto grid max-w-3xl gap-10 px-6 py-16 md:grid-cols-[1fr_2fr] md:items-start">
      <ArchFrame>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about-portrait.svg" alt="Retrato da autora" className="h-full w-full object-cover" />
      </ArchFrame>
      <div>
        <h1 className="font-display text-fluid-2xl text-accent">{frontmatter.title}</h1>
        <div className="mt-6 font-body text-fluid-md leading-relaxed text-ink/90">
          {content.trim().split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
