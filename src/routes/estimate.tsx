import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/estimate")({
  head: () => ({
    meta: [
      { title: "Project Estimator — Pedra & Luz" },
      {
        name: "description",
        content:
          "Compute a guiding budget range, phased plan, and realistic timeline for your project in two minutes.",
      },
      { property: "og:title", content: "Project Estimator — Pedra & Luz" },
      {
        property: "og:description",
        content:
          "Four questions. A guiding budget range, a phased plan, and a realistic timeline — transparent, like everything we build.",
      },
    ],
  }),
  component: EstimatePage,
});

// ── DATA ──────────────────────────────────────────────────────
type Service = { id: string; label: string; sub: string; baseL: number; baseH: number; wk: number };
type Location = { id: string; label: string; mult: number; cur: "EUR" | "USD" };
type Finish = { id: string; label: string; sub: string; mult: number };
type Addon = {
  id: string;
  label: string;
  sub: string;
  flatL?: number;
  flatH?: number;
  perL?: number;
  perH?: number;
  wk: number;
};

const SERVICES: Service[] = [
  { id: "newbuild", label: "New Home Build", sub: "Ground-up residential design tuned to site, climate, and life.", baseL: 1250, baseH: 1750, wk: 16 },
  { id: "remodel", label: "Remodeling", sub: "Transformations that honor the bones and rewrite the experience.", baseL: 620, baseH: 820, wk: 8 },
  { id: "addition", label: "Home Additions", sub: "New volumes that read as one with the original structure.", baseL: 950, baseH: 1400, wk: 10 },
  { id: "commercial", label: "Commercial", sub: "Restaurants, retail and workplaces designed to be lived in.", baseL: 550, baseH: 950, wk: 9 },
];

const LOCATIONS: Location[] = [
  { id: "lisbon", label: "Lisbon · Portugal", mult: 1.0, cur: "EUR" },
  { id: "california", label: "California · USA", mult: 2.4, cur: "USD" },
  { id: "intl", label: "International", mult: 1.4, cur: "EUR" },
];

const FINISHES: Finish[] = [
  { id: "essential", label: "Essential", sub: "Solid, functional, precisely built.", mult: 0.82 },
  { id: "premium", label: "Premium", sub: "Noble materials. Designed detail.", mult: 1.0 },
  { id: "signature", label: "Signature", sub: "One of a kind. No compromise.", mult: 1.55 },
];

const ADDONS: Addon[] = [
  { id: "energy", label: "Energy package", sub: "Solar · AC · heat pump · ventilation", flatL: 11000, flatH: 21000, wk: 3 },
  { id: "envelope", label: "Thermal envelope", sub: "External insulation + window replacement", perL: 95, perH: 150, wk: 4 },
  { id: "smart", label: "Smart home layer", sub: "Lighting, climate and security automation", flatL: 6000, flatH: 18000, wk: 2 },
];

const PHASES: [string, string, boolean][] = [
  ["01", "Initial Consultation", true],
  ["02", "Site Analysis", false],
  ["03", "Design Development", true],
  ["04", "Construction Documents", true],
  ["05", "Construction & Admin", false],
  ["06", "Completion & Handover", false],
];

const STEPS = ["Discipline", "Site", "Specification", "Estimate"];

