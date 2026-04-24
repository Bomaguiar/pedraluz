import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Sparkles } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
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

const STEPS: { n: string; tKey: TranslationKey; dKey: TranslationKey; ai?: boolean }[] = [
  { n: "01", tKey: "process.s1.t", dKey: "process.s1.d", ai: true },
  { n: "02", tKey: "process.s2.t", dKey: "process.s2.d" },
  { n: "03", tKey: "process.s3.t", dKey: "process.s3.d", ai: true },
  { n: "04", tKey: "process.s4.t", dKey: "process.s4.d", ai: true },
  { n: "05", tKey: "process.s5.t", dKey: "process.s5.d" },
  { n: "06", tKey: "process.s6.t", dKey: "process.s6.d" },
  { n: "07", tKey: "process.s7.t", dKey: "process.s7.d" },
];

function ProcessPage() {
  const { t } = useLang();
  return (
    <SiteLayout overHero>
      <PageHero
        label={t("nav.process")}
        title={t("processPage.hero.title")}
        subtitle={t("processPage.hero.subtitle")}
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
                <h2 className="font-display text-3xl md:text-4xl">{t(s.tKey)}</h2>
                {s.ai && (
                  <span className="mt-3 inline-flex items-center gap-1.5 border border-[var(--brass)]/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--brass-dark)]">
                    <Sparkles className="h-3 w-3" /> {t("process.aiBadge")}
                  </span>
                )}
              </div>
              <div className="md:col-span-6">
                <p className="text-base leading-relaxed text-foreground">{t(s.dKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

