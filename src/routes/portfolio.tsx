import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import featuredImg from "@/assets/featured-project.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Pedro & Luz" },
      { name: "description", content: "Selected residential, commercial, and addition projects across Portugal and California." },
      { property: "og:title", content: "Portfolio — Pedro & Luz" },
      { property: "og:description", content: "Selected projects across residential, commercial, addition, and remodel." },
      { property: "og:image", content: featuredImg },
    ],
  }),
  component: PortfolioPage,
});

type ProjectType = "Residential" | "Commercial" | "Addition" | "Remodel";

const PROJECTS: { name: string; type: ProjectType; year: string; location: string; img: string }[] = [
  { name: "Hillcrest Residence", type: "Residential", year: "2024", location: "Santa Barbara, CA", img: p1 },
  { name: "Oak & Concrete House", type: "Residential", year: "2024", location: "Greater Lisbon", img: p2 },
  { name: "Príncipe Real Townhouse", type: "Remodel", year: "2023", location: "Lisbon", img: p3 },
  { name: "Cellar No. 7", type: "Commercial", year: "2023", location: "Cascais", img: p4 },
  { name: "Coachella Pavilion", type: "Residential", year: "2022", location: "Palm Springs, CA", img: p5 },
  { name: "Quinta Addition", type: "Addition", year: "2024", location: "Alentejo", img: p6 },
];

const FILTERS: { value: "All" | ProjectType; key: TranslationKey }[] = [
  { value: "All", key: "portfolio.filter.all" },
  { value: "Residential", key: "portfolio.filter.residential" },
  { value: "Commercial", key: "portfolio.filter.commercial" },
  { value: "Addition", key: "portfolio.filter.addition" },
  { value: "Remodel", key: "portfolio.filter.remodel" },
];

const TYPE_KEY: Record<ProjectType, TranslationKey> = {
  Residential: "portfolio.filter.residential",
  Commercial: "portfolio.filter.commercial",
  Addition: "portfolio.filter.addition",
  Remodel: "portfolio.filter.remodel",
};

function PortfolioPage() {
  const { t } = useLang();
  const [filter, setFilter] = useState<"All" | ProjectType>("All");
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === filter);

  return (
    <SiteLayout overHero>
      <PageHero
        label={t("nav.portfolio")}
        title={t("portfolio.hero.title")}
        subtitle={t("portfolio.hero.subtitle")}
        image={featuredImg}
      />

      <section className="container-edge py-16">
        <div className="flex flex-wrap gap-2 border-b border-border pb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                filter === f.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(f.key)}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.name} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5">
                <img src={p.img} alt={p.name} loading="lazy"
                  className="img-warm h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 to-transparent p-6 text-white transition-transform duration-500 group-hover:translate-y-0">
                  <p className="label-tag text-[var(--brass)]">{t(TYPE_KEY[p.type])} · {p.year}</p>
                  <h3 className="font-display mt-2 text-2xl">{p.name}</h3>
                  <p className="mt-1 text-xs text-white/70">{p.location}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-display text-xl">{p.name}</h3>
                <span className="label-tag text-muted-foreground">{p.year}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t(TYPE_KEY[p.type])} · {p.location}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

