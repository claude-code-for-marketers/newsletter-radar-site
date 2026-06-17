"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type EnrichmentApiResponse = {
  error?: {
    code: string;
    message: string;
  };
  mode?: "live" | "demo";
};

const RESULT_STORAGE_KEY = "newsletter-radar:last-enrichment-result";

export function ContactSalesForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/enrichment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as EnrichmentApiResponse;

      if (!response.ok || data.error) {
        setError(data.error?.message ?? "Enrichment failed. Try again.");
        return;
      }

      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(data));
      router.push("/enrichment-result");
    } catch {
      setError("The enrichment request could not be sent. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-surface p-5 sm:p-6">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="font-mono text-xs text-muted">Company email</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="border border-line bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-mono text-xs text-muted">Name</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Morgan"
            className="border border-line bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-mono text-xs text-muted">Phone number</span>
          <input
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 012 1984"
            className="border border-line bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-mono text-xs text-muted">How can we help?</span>
          <textarea
            required
            name="message"
            rows={6}
            placeholder="Tell us about your category, competitors, or newsletter buying plans."
            className="resize-y border border-line bg-background px-4 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent px-5 py-3 font-mono text-sm font-medium text-[#06140b] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Talk to sales"}
        </button>
        <p className="font-mono text-[11px] leading-5 text-muted">
          We&apos;ll use this to route your request and follow up.
        </p>
      </div>
    </form>
  );
}
