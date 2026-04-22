import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import ilyaImg from "@/assets/team-ilya.jpg";
import pedroImg from "@/assets/team-pedro.jpg";
import franciscoImg from "@/assets/team-francisco.jpg";
import heroImg from "@/assets/hero-architecture.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Bourim Architecture Studio" },
      { name: "description", content: "An international architecture and construction studio with offices in Lisbon and California." },
      { property: "og:title", content: "About — Bourim Architecture Studio" },
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
  },
  {
    name: "Pedro Aguiar",
    role: "Operations & Technology",
    img: pedroImg,
    bio: "14+ years in technology spanning gaming, blockchain, and digital infrastructure. Co-founder of Gamebau and operator across multiple international ventures. Architects the operational backbone — AI integrations, project management systems, and the digital infrastructure that lets the studio run faster than a traditional practice.",
  },
  {
    name: "Francisco Gonzalez",
    role: "Project Architect",
    img: franciscoImg,
    bio: "Experienced architecture and construction professional. Brings deep technical expertise in project delivery, construction administration, and design execution — bridging design intent with on-site reality.",
  },
];

function AboutPage() {
  return (
    <SiteLayout overHero>
      <PageHero
        label="About"
        title="Three partners. Two continents."
        subtitle="An international architecture and construction studio with offices in Lisbon and California — built around design, technology, and delivery."
        image={heroImg}
      />

      {/* Philosophy */}
      <section className="container-edge py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-tag text-[var(--brass-dark)]">Philosophy</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl leading-tight md:text-5xl">
              Precision is a form of respect.
            </h2>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                We believe architecture is a service before it is an art form. The
                client is not a brief; the site is not an obstacle. Both deserve
                careful, honest work — and the best buildings come from taking
                that seriously over years.
              </p>
              <p>
                We use AI and computational tools because they expand the option
                space and compress the cost of asking "what if". They do not
                replace judgement. Every line is still drawn by an architect with
                a license and a conscience.
              </p>
              <p>
                We work between Europe and America because good clients exist in
                both, and because crossing borders keeps the practice honest about
                what is universal and what is local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-edge py-24">
          <p className="label-tag text-[var(--brass-dark)]">The Partners</p>
          <h2 className="font-display mt-4 text-3xl md:text-5xl">Who we are</h2>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {TEAM.map((m) => (
              <div key={m.name}>
                <div className="aspect-[4/5] overflow-hidden bg-foreground/10">
                  <img src={m.img} alt={m.name} loading="lazy" className="img-warm h-full w-full object-cover" />
                </div>
                <h3 className="font-display mt-6 text-2xl">{m.name}</h3>
                <p className="label-tag mt-1 text-[var(--brass-dark)]">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
