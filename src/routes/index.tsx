import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowRight, Brain, Clock, LineChart, Sparkles } from "lucide-react";
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
      { title: "Pedro & Luz — Architecture Built for the Way You Live" },
      {
        name: "description",
        content:
          "Licensed California architect with offices in Lisbon and California. Precision-engineered residential, commercial and transformation projects.",
      },
      { property: "og:title", content: "Pedro & Luz" },
      {
        property: "og:description",
        content: "Architecture engineered for tomorrow. Lisbon · California · International.",
      },
    ],
  }),
  component: HomePage,
});

const SERVICES = [
  {
    slug: "new-home-build",
    title: "New Home Build",
    desc: "Ground-up residential design tuned to site, climate, and life.",
    img: newhomeImg,
  },
  {
    slug: "remodeling",
    title: "Remodeling",
    desc: "Transformations that honor the bones and rewrite the experience.",
    img: remodelImg,
  },
  {
    slug: "home-additions",
    title: "Home Additions",
    desc: "New volumes that read as one with the original structure.",
    img: additionImg,
  },
  {
    slug: "commercial",
    title: "Commercial",
    desc: "Restaurants, retail and workplaces designed to be lived in.",
    img: commercialImg,
  },
] as const;

const PROCESS = [
  { n: "01", title: "Initial Consultation", desc: "Understand your vision, budget, and requirements.", ai: true },
  { n: "02", title: "Site Analysis", desc: "Topography, orientation, views, and constraints." },
  { n: "03", title: "Design Development", desc: "Collaborative sketching until you love the direction.", ai: true },
  { n: "04", title: "Construction Documents", desc: "Detailed specs: materials, finishes, dimensions.", ai: true },
  { n: "05", title: "Contractor Selection", desc: "Curated shortlist or your own — we advise either way." },
  { n: "06", title: "Construction Admin", desc: "On-site oversight, schedule adherence, budget control." },
  { n: "07", title: "Project Completion", desc: "Final inspection, punch list, handover with pride." },
];

