"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

type EnrichmentResult = {
  mode: "live" | "demo";
  submittedLead: Record<string, unknown>;
  person: unknown;
  organization: unknown;
  raw: unknown;
  warnings?: string[];
  price?: string;
};

const RESULT_STORAGE_KEY = "newsletter-radar:last-enrichment-result";

export function EnrichmentResultView() {
  const result = useSyncExternalStore(subscribeToResult, getStoredResult, getServerResult);

  if (!result) {
    return (
      <div className="border border-line bg-surface p-6">
        <p className="font-mono text-xs tracking-widest text-muted">NO PREVIEW FOUND</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Submit the contact sales form first.</h1>
        <p className="mt-4 leading-7 text-muted">
          Enriched lead previews are stored only in this browser session. Nothing is saved yet.
        </p>
        <Link
          href="/contact-sales"
          className="mt-7 inline-block bg-accent px-5 py-2.5 font-mono text-sm font-medium text-[#06140b] transition-opacity hover:opacity-90"
        >
          Go to contact sales
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border border-line bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs tracking-widest text-muted">ENRICHED LEAD PREVIEW</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Account and contact context</h1>
          </div>
          <span
            className={`w-fit border px-3 py-1 font-mono text-xs ${
              result.mode === "live"
                ? "border-accent text-accent"
                : "border-yellow-400/60 text-yellow-200"
            }`}
          >
            {result.mode === "live" ? "live Apollo data" : "demo fallback data"}
          </span>
        </div>
        <p className="mt-5 max-w-2xl leading-7 text-muted">
          Preview only, not saved. Use this page to inspect what the workflow returned before any
          scoring, CRM sync, or outreach happens.
        </p>
        {result.price ? (
          <p className="mt-4 font-mono text-xs text-muted">Orthogonal estimated cost: {result.price}</p>
        ) : null}
      </div>

      {result.warnings?.length ? (
        <section className="border border-yellow-400/40 bg-yellow-400/10 p-5">
          <p className="font-mono text-xs tracking-widest text-yellow-200">WARNINGS</p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-yellow-100">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border border-line bg-surface p-5">
        <p className="font-mono text-xs tracking-widest text-muted">RESPONSE</p>
        <div className="mt-5 overflow-x-auto border border-line bg-background p-4">
          <JsonTree name="enrichment" value={result} defaultOpen />
        </div>
      </section>
    </div>
  );
}

let cachedStoredResult: string | null = null;
let cachedParsedResult: EnrichmentResult | null = null;

function subscribeToResult() {
  return () => {};
}

function getServerResult() {
  return null;
}

function getStoredResult() {
  const stored = sessionStorage.getItem(RESULT_STORAGE_KEY);

  if (stored === cachedStoredResult) {
    return cachedParsedResult;
  }

  cachedStoredResult = stored;

  if (!stored) {
    cachedParsedResult = null;
    return cachedParsedResult;
  }

  try {
    cachedParsedResult = JSON.parse(stored) as EnrichmentResult;
  } catch {
    sessionStorage.removeItem(RESULT_STORAGE_KEY);
    cachedStoredResult = null;
    cachedParsedResult = null;
  }

  return cachedParsedResult;
}

function JsonTree({
  name,
  value,
  defaultOpen = false,
}: {
  name: string;
  value: unknown;
  defaultOpen?: boolean;
}) {
  if (Array.isArray(value)) {
    return (
      <details open={defaultOpen} className="font-mono text-xs leading-6">
        <summary className="cursor-pointer text-muted">
          <span className="text-accent">&quot;{name}&quot;</span>: [
          <span className="text-muted">{value.length}</span>]
        </summary>
        <div className="ml-4 border-l border-line pl-4">
          {value.length ? (
            value.map((item, index) => (
              <JsonTree key={`${name}-${index}`} name={String(index)} value={item} defaultOpen={false} />
            ))
          ) : (
            <JsonPrimitive name="" value="[]" />
          )}
        </div>
      </details>
    );
  }

  if (isRecord(value)) {
    const entries = Object.entries(value);

    return (
      <details open={defaultOpen} className="font-mono text-xs leading-6">
        <summary className="cursor-pointer text-muted">
          <span className="text-accent">&quot;{name}&quot;</span>: {"{"}
          <span className="text-muted">{entries.length}</span>
          {"}"}
        </summary>
        <div className="ml-4 border-l border-line pl-4">
          {entries.length ? (
            entries.map(([key, nestedValue]) => (
              <JsonTree key={key} name={key} value={nestedValue} defaultOpen={isImportantTopLevelKey(key)} />
            ))
          ) : (
            <JsonPrimitive name="" value="{}" />
          )}
        </div>
      </details>
    );
  }

  return <JsonPrimitive name={name} value={value} />;
}

function JsonPrimitive({ name, value }: { name: string; value: unknown }) {
  return (
    <div className="font-mono text-xs leading-6">
      {name ? <span className="text-accent">&quot;{name}&quot;</span> : null}
      {name ? <span className="text-muted">: </span> : null}
      <span className={primitiveClassName(value)}>{formatPrimitive(value)}</span>
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isImportantTopLevelKey(key: string) {
  return key === "submittedLead" || key === "person" || key === "organization" || key === "warnings";
}

function primitiveClassName(value: unknown) {
  if (typeof value === "string") {
    return "text-foreground";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return "text-accent";
  }

  return "text-muted";
}

function formatPrimitive(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}
