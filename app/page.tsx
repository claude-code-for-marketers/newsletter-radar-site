const NAV = [
  { label: "How it works", href: "#how" },
  { label: "Example", href: "#example" },
  { label: "Compare", href: "#compare" },
  { label: "Coverage", href: "#coverage" },
];

const CONTACT_SALES_PATH = "/contact-sales";

const PILLARS = [
  {
    tag: "01 · COMPETITOR FOOTPRINT",
    claim: "Enter a company. See every newsletter it sponsors.",
    body: "Recency, frequency, and the actual creative — not a seller's directory you reverse-engineer by hand. Benchmark share-of-voice across a whole competitive set in one view.",
    proof: "answers: \"where is everyone advertising?\"",
  },
  {
    tag: "02 · PLACEMENT PLAN",
    claim: "Turn the footprint into a buy.",
    body: "Given your category, competitors, and budget, get a ranked shortlist of newsletters to test next — including the ones your competitors own that you're missing. A media plan, not a lead list.",
    proof: "answers: \"where should we spend?\"",
  },
  {
    tag: "03 · FRESHNESS",
    claim: "What's running this week, not a stale archive.",
    body: "Surface who started advertising recently and what's live now. The incumbents skew historical; you shouldn't have to date-check an archive before you trust it.",
    proof: "answers: \"what changed?\"",
  },
];

// ● buy-side native · ◐ buy-side as a byproduct · ○ sell-side / publishers
const COMPARE = [
  { name: "Who Sponsors Stuff", pub: "●", adv: "○", live: "○", q: "who can I pitch?" },
  { name: "SponsorGap", pub: "●", adv: "◐", live: "●", q: "who's spending?" },
  { name: "Appeared.in", pub: "●", adv: "◐", live: "●", q: "who's spending, nicely?" },
  { name: "Paved Radar", pub: "●", adv: "○", live: "●", q: "who can I pitch, at scale?" },
  { name: "Newsletter Radar", pub: "○", adv: "●", live: "●", q: "where should WE spend?", us: true },
];

