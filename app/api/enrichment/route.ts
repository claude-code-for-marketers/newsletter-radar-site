import { NextResponse } from "next/server";

type LeadInput = {
  email: string;
  name: string;
  phone: string;
  message: string;
};

type OrthogonalRunResponse = {
  success?: boolean;
  price?: string;
  data?: unknown;
  error?: unknown;
};

const ORTHOGONAL_RUN_URL = "https://api.orth.sh/v1/run";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "aol.com",
  "gmail.com",
  "googlemail.com",
  "hey.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "me.com",
  "msn.com",
  "outlook.com",
  "pm.me",
  "proton.me",
  "protonmail.com",
  "yahoo.com",
]);

const FIELD_LABELS: Record<keyof LeadInput, string> = {
  email: "Company email",
  name: "Name",
  phone: "Phone number",
  message: "Message",
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return validationError("Request body must be valid JSON.");
  }

  const parsed = parseLeadInput(body);

  if (!parsed.ok) {
    return validationError(parsed.message);
  }

  const apiKey = process.env.ORTHOGONAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: {
          code: "missing_orthogonal_api_key",
          message:
            "ORTHOGONAL_API_KEY is not configured. Add it to .env.local before calling live enrichment.",
        },
      },
      { status: 500 },
    );
  }

  const submittedLead = parsed.value;
  const domain = getEmailDomain(submittedLead.email);
  const { firstName, lastName } = splitName(submittedLead.name);
  const warnings: string[] = [];

  const peopleRequest = runApollo(apiKey, {
    path: "/api/v1/people/match",
    body: {
      email: submittedLead.email,
      first_name: firstName,
      last_name: lastName,
      domain,
      reveal_personal_emails: false,
      reveal_phone_number: false,
    },
  });

  const organizationRequest = runApollo(apiKey, {
    path: "/api/v1/organizations/enrich",
    method: "GET",
    query: { domain },
  });

  const [peopleResult, organizationResult] = await Promise.allSettled([
    peopleRequest,
    organizationRequest,
  ]);

  const people = unwrapRunResult(peopleResult, "person", warnings);
  const organization = unwrapRunResult(organizationResult, "organization", warnings);

  if (!people.data && !organization.data) {
    return NextResponse.json(
      buildDemoResult(submittedLead, domain, warnings.length ? warnings : ["Orthogonal enrichment did not return usable data."]),
    );
  }

  return NextResponse.json({
    mode: "live",
    submittedLead: {
      ...submittedLead,
      domain,
    },
    person: pickNestedData(people.data, ["person", "contact", "match"]),
    organization: pickNestedData(organization.data, ["organization", "account", "company"]),
    raw: {
      person: people.data,
      organization: organization.data,
    },
    warnings,
    price: sumPrices([people.price, organization.price]),
  });
}

function parseLeadInput(body: unknown):
  | { ok: true; value: LeadInput }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Request body must be an object." };
  }

  const source = body as Record<string, unknown>;
  const value = {
    email: cleanField(source.email),
    name: cleanField(source.name),
    phone: cleanField(source.phone),
    message: cleanField(source.message),
  };

  for (const [key, label] of Object.entries(FIELD_LABELS) as [keyof LeadInput, string][]) {
    if (!value[key]) {
      return { ok: false, message: `${label} is required.` };
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
    return { ok: false, message: "Use a valid company email address." };
  }

  const domain = getEmailDomain(value.email);

  if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return {
      ok: false,
      message: "Use a company email address so we can enrich the right account.",
    };
  }

  return { ok: true, value };
}

function cleanField(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 2000) : "";
}

function getEmailDomain(email: string) {
  return email.toLowerCase().split("@").at(1)?.replace(/^www\./, "") ?? "";
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

async function runApollo(
  apiKey: string,
  payload: {
    path: string;
    method?: "GET" | "POST";
    query?: Record<string, string>;
    body?: Record<string, string | boolean>;
  },
): Promise<OrthogonalRunResponse> {
  const response = await fetch(ORTHOGONAL_RUN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api: "apollo",
      ...payload,
    }),
  });

  const data = (await response.json().catch(() => null)) as OrthogonalRunResponse | null;

  if (!response.ok) {
    throw new Error(formatOrthogonalError(response.status, data));
  }

  if (!data?.success) {
    throw new Error(formatOrthogonalError(response.status, data));
  }

  return data;
}

function formatOrthogonalError(status: number, data: OrthogonalRunResponse | null) {
  if (data?.error) {
    return `Orthogonal returned ${status}: ${JSON.stringify(data.error)}`;
  }

  return `Orthogonal returned ${status}.`;
}

function unwrapRunResult(
  result: PromiseSettledResult<OrthogonalRunResponse>,
  label: string,
  warnings: string[],
) {
  if (result.status === "rejected") {
    warnings.push(`${label} enrichment failed: ${result.reason instanceof Error ? result.reason.message : "Unknown error"}`);
    return { data: null, price: undefined };
  }

  return {
    data: result.value.data ?? null,
    price: result.value.price,
  };
}

function pickNestedData(data: unknown, keys: string[]) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  const objectData = data as Record<string, unknown>;

  for (const key of keys) {
    if (objectData[key]) {
      return objectData[key];
    }
  }

  return data;
}

function sumPrices(prices: Array<string | undefined>) {
  const total = prices.reduce((sum, price) => {
    const value = price ? Number.parseFloat(price) : 0;
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  return total > 0 ? `$${total.toFixed(2)}` : undefined;
}

function buildDemoResult(submittedLead: LeadInput, domain: string, warnings: string[]) {
  return {
    mode: "demo",
    submittedLead: {
      ...submittedLead,
      domain,
    },
    person: {
      name: submittedLead.name,
      email: submittedLead.email,
      phone: submittedLead.phone,
      title: "Head of Growth",
      seniority: "head",
      linkedin_url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(submittedLead.name)}`,
    },
    organization: {
      name: titleizeDomain(domain),
      website_url: `https://${domain}`,
      primary_domain: domain,
      industry: "Software",
      estimated_num_employees: "51-200",
      short_description:
        "Demo fallback data shown because live Apollo enrichment was unavailable during this request.",
    },
    raw: {
      person: null,
      organization: null,
    },
    warnings: [
      "Demo fallback is visible to keep the workshop flow moving. Do not treat it as verified lead data.",
      ...warnings,
    ],
    price: undefined,
  };
}

function titleizeDomain(domain: string) {
  return domain
    .split(".")[0]
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function validationError(message: string) {
  return NextResponse.json(
    {
      error: {
        code: "invalid_enrichment_request",
        message,
      },
    },
    { status: 400 },
  );
}
