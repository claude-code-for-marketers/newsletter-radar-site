import Link from "next/link";
import { ContactSalesForm } from "./contact-sales-form";

export const metadata = {
  title: "Contact Sales - Newsletter Radar",
  description:
    "Talk to Newsletter Radar sales about newsletter sponsorship intelligence for advertisers.",
};

export default function ContactSalesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm">
            <span className="text-accent">●</span>
            <span className="font-medium tracking-tight">newsletter radar</span>
          </Link>
          <Link href="/" className="font-mono text-xs text-muted transition-colors hover:text-foreground">
            back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-4xl flex-1 gap-10 px-6 py-16 lg:grid-cols-[1fr_420px] lg:py-24">
        <section>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Talk to our sales team.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            Get a custom walkthrough of Newsletter Radar. See how your team can benchmark competitor
            newsletter sponsorships and build a better placement plan.
          </p>
          <dl className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-3 lg:grid-cols-1">
            <div>
              <dt className="font-mono text-xs text-accent">1,000+</dt>
              <dd className="mt-2 text-sm leading-6 text-muted">newsletters tracked across core B2B categories</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-accent">2-way</dt>
              <dd className="mt-2 text-sm leading-6 text-muted">search by advertiser or newsletter</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-accent">retention</dt>
              <dd className="mt-2 text-sm leading-6 text-muted">repeat sponsorship signals for smarter buying</dd>
            </div>
          </dl>
        </section>

        <section aria-label="Contact sales form">
          <ContactSalesForm />
        </section>
      </main>
    </div>
  );
}