function EstimatePage() {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [service, setService] = useState("remodel");
  const [location, setLocation] = useState("lisbon");
  const [finish, setFinish] = useState("premium");
  const [addons, setAddons] = useState<Set<string>>(new Set(["energy"]));
  const [area, setArea] = useState(140);

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const result = useMemo(() => {
    const svc = SERVICES.find((s) => s.id === service)!;
    const loc = LOCATIONS.find((l) => l.id === location)!;
    const fin = FINISHES.find((f) => f.id === finish)!;
    let low = area * svc.baseL;
    let high = area * svc.baseH;
    let weeks = svc.wk + Math.round(area / 25);
    for (const a of ADDONS) {
      if (!addons.has(a.id)) continue;
      if (a.perL && a.perH) {
        low += area * a.perL;
        high += area * a.perH;
      } else {
        low += a.flatL ?? 0;
        high += a.flatH ?? 0;
      }
      weeks += a.wk;
    }
    low = Math.round(low * fin.mult * loc.mult);
    high = Math.round(high * fin.mult * loc.mult);
    weeks = Math.min(weeks, 60);
    const fmt = (n: number) =>
      new Intl.NumberFormat(loc.cur === "USD" ? "en-US" : "pt-PT", {
        style: "currency",
        currency: loc.cur,
        maximumFractionDigits: 0,
      }).format(n);
    return { svc, loc, fin, low, high, weeks, fmt };
  }, [service, location, finish, addons, area]);

  return (
    <SiteLayout overHero>
      {/* Hero / dark band */}
      <section className="pt-32" style={{ backgroundColor: "var(--surface-darker)" }}>
        <div className="container-edge py-20 text-white">
          <p className="label-tag text-[var(--brass)]">Studio Intelligence</p>
          <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
            Your estimate.{" "}
            <span className="italic text-[var(--brass)]">Computed in two minutes.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            The same engine that runs our projects, working for you before the first call.
            Four questions. A guiding budget range, a phased plan, and a realistic timeline.
          </p>
        </div>
      </section>

      <section className="container-edge py-20">
        {step > 0 && step < 4 && <Progress current={step} />}

        {step === 0 && (
          <div className="max-w-3xl">
            <div className="mt-2 grid gap-10 sm:grid-cols-3">
              {[
                ["2 min", "to complete"],
                ["48 h", "to a refined number"],
                ["0", "obligation"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-4xl text-foreground">{n}</div>
                  <div className="label-tag mt-2 text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-12 inline-flex items-center gap-3 border border-[var(--brass)] bg-foreground px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-background transition-all hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
            >
              Start Estimate <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-3xl">
            <p className="label-tag text-[var(--brass-dark)]">What we do</p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">
              Four disciplines. <span className="italic text-[var(--brass-dark)]">Pick yours.</span>
            </h2>
            <div className="mt-10 space-y-3">
              {SERVICES.map((s, i) => (
                <Card
                  key={s.id}
                  num={`0${i + 1}`}
                  title={s.label}
                  sub={s.sub}
                  active={service === s.id}
                  onClick={() => setService(s.id)}
                />
              ))}
            </div>
            <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </div>
        )}

        {step === 2 && (
          <div className="max-w-3xl">
            <p className="label-tag text-[var(--brass-dark)]">Site analysis</p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">Where, and how much.</h2>
            <div className="mt-10 space-y-3">
              {LOCATIONS.map((l) => (
                <Card
                  key={l.id}
                  title={l.label}
                  active={location === l.id}
                  onClick={() => setLocation(l.id)}
                />
              ))}
            </div>
            <div className="mt-10">
              <p className="label-tag text-muted-foreground">Project area</p>
              <div className="font-display mt-3 text-5xl text-foreground">
                {area} <span className="text-2xl text-muted-foreground">m²</span>
              </div>
              <input
                type="range"
                min={20}
                max={600}
                step={5}
                value={area}
                onChange={(e) => setArea(parseInt(e.target.value))}
                className="mt-4 w-full accent-[var(--brass)]"
              />
            </div>
            <Nav onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}

        {step === 3 && (
          <div className="max-w-3xl">
            <p className="label-tag text-[var(--brass-dark)]">Specification</p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">Finish level & systems.</h2>
            <div className="mt-10 space-y-3">
              {FINISHES.map((f) => (
                <Card
                  key={f.id}
                  title={f.label}
                  sub={f.sub}
                  active={finish === f.id}
                  onClick={() => setFinish(f.id)}
                />
              ))}
            </div>
            <p className="label-tag mt-10 text-muted-foreground">Optional systems</p>
            <div className="mt-4 space-y-3">
              {ADDONS.map((a) => (
                <Card
                  key={a.id}
                  title={a.label}
                  sub={a.sub}
                  active={addons.has(a.id)}
                  onClick={() => toggleAddon(a.id)}
                />
              ))}
            </div>
            <Nav onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel="Compute Estimate" />
          </div>
        )}

        {step === 4 && (
          <div className="max-w-3xl">
            <p className="label-tag text-[var(--brass-dark)]">Studio Intelligence · Estimate</p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">
              Zero guesswork. <span className="italic text-[var(--brass-dark)]">Here's your range.</span>
            </h2>

            <div className="mt-10 border border-border bg-card p-8 shadow-[0_24px_70px_rgba(26,26,24,0.08)] md:p-10">
              <p className="label-tag text-muted-foreground">
                Project Sheet · {result.svc.label}
              </p>
              <div className="mt-3 h-[2px] w-10 bg-[var(--brass)]" />
              <div className="font-display mt-5 text-3xl text-foreground md:text-5xl">
                {result.fmt(result.low)} — {result.fmt(result.high)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Guiding range · excl. tax · refined by site analysis
              </p>

              <div className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
                <Stat label="Timeline" value={result.weeks} suffix="weeks" />
                <Stat label="Area" value={area} suffix="m²" />
                <Stat label="Finish" value={result.fin.label} />
              </div>

              <p className="label-tag mt-8 text-muted-foreground">
                The process — six steps, zero guesswork
              </p>
              <div className="mt-4 space-y-0">
                {PHASES.map(([n, name, ai]) => (
                  <div
                    key={n}
                    className="flex items-baseline gap-4 border-b border-dashed border-border py-3 last:border-b-0"
                  >
                    <span className="font-display min-w-[28px] text-lg text-[var(--brass-dark)]">{n}</span>
                    <span className="text-sm text-foreground">{name}</span>
                    {ai && (
                      <span className="ml-auto border border-[var(--brass)] px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--brass-dark)]">
                        AI-Assisted
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <hr className="my-8 border-0 border-t-2 border-[var(--brass)]" />

              <LeadForm
                onSubmitted={() => undefined}
                payload={{
                  service: result.svc.label,
                  location: result.loc.label,
                  finish: result.fin.label,
                  area,
                  addons: Array.from(addons),
                  low: result.low,
                  high: result.high,
                  currency: result.loc.cur,
                  weeks: result.weeks,
                }}
              />

              <p className="mt-6 text-[10px] leading-relaxed text-muted-foreground">
                Automated guidance produced by Pedra & Luz Studio Intelligence. Not a contractual
                proposal. All figures subject to on-site technical review.
              </p>
            </div>

            <button
              onClick={() => setStep(3)}
              className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function Progress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="mb-12 flex gap-2">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={s} className="flex-1">
            <div
              className="h-[2px]"
              style={{ backgroundColor: done || active ? "var(--brass)" : "var(--border)" }}
            />
            <div className="mt-2 flex items-center gap-2">
              <span
                className="font-display text-sm"
                style={{ color: active ? "var(--brass-dark)" : "var(--muted-foreground)" }}
              >
                {String(n).padStart(2, "0")}
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.14em]"
                style={{ color: active ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                {s}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Card({
  num,
  title,
  sub,
  active,
  onClick,
}: {
  num?: string;
  title: string;
  sub?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-4 border border-l-[3px] p-5 text-left transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground hover:border-foreground/40"
      }`}
      style={{ borderLeftColor: active ? "var(--brass)" : undefined }}
    >
      {num && (
        <span
          className="font-display pt-0.5 text-lg"
          style={{ color: "var(--brass)" }}
        >
          {num}
        </span>
      )}
      <span className="flex-1">
        <span className="block text-[15px] font-medium">{title}</span>
        {sub && (
          <span
            className="mt-1 block text-xs leading-relaxed"
            style={{ color: active ? "var(--brass)" : "var(--muted-foreground)" }}
          >
            {sub}
          </span>
        )}
      </span>
      {active && <Check className="h-4 w-4 text-[var(--brass)]" />}
    </button>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div>
      <div className="label-tag text-muted-foreground">{label}</div>
      <div className="font-display mt-1 text-2xl text-foreground">
        {value} {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function Nav({
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="mt-10 flex items-center justify-between">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-3 border border-[var(--brass)] bg-foreground px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-background transition-all hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
      >
        {nextLabel} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function LeadForm({
  payload,
  onSubmitted,
}: {
  payload: {
    service: string;
    location: string;
    finish: string;
    area: number;
    addons: string[];
    low: number;
    high: number;
    currency: string;
    weeks: number;
  };
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setSubmitting(true);
    const notes = [
      `Estimator submission`,
      `Service: ${payload.service}`,
      `Location: ${payload.location}`,
      `Area: ${payload.area} m²`,
      `Finish: ${payload.finish}`,
      `Add-ons: ${payload.addons.join(", ") || "—"}`,
      `Range: ${payload.low.toLocaleString()} — ${payload.high.toLocaleString()} ${payload.currency}`,
      `Timeline: ${payload.weeks} weeks`,
    ].join("\n");

    const { error } = await supabase.from("clients").insert({
      name: name.trim(),
      email: email.trim(),
      source: "estimator",
      status: "inquiry",
      service_type: payload.service,
      notes,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please email hello@pedroeluz.com");
      return;
    }
    setDone(true);
    onSubmitted();
    toast.success("Received. Your project sheet is on its way to our studio.");
  }

  if (done) {
    return (
      <p className="py-3 text-center text-sm text-[var(--brass-dark)]">
        ✓ Received. Your project sheet is on its way to our studio.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-display text-2xl text-foreground">Tell us about your project.</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Initial consultations are complimentary. We respond within one business day with a refined
        number.
      </p>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-5 block w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[var(--brass)]"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-3 block w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[var(--brass)]"
      />
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex w-full items-center justify-center gap-3 border border-[var(--brass)] bg-foreground px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-background transition-all hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)] disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Request Consultation <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
