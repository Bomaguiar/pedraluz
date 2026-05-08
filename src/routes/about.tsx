import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/i18n/LanguageProvider";
import ilyaImg from "@/assets/team-ilya.jpg";
import pedroImg from "@/assets/team-pedro.jpg";
import franciscoImg from "@/assets/team-francisco.jpg";
import heroImg from "@/assets/hero-architecture.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Pedra & Luz" },
      { name: "description", content: "An international architecture and construction studio with offices in Lisbon and California." },
      { property: "og:title", content: "About — Pedra & Luz" },
      { property: "og:description", content: "Three partners. Two continents. One way of working." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  {
    name: "Ilya Bourim",
    role: "Lead Architect",
    img: ilyaImg,
    bio: "Licensed California Architect, registered in CA, NY, and multiple U.S. states. Graduate of SCI-Arc. Former designer at RoTo Architects under Michael Rotondi. Expert in BIM, parametric design, SIP construction, luxury residential, and large-scale commercial. Splits time between Lisbon and Greater Palm Springs.",
    linkedin: "https://www.linkedin.com/in/ilyabourim?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Pedro Aguiar",
    role: "Operations & Technology",
    img: pedroImg,
    bio: "14+ years in technology spanning gaming, blockchain, and digital infrastructure. Co-founder of Gamebau and operator across multiple international ventures. Architects the operational backbone — AI integrations, project management systems, and the digital infrastructure that lets the studio run faster than a traditional practice.",
    linkedin: "https://www.linkedin.com/in/pedrodaguiar?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Francisco Manani",
    role: "Lead Constructor",
    img: franciscoImg,
    bio: "Over 20 years of construction experience across more than 6 countries — from full renovations to ground-up builds. Leads on-site execution, contractor coordination, and quality control, ensuring every project is delivered to specification, on schedule, and on budget.",
    linkedin: null as string | null,
  },
];

function AboutPage() {
  const { t } = useLang();
  return (
    <SiteLayout overHero>
      <PageHero
        label={t("nav.about")}
        title={t("about.hero.title")}
        subtitle={t("about.hero.subtitle")}
        image={heroImg}
      />

      {/* Philosophy */}
      <section className="container-edge py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-tag text-[var(--brass-dark)]">{t("about.philosophy.eyebrow")}</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl leading-tight md:text-5xl">
              {t("about.philosophy.title")}
            </h2>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>{t("about.philosophy.p1")}</p>
              <p>{t("about.philosophy.p2")}</p>
              <p>{t("about.philosophy.p3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-edge py-24">
          <p className="label-tag text-[var(--brass-dark)]">{t("about.team.eyebrow")}</p>
          <h2 className="font-display mt-4 text-3xl md:text-5xl">{t("about.team.title")}</h2>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {TEAM.map((m) => (
              <div key={m.name}>
                <div className="aspect-[4/5] overflow-hidden bg-foreground/10">
                  <img src={m.img} alt={m.name} loading="lazy" className="img-warm h-full w-full object-cover" />
                </div>
                <h3 className="font-display mt-6 text-2xl">{m.name}</h3>
                <p className="label-tag mt-1 text-[var(--brass-dark)]">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-tag mt-4 inline-flex items-center gap-2 text-[var(--brass-dark)] hover:text-foreground"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
