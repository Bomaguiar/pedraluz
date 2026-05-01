import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/i18n/LanguageProvider";
import partnerImg from "@/assets/partner-roto.jpg";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Pedra & Luz" },
      { name: "description", content: "Our strategic partnership with RoTo Architects (Los Angeles) and the studio team." },
      { property: "og:title", content: "Partners — Pedra & Luz" },
      { property: "og:description", content: "Global expertise. Local precision. Strategic partnership with RoTo Architects." },
      { property: "og:image", content: partnerImg },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { t } = useLang();
  return (
    <SiteLayout overHero>
      <PageHero
        label={t("nav.partners")}
        title={t("partnersPage.hero.title")}
        subtitle={t("partnersPage.hero.subtitle")}
        image={partnerImg}
      />

      {/* Primary partner */}
      <section className="container-edge py-24">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={partnerImg} alt="RoTo Architects" className="img-warm h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="md:col-span-5">
            <p className="label-tag text-[var(--brass-dark)]">{t("home.partner.label")}</p>
            <h2 className="font-display mt-4 text-4xl md:text-5xl">RoTo Architects</h2>
            <p className="label-tag mt-2 text-muted-foreground">Los Angeles, California · International</p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("home.partner.body")}</p>
            </div>

            <a
              href="https://rotoark.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 border-b border-[var(--brass)] pb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--brass-dark)] transition-colors hover:text-foreground"
            >
              {t("partnersPage.visit")}
            </a>
          </div>
        </div>
      </section>

      {/* Future partners */}
      <section className="border-t" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-edge py-24">
          <p className="label-tag text-[var(--brass-dark)]">{t("partnersPage.network.eyebrow")}</p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl md:text-5xl">
            {t("partnersPage.network.title")}
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("partnersPage.network.body")}
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