const FOOTPRINT = `$ radar footprint --brand "hampton-goods" --window 90d

  BRAND        hampton-goods
  WINDOW       trailing 90 days
  PLACEMENTS   14 runs across 9 newsletters

  NEWSLETTER          VERTICAL     RUNS   LAST SEEN   SHARE OF VOICE
  ----------------------------------------------------------------------
  Morning Brew        business       4    3d ago      ####------  31%
  The Hustle          business       3    6d ago      ###-------  22%
  Milk Road           crypto         2    9d ago      ##--------  15%
  Not Boring          tech           2    12d ago     ##--------  14%
  TheSkimm            lifestyle      1    21d ago     #---------   8%
  +4 more                                             ...

  ! 3 newsletters two of your competitors run that you don't.
    run \`radar gaps\` for the placement plan ->`;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ---------- header ---------- */}
      <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2 font-mono text-sm">
            <span className="text-accent">●</span>
            <span className="font-medium tracking-tight">newsletter radar</span>
          </a>
          <nav className="hidden items-center gap-7 font-mono text-xs text-muted sm:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={CONTACT_SALES_PATH}
            className="font-mono text-xs text-accent transition-colors hover:text-foreground"
          >
            request access →
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-4xl flex-1 px-6">
        {/* ---------- hero ---------- */}
        <section className="border-b border-line py-24 sm:py-32">
          <p className="font-mono text-xs tracking-widest text-muted">
            NEWSLETTER SPONSORSHIP INTELLIGENCE · <span className="text-accent">PRE-LAUNCH</span>
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Every newsletter your competitor sponsors, in one query.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            Most tools in this category help newsletters find advertisers to pitch.
            Newsletter Radar is built only for the other side — the brand deciding where to spend.
            Competitor footprint, share-of-voice, and a ranked placement plan.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href={CONTACT_SALES_PATH}
              className="bg-accent px-5 py-2.5 font-mono text-sm font-medium text-[#06140b] transition-opacity hover:opacity-90"
            >
              Request early access
            </a>
            <a
              href="#example"
              className="border border-line px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-muted"
            >
              See a sample lookup
            </a>
          </div>
        </section>

        {/* ---------- the flip ---------- */}
        <section id="how" className="grid gap-10 border-b border-line py-20 sm:grid-cols-[180px_1fr]">
          <p className="font-mono text-xs tracking-widest text-muted">THE FLIP</p>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              The data exists. It’s just pointed at the wrong person.
            </h2>
            <p className="mt-5 leading-8 text-muted">
              Who Sponsors Stuff, SponsorGap, Appeared.in, Paved Radar — they track which brands
              sponsor which newsletters, mostly to help publishers find advertisers to pitch.
              Read the same index in reverse and it answers the two questions an advertiser actually has.
            </p>
            <pre className="mt-8 overflow-x-auto border border-line bg-surface p-5 font-mono text-xs leading-6 text-muted sm:text-sm">
{`  sell-side (incumbents)         buy-side (newsletter radar)
  ----------------------         ---------------------------
  newsletter  ->  advertisers    brand       ->  its newsletters
  "who can I pitch?"             "where has this brand advertised?"
                                 budget      ->  ranked placements
                                 "where should we spend next?"`}
            </pre>
          </div>
        </section>

        {/* ---------- pillars ---------- */}
        <section className="border-b border-line py-20">
          <p className="font-mono text-xs tracking-widest text-muted">WHAT IT DOES</p>
          <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.tag} className="flex flex-col bg-background p-6">
                <p className="font-mono text-[11px] tracking-wider text-accent">{p.tag}</p>
                <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">{p.claim}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted">{p.body}</p>
                <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-muted">
                  {p.proof}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- example / flourish ---------- */}
        <section id="example" className="border-b border-line py-20">
          <p className="font-mono text-xs tracking-widest text-muted">SAMPLE OUTPUT</p>
          <h2 className="mt-6 max-w-2xl text-2xl font-semibold tracking-tight">
            A competitor’s full newsletter footprint, ranked by spend.
          </h2>
          <p className="mt-4 max-w-xl leading-8 text-muted">
            One company in, every placement out — with the gaps your competitors own already flagged.
          </p>
          <pre className="mt-8 overflow-x-auto border border-line bg-surface p-5 font-mono text-[11px] leading-5 sm:text-[13px] sm:leading-6">
            <code className="text-foreground">{FOOTPRINT}</code>
          </pre>
          <p className="mt-3 font-mono text-[11px] text-muted">
            Illustrative output. Coverage varies by vertical — see below.
          </p>
        </section>

        {/* ---------- compare ---------- */}
        <section id="compare" className="border-b border-line py-20">
          <p className="font-mono text-xs tracking-widest text-muted">WHERE WE SIT</p>
          <h2 className="mt-6 max-w-2xl text-2xl font-semibold tracking-tight">
            Same category. Opposite end of the market.
          </h2>
          <div className="mt-8 overflow-x-auto border border-line">
            <table className="w-full border-collapse font-mono text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="px-4 py-3 font-normal">Tool</th>
                  <th className="px-4 py-3 text-center font-normal">Publishers</th>
                  <th className="px-4 py-3 text-center font-normal">Advertisers</th>
                  <th className="px-4 py-3 text-center font-normal">Real-time</th>
                  <th className="px-4 py-3 font-normal">The question it answers</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr
                    key={row.name}
                    className={`border-b border-line last:border-0 ${
                      row.us ? "bg-surface text-foreground" : "text-muted"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className={row.us ? "text-accent" : ""}>{row.name}</span>
                    </td>
                    <td className="px-4 py-3 text-center">{row.pub}</td>
                    <td className={`px-4 py-3 text-center ${row.us ? "text-accent" : ""}`}>{row.adv}</td>
                    <td className="px-4 py-3 text-center">{row.live}</td>
                    <td className="px-4 py-3">{row.q}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted">
            ● native · ◐ a byproduct · ○ not really. Based on each tool’s public positioning.
          </p>
        </section>

        {/* ---------- coverage / honesty ---------- */}
        <section id="coverage" className="grid gap-10 border-b border-line py-20 sm:grid-cols-[180px_1fr]">
          <p className="font-mono text-xs tracking-widest text-muted">WHAT WE WON’T CLAIM</p>
          <ul className="max-w-2xl space-y-6">
            <li>
              <h3 className="font-medium">Coverage is finite — for everyone.</h3>
              <p className="mt-2 leading-7 text-muted">
                We track the newsletters that matter in a vertical, not the entire internet. If one you
                care about is missing, tell us and we’ll add it. No tool in this category covers them all.
              </p>
            </li>
            <li>
              <h3 className="font-medium">We show spend and presence — not conversions.</h3>
              <p className="mt-2 leading-7 text-muted">
                You’ll see where competitors advertise and how often. We don’t claim to know what’s
                working for them unless we can actually measure the outcome.
              </p>
            </li>
            <li>
              <h3 className="font-medium">It’s a planning tool, not a lead list.</h3>
              <p className="mt-2 leading-7 text-muted">
                If you’re a publisher hunting for advertisers to pitch, the incumbents are built for you.
                We’re for the buyer.
              </p>
            </li>
          </ul>
        </section>

        {/* ---------- access ---------- */}
        <section id="access" className="py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Request early access.</h2>
            <p className="mt-5 leading-8 text-muted">
              We’re onboarding design-partner advertisers a vertical at a time. Tell us the category you
              buy in and one competitor you’d want to look up first — we’ll prioritize coverage and get
              you in.
            </p>
            <a
              href={CONTACT_SALES_PATH}
              className="mt-8 inline-block bg-accent px-5 py-2.5 font-mono text-sm font-medium text-[#06140b] transition-opacity hover:opacity-90"
            >
              Contact sales →
            </a>
          </div>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            <span className="text-accent">●</span> newsletter radar
          </span>
          <span>sponsorship intelligence for the buy side · status: pre-launch</span>
        </div>
      </footer>
    </div>
  );
}
