import path from "path";
import { parseMdxFile } from "@/lib/mdx";
import { z } from "zod";
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";
import { VineDivider } from "@/components/ui/ornaments/VineDivider";

const AboutFrontmatterSchema = z.object({ title: z.string() });

export const metadata = {
  title: "Sobre Mim | Versos",
  description: "Apaixonada por palavras, natureza e tudo que toca a alma.",
};

export default function SobrePage() {
  const filePath = path.join(process.cwd(), "content/pages/about.mdx");
  const { frontmatter, content } = parseMdxFile(filePath, AboutFrontmatterSchema);

  return (
    <main className="mx-auto grid max-w-3xl gap-flow-xl px-flow-s py-flow-xl md:grid-cols-[1fr_2fr] md:items-start md:px-flow-l">
      <div className="mx-auto w-full max-w-[16rem] md:sticky md:top-24">
        <ArchFrame>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about-portrait.svg"
            alt="Retrato da autora"
            className="h-full w-full object-cover"
          />
        </ArchFrame>
      </div>
      <div>
        <h1 className="font-display text-fluid-2xl text-accent">{frontmatter.title}</h1>
        <VineDivider className="mx-0 w-40" />
        <div className="drop-cap space-y-flow-m font-body text-fluid-base leading-[1.8] text-ink/90">
          {content.trim().split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
