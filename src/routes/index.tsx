import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowRight, Brain, Clock, LineChart, Sparkles } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import heroImg from "@/assets/hero-architecture.jpg";
import newhomeImg from "@/assets/service-newhome.jpg";
import remodelImg from "@/assets/service-remodel.jpg";
import additionImg from "@/assets/service-addition.jpg";
import commercialImg from "@/assets/service-commercial.jpg";
import featuredImg from "@/assets/featured-project.jpg";
import partnerImg from "@/assets/partner-roto.jpg";
import ilyaImg from "@/assets/team-ilya.jpg";
import pedroImg from "@/assets/team-pedro.jpg";
import franciscoImg from "@/assets/team-francisco.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pedra & Luz — Architecture Built for the Way You Live" },
      {
        name: "description",
        content:
          "Licensed California architect with offices in Lisbon and California. Precision-engineered residential, commercial and transformation projects.",
      },
      { property: "og:title", content: "Pedra & Luz" },
      {
        property: "og:description",
        content: "Architecture engineered for tomorrow. Lisbon · California · International.",
      },
    ],
  }),
  component: HomePage,
});

const SERVICES: { slug: string; titleKey: TranslationKey; descKey: TranslationKey; img: string }[] = [
  { slug: "new-home-build", titleKey: "svc.newhome.t", descKey: "svc.newhome.d", img: newhomeImg },
  { slug: "remodeling", titleKey: "svc.remodel.t", descKey: "svc.remodel.d", img: remodelImg },
  { slug: "home-additions", titleKey: "svc.addition.t", descKey: "svc.addition.d", img: additionImg },
  { slug: "commercial", titleKey: "svc.commercial.t", descKey: "svc.commercial.d", img: commercialImg },
];

const PROCESS: { n: string; tKey: TranslationKey; dKey: TranslationKey; ai?: boolean }[] = [
  { n: "01", tKey: "process.s1.t", dKey: "process.s1.d", ai: true },
  { n: "02", tKey: "process.s2.t", dKey: "process.s2.d" },
  { n: "03", tKey: "process.s3.t", dKey: "process.s3.d", ai: true },
  { n: "04", tKey: "process.s4.t", dKey: "process.s4.d", ai: true },
  { n: "05", tKey: "process.s5.t", dKey: "process.s5.d" },
  { n: "06", tKey: "process.s6.t", dKey: "process.s6.d" },
  { n: "07", tKey: "process.s7.t", dKey: "process.s7.d" },
];

const TEAM = [
  {
    name: "Ilya Bourim",
    role: "Licensed California Architect",
    bio: "Registered in CA, NY + multiple U.S. states. SCI-Arc graduate. Former designer at RoTo Architects under Michael Rotondi.",
    img: ilyaImg,
  },
  {
    name: "Pedro Aguiar",
    role: "Operations & Technology Director",
    bio: "14+ years in tech across gaming, blockchain, and digital infrastructure. Leads operations, AI integration, and technology pipeline.",
    img: pedroImg,
  },
  {
    name: "Francisco Manani",
    role: "Lead Constructor",
    bio: "20+ years building across 6+ countries — from renovations to full ground-up construction. Owns on-site delivery end to end.",
    img: franciscoImg,
  },
];

const TICKER = [
  "New Home Build",
  "Remodeling",
  "Home Additions",
  "Commercial",
  "AI-Assisted Design",
  "Lisbon",
  "California",
  "International",
];