const TEAM = [
  {
    name: "Ilya Pedro & Luz",
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
    name: "Francisco Gonzalez",
    role: "Project Architect",
    bio: "Deep expertise in construction administration and project delivery — bridging design intent with on-site reality.",
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
          <p className="label-tag fade-in text-[var(--brass)]">
            Licensed California Architect · Lisbon · International
          </p>
          <h1 className="reveal-up font-display mt-6 max-w-5xl text-[44px] leading-[1.02] sm:text-6xl md:text-[88px]">
            Architecture Built<br />
            for the Way<br />
            You Live.
          </h1>
          <p className="reveal-up mt-8 max-w-xl text-base text-white/80 md:text-lg">
            From concept to construction — precision-engineered design for
            residential, commercial, and transformation projects.
          </p>

          <div className="reveal-up mt-10 flex flex-wrap items-center gap-6">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 border border-[var(--brass)] px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] transition-all duration-300 hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
            >
              Explore Our Work
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/process"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
            >
              See The Process →
            </Link>
          </div>
        </div>

        {/* Ticker */}
        <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/10 bg-black/30 py-4 backdrop-blur-sm">
          <div className="ticker flex whitespace-nowrap">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span
                key={i}
                className="label-tag mx-8 text-white/55"
              >
                {t} ·
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
            { n: "14+", l: "Years Practice" },
            { n: "50+", l: "Projects Delivered" },
            { n: "4", l: "Service Lines" },
            { n: "US + EU", l: "Markets Served" },
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
            <p className="label-tag text-[var(--brass-dark)]">What We Do</p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-6xl">
              Four disciplines.<br />One studio.
            </h2>
          </div>
          <Link
            to="/services"
            className="label-tag text-foreground/70 hover:text-foreground"
          >
            All services →
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
                alt={s.title}
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
                <h3 className="font-display text-3xl md:text-4xl">{s.title}</h3>
                <p className="mt-2 max-w-sm text-sm text-white/75">{s.desc}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brass)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore Service <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section
        className="border-y"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-edge py-32">
          <div className="mb-16">
            <p className="label-tag text-[var(--brass-dark)]">The Process</p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-6xl">
              Seven steps.<br />Zero guesswork.
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
                  <h3 className="text-sm font-medium text-foreground">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  {p.ai && (
                    <span className="mt-3 inline-flex items-center gap-1 border border-[var(--brass)]/50 px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-[var(--brass-dark)]">
                      <Sparkles className="h-2.5 w-2.5" /> AI-Assisted
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
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
          <p className="label-tag text-[var(--brass)]">Featured Project</p>
          <h2 className="font-display mt-5 max-w-3xl text-5xl leading-tight md:text-7xl">
            Hillcrest Residence
          </h2>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-8 text-sm text-white/80">
            <div>
              <p className="label-tag text-white/40">Type</p>
              <p className="mt-2">New Home Addition</p>
            </div>
            <div>
              <p className="label-tag text-white/40">Location</p>
              <p className="mt-2">Santa Barbara, CA</p>
            </div>
            <div>
              <p className="label-tag text-white/40">Year</p>
              <p className="mt-2">2024</p>
            </div>
          </div>
          <Link
            to="/portfolio"
            className="mt-8 inline-flex w-fit items-center gap-3 border border-[var(--brass)] px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] transition-all hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
          >
            View Case Study <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* PARTNER */}
      <section className="container-edge py-32">
        <div className="mb-16">
          <p className="label-tag text-[var(--brass-dark)]">Strategic Partnership</p>
          <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-6xl">
            Global expertise.<br />Local precision.
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
            <p className="label-tag text-[var(--brass-dark)]">Strategic Partner</p>
            <h3 className="font-display mt-4 text-4xl md:text-5xl">RoTo Architects</h3>
            <p className="label-tag mt-2 text-muted-foreground">Los Angeles, California</p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Founded by Michael Rotondi — SCI-Arc co-founder and one of America's
              most influential architectural minds. Our collaboration bridges
              American innovation with European precision, delivering projects
              that transcend borders.
            </p>
            <Link
              to="/partners"
              className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground hover:text-[var(--brass-dark)]"
            >
              Read about our partnerships →
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section
        className="border-y"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-edge py-32">
          <div className="mb-16">
            <p className="label-tag text-[var(--brass-dark)]">The Team</p>
            <h2 className="font-display mt-4 text-4xl leading-tight md:text-6xl">
              Architects. Operators. Builders.
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

      {/* AI / TECH */}
      <section
        className="text-white"
        style={{ backgroundColor: "var(--surface-darker)" }}
      >
        <div className="container-edge py-32">
          <div className="mb-20 max-w-3xl">
            <p className="label-tag text-[var(--brass)]">Studio Intelligence</p>
            <h2 className="font-display mt-4 text-4xl leading-tight md:text-6xl">
              We don't just design.<br />We compute.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "AI-Accelerated Design",
                body: "Generative tools that produce 10× more concept variations in the time it used to take to sketch three. Your brief becomes 50 explorations overnight.",
              },
              {
                icon: Clock,
                title: "Compressed Cycles",
                body: "Real-time material procurement, automated supplier quote aggregation, and workforce scheduling that eliminate the coordination tax.",
              },
              {
                icon: LineChart,
                title: "Live Project Intelligence",
                body: "Clients get a dedicated dashboard showing progress, milestone completion, budget tracking, and document access — 24/7, no calls needed.",
              },
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
        <p className="label-tag text-[var(--brass-dark)]">Begin</p>
        <h2 className="font-display mx-auto mt-6 max-w-3xl text-5xl leading-tight md:text-7xl">
          Tell us about your project.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          Initial consultations are complimentary. We respond within one business day.
        </p>
        <Link
          to="/contact"
          className="mt-10 inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-[var(--brass-dark)]"
        >
          Request Consultation <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </SiteLayout>
  );
}
