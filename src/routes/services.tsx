import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import newhomeImg from "@/assets/service-newhome.jpg";
import remodelImg from "@/assets/service-remodel.jpg";
import additionImg from "@/assets/service-addition.jpg";
import commercialImg from "@/assets/service-commercial.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Pedro & Luz" },
      {
        name: "description",
        content:
          "New home build, remodeling, additions, and commercial architecture. Four disciplines, delivered with precision.",
      },
      { property: "og:title", content: "Services — Pedro & Luz" },
      {
        property: "og:description",
        content: "Residential, additions, remodeling, and commercial architecture.",
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICES: { slug: string; titleKey: TranslationKey; descKey: TranslationKey; img: string }[] = [
  { slug: "new-home-build", titleKey: "svc.newhome.t", descKey: "svc.newhome.d", img: newhomeImg },
  { slug: "remodeling", titleKey: "svc.remodel.t", descKey: "svc.remodel.d", img: remodelImg },
  { slug: "home-additions", titleKey: "svc.addition.t", descKey: "svc.addition.d", img: additionImg },
  { slug: "commercial", titleKey: "svc.commercial.t", descKey: "svc.commercial.d", img: commercialImg },
];

function ServicesPage() {
  const { t } = useLang();
  return (
    <SiteLayout overHero>
      <PageHero
        label={t("nav.services")}
        title={t("services.hero.title")}
        subtitle={t("services.hero.subtitle")}
        image={newhomeImg}
      />
      <section className="container-edge py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}` as string}
              className="group relative block aspect-[4/3] overflow-hidden"
            >
              <img src={s.img} alt={t(s.titleKey)} loading="lazy"
                className="img-warm absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,26,24,0) 30%, rgba(26,26,24,0.85) 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <h2 className="font-display text-3xl md:text-4xl">{t(s.titleKey)}</h2>
                <p className="mt-2 max-w-sm text-sm text-white/75">{t(s.descKey)}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brass)]">
                  {t("cta.exploreService")} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

