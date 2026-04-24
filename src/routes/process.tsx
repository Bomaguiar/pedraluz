import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Sparkles } from "lucide-react";
import img from "@/assets/featured-project.jpg";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "The Process — Pedro & Luz" },
      { name: "description", content: "Seven steps from initial consultation to project completion. Zero guesswork." },
      { property: "og:title", content: "The Process — Pedro & Luz" },
      { property: "og:description", content: "Seven steps. Zero guesswork. AI-accelerated where it counts." },
      { property: "og:image", content: img },
    ],
  }),
  component: ProcessPage,
});

const STEPS = [
  { n: "01", t: "Initial Consultation", d: "Understand your vision, budget, and requirements. We listen first.", ai: true, aiDesc: "AI summarizes meeting notes into a structured design brief in minutes, not days." },
  { n: "02", t: "Site Analysis", d: "Assess topography, orientation, views, and constraints." },
  { n: "03", t: "Design Development", d: "Collaborative sketching until you love the direction.", ai: true, aiDesc: "Generative tools produce 50+ massing studies overnight, expanding the option space dramatically." },
  { n: "04", t: "Construction Documents", d: "Detailed specs: materials, finishes, dimensions.", ai: true, aiDesc: "Automated material take-offs and code-compliance checks compress documentation time." },
  { n: "05", t: "Contractor Selection", d: "Curated shortlist or your own — we advise either way." },
  { n: "06", t: "Construction Admin", d: "On-site oversight, schedule adherence, budget control." },
  { n: "07", t: "Project Completion", d: "Final inspection, punch list, handover with pride." },
];

function ProcessPage() {
  return (
    <SiteLayout overHero>
      <PageHero
        label="The Process"
        title="Seven steps. Zero guesswork."
        subtitle="A methodical pipeline from first conversation to handover. AI accelerates where it adds clarity — never where it dilutes craft."
        image={img}
      />

      <section className="container-edge py-24">
        <div className="space-y-px">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="grid grid-cols-1 gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-12"
              style={i === STEPS.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}
            >
              <div className="md:col-span-2">
                <div className="font-display text-6xl text-[var(--brass-dark)] md:text-7xl">
                  {s.n}
                </div>
              </div>
              <div className="md:col-span-4">
                <h2 className="font-display text-3xl md:text-4xl">{s.t}</h2>
                {s.ai && (
                  <span className="mt-3 inline-flex items-center gap-1.5 border border-[var(--brass)]/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--brass-dark)]">
                    <Sparkles className="h-3 w-3" /> AI-Assisted
                  </span>
                )}
              </div>
              <div className="md:col-span-6">
                <p className="text-base leading-relaxed text-foreground">{s.d}</p>
                {s.aiDesc && (
                  <p className="mt-4 border-l-2 border-[var(--brass)] pl-4 text-sm text-muted-foreground">
                    {s.aiDesc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