function HomePage() {
  const { t } = useLang();
  return (
    <SiteLayout overHero>
      {/* HERO */}
      <section className="relative h-screen min-h-[720px] overflow-hidden text-white">
        <img
          src={heroImg}
          alt="Modern architectural exterior at golden hour"
          className="img-warm absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,26,24,0.35) 0%, rgba(26,26,24,0.15) 35%, rgba(26,26,24,0.85) 100%)",
          }}
        />

        <div className="relative z-10 container-edge flex h-full flex-col justify-end pb-24 pt-32">
          <p className="label-tag fade-in text-[var(--brass)]">{t("home.hero.eyebrow")}</p>
          <h1 className="reveal-up font-display mt-6 max-w-5xl whitespace-pre-line text-[44px] leading-[1.02] sm:text-6xl md:text-[88px]">
            {t("home.hero.title")}
          </h1>
          <p className="reveal-up mt-8 max-w-xl text-base text-white/80 md:text-lg">
            {t("home.hero.subtitle")}
          </p>

          <div className="reveal-up mt-10 flex flex-wrap items-center gap-6">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 border border-[var(--brass)] px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] transition-all duration-300 hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
            >
              {t("cta.exploreWork")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/process"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
            >
              {t("cta.seeProcess")}
            </Link>
          </div>
        </div>

        {/* Ticker */}
        <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/10 bg-black/30 py-4 backdrop-blur-sm">
          <div className="ticker flex whitespace-nowrap">
            {[...TICKER, ...TICKER].map((tk, i) => (
              <span
                key={i}
                className="label-tag mx-8 text-white/55"
              >
                {tk} ·
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="text-white"
        style={{ backgroundColor: "var(--surface-darker)" }}
      >
        <div className="container-edge grid grid-cols-2 gap-y-12 py-20 md:grid-cols-4">
          {[
            { n: "14+", l: t("home.stats.years") },
            { n: "50+", l: t("home.stats.projects") },
            { n: "4", l: t("home.stats.lines") },
            { n: "US + EU", l: t("home.stats.markets") },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-stat text-5xl text-white md:text-7xl">
                {s.n}
              </div>
              <div className="label-tag mt-3 text-white/45">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-edge py-32">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="label-tag text-[var(--brass-dark)]">{t("home.services.eyebrow")}</p>
            <h2 className="font-display mt-4 max-w-2xl whitespace-pre-line text-4xl leading-tight md:text-6xl">
              {t("home.services.title")}
            </h2>
          </div>
          <Link
            to="/services"
            className="label-tag text-foreground/70 hover:text-foreground"
          >
            {t("cta.allServices")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}` as string}
              className="group relative block aspect-[4/3] overflow-hidden bg-foreground/10"
            >
              <img
                src={s.img}
                alt={t(s.titleKey)}
                className="img-warm absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(26,26,24,0) 30%, rgba(26,26,24,0.85) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <h3 className="font-display text-3xl md:text-4xl">{t(s.titleKey)}</h3>
                <p className="mt-2 max-w-sm text-sm text-white/75">{t(s.descKey)}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brass)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {t("cta.exploreService")} <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECT */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden text-white">
        <img
          src={featuredImg}
          alt="Hillcrest Residence"
          className="img-warm absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(26,26,24,0.75) 0%, rgba(26,26,24,0.2) 60%)",
          }}
        />
        <div className="relative z-10 container-edge flex h-full flex-col justify-end pb-20 pt-20">
          <p className="label-tag text-[var(--brass)]">{t("home.featured.eyebrow")}</p>
          <h2 className="font-display mt-5 max-w-3xl text-5xl leading-tight md:text-7xl">
            Hillcrest Residence
          </h2>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-8 text-sm text-white/80">
            <div>
              <p className="label-tag text-white/40">{t("home.featured.type")}</p>
              <p className="mt-2">New Home Addition</p>
            </div>
            <div>
              <p className="label-tag text-white/40">{t("home.featured.location")}</p>
              <p className="mt-2">Santa Barbara, CA</p>
            </div>
            <div>
              <p className="label-tag text-white/40">{t("home.featured.year")}</p>
              <p className="mt-2">2024</p>
            </div>
          </div>
          <Link
            to="/portfolio"
            className="mt-8 inline-flex w-fit items-center gap-3 border border-[var(--brass)] px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] transition-all hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
          >
            {t("cta.viewCaseStudy")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* TEAM */}
      <section
        className="border-y"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-edge py-32">
          <div className="mb-16">
            <p className="label-tag text-[var(--brass-dark)]">{t("home.team.eyebrow")}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight md:text-6xl">
              {t("home.team.title")}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TEAM.map((m) => (
              <div key={m.name} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-foreground/10">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="img-warm h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-display mt-6 text-2xl">{m.name}</h3>
                <p className="label-tag mt-1 text-[var(--brass-dark)]">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-edge py-32">
        <div className="mb-16">
          <p className="label-tag text-[var(--brass-dark)]">{t("home.process.eyebrow")}</p>
          <h2 className="font-display mt-4 max-w-2xl whitespace-pre-line text-4xl leading-tight md:text-6xl">
            {t("home.process.title")}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-7">
            {PROCESS.map((p) => (
              <div key={p.n} className="relative">
                <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center bg-background text-[11px] uppercase tracking-[0.18em] text-foreground border border-border">
                  {p.n}
                </div>
                <h3 className="text-sm font-medium text-foreground">{t(p.tKey)}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t(p.dKey)}
                </p>
                {p.ai && (
                  <span className="mt-3 inline-flex items-center gap-1 border border-[var(--brass)]/50 px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-[var(--brass-dark)]">
                    <Sparkles className="h-2.5 w-2.5" /> {t("process.aiBadge")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER */}
      <section
        className="border-y"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-edge py-32">
          <div className="mb-16">
            <p className="label-tag text-[var(--brass-dark)]">{t("home.partner.eyebrow")}</p>
            <h2 className="font-display mt-4 max-w-2xl whitespace-pre-line text-4xl leading-tight md:text-6xl">
              {t("home.partner.title")}
            </h2>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={partnerImg}
                alt="RoTo Architects building"
                className="img-warm h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="label-tag text-[var(--brass-dark)]">{t("home.partner.label")}</p>
              <h3 className="font-display mt-4 text-4xl md:text-5xl">RoTo Architects</h3>
              <p className="label-tag mt-2 text-muted-foreground">Los Angeles, California</p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {t("home.partner.body")}
              </p>
              <Link
                to="/partners"
                className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground hover:text-[var(--brass-dark)]"
              >
                {t("cta.readPartners")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI / TECH */}
      <section
        className="text-white"
        style={{ backgroundColor: "var(--surface-darker)" }}
      >
        <div className="container-edge py-32">
          <div className="mb-20 max-w-3xl">
            <p className="label-tag text-[var(--brass)]">{t("home.tech.eyebrow")}</p>
            <h2 className="font-display mt-4 whitespace-pre-line text-4xl leading-tight md:text-6xl">
              {t("home.tech.title")}
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              { icon: Brain, title: t("home.tech.aiTitle"), body: t("home.tech.aiBody") },
              { icon: Clock, title: t("home.tech.cyclesTitle"), body: t("home.tech.cyclesBody") },
              { icon: LineChart, title: t("home.tech.liveTitle"), body: t("home.tech.liveBody") },
            ].map((f) => (
              <div key={f.title} className="border-t border-white/15 pt-8">
                <f.icon className="h-6 w-6 text-[var(--brass)]" strokeWidth={1.25} />
                <h3 className="font-display mt-6 text-2xl">{f.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-edge py-32 text-center">
        <p className="label-tag text-[var(--brass-dark)]">{t("home.cta.eyebrow")}</p>
        <h2 className="font-display mx-auto mt-6 max-w-3xl text-5xl leading-tight md:text-7xl">
          {t("home.cta.title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          {t("home.cta.body")}
        </p>
        <Link
          to="/contact"
          className="mt-10 inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-[var(--brass-dark)]"
        >
          {t("cta.requestConsultation")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </SiteLayout>
  );
}
