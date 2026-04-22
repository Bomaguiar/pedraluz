import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Check, ArrowRight } from "lucide-react";

interface Props {
  label: string;
  title: string;
  subtitle: string;
  image: string;
  overview: string;
  deliverables: string[];
  steps: { n: string; t: string; d: string }[];
  faqs: { q: string; a: string }[];
}

export function ServicePageTemplate({
  label,
  title,
  subtitle,
  image,
  overview,
  deliverables,
  steps,
  faqs,
}: Props): ReactNode {
  return (
    <SiteLayout overHero>
      <PageHero label={label} title={title} subtitle={subtitle} image={image} />

      {/* Overview */}
      <section className="container-edge py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="label-tag text-[var(--brass-dark)]">Overview</p>
            <h2 className="font-display mt-4 text-3xl leading-tight md:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {overview}
            </p>
          </div>
          <div className="md:pt-12">
            <p className="heading-section text-[var(--brass-dark)]">Key Deliverables</p>
            <ul className="mt-6 space-y-4">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 border-b border-border pb-4">
                  <Check className="mt-1 h-4 w-4 text-[var(--brass-dark)]" />
                  <span className="text-sm text-foreground">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-y" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-edge py-24">
          <p className="label-tag text-[var(--brass-dark)]">How we deliver</p>
          <h2 className="font-display mt-4 text-3xl md:text-5xl">Service-specific process</h2>

          <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="bg-[var(--surface)] p-8">
                <div className="font-display text-4xl text-[var(--brass-dark)]">{s.n}</div>
                <h3 className="mt-4 text-base font-medium">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-edge py-24">
        <p className="label-tag text-[var(--brass-dark)]">Common Questions</p>
        <h2 className="font-display mt-4 text-3xl md:text-5xl">Frequently asked</h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                {f.q}
                <span className="text-2xl text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="text-white"
        style={{ backgroundColor: "var(--surface-darker)" }}
      >
        <div className="container-edge py-24 text-center">
          <h2 className="font-display mx-auto max-w-3xl text-4xl md:text-6xl">Ready to start?</h2>
          <p className="mx-auto mt-6 max-w-xl text-white/65">
            Initial consultations are complimentary. We respond within one business day.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-3 border border-[var(--brass)] px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] transition-all hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
          >
            Book Consultation <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
