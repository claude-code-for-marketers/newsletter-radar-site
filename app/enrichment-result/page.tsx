import Link from "next/link";
import { EnrichmentResultView } from "./enrichment-result-view";

export const metadata = {
  title: "Enriched Lead Preview - Newsletter Radar",
  description: "Preview the Apollo enrichment result returned by the contact sales workflow.",
};

export default function EnrichmentResultPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm">
            <span className="text-accent">●</span>
            <span className="font-medium tracking-tight">newsletter radar</span>
          </Link>
          <Link href="/contact-sales" className="font-mono text-xs text-muted transition-colors hover:text-foreground">
            new enrichment
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <EnrichmentResultView />
      </main>
    </div>
  );
}
