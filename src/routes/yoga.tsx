import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Check, ArrowRight, Users, Calendar, Sparkles } from "lucide-react";
import carlaImg from "@/assets/carla-yoga.jpg.asset.json";

export const Route = createFileRoute("/yoga")({
  head: () => ({
    meta: [
      { title: "Hatha Yoga with Carla — Pedra & Luz" },
      {
        name: "description",
        content:
          "Private Hatha Yoga sessions with Carla. Group packages from €30/person/hour. 15% off weekly packages. Lisbon & surroundings.",
      },
      { property: "og:title", content: "Hatha Yoga with Carla" },
      {
        property: "og:description",
        content:
          "Breath, movement, meditation and stillness. Group sessions from 2 people. Weekly packages with 15% discount.",
      },
      { property: "og:image", content: carlaImg.url },
      { name: "twitter:image", content: carlaImg.url },
    ],
  }),
  component: YogaPage,
});

const INCLUDES = [
  "Hatha Yoga practice adapted to the group",
  "Pranayama — guided breathing techniques",
  "Meditation and deep relaxation (yoga nidra)",
  "Personalised attention with small groups",
  "Mats and props available on request",
];

const STEPS = [
  { n: "01", t: "Reach out", d: "Tell us your group size, level, and preferred days." },
  { n: "02", t: "Plan together", d: "Carla shapes a sequence around your intention and space." },
  { n: "03", t: "Practice", d: "Sessions held at your home, our space, or outdoors." },
  { n: "04", t: "Continue", d: "Book weekly to deepen the practice and unlock 15% off." },
];

const FAQS = [
  {
    q: "What is the minimum group size?",
    a: "Sessions run from 2 people. There is no upper limit, though Carla recommends keeping groups intimate to preserve personal guidance.",
  },
  {
    q: "How does pricing work?",
    a: "€30 per person, per hour. Weekly packages (one session per week, ongoing) receive a 15% discount automatically.",
  },
  {
    q: "Do I need experience?",
    a: "No. Hatha Yoga is accessible to every body and every level. Carla adapts each class to who is in the room.",
  },
  {
    q: "Where do classes take place?",
    a: "At your home, garden, office, or a venue of your choice — in Lisbon and surrounding areas. Outdoor sessions are encouraged when the weather invites.",
  },
];

function YogaPage() {
  return (
    <SiteLayout overHero>
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[620px] overflow-hidden text-white">
        <img
          src={carlaImg.url}
          alt="Carla, Hatha Yoga instructor"
          className="img-warm absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,26,24,0.45) 0%, rgba(26,26,24,0.15) 40%, rgba(26,26,24,0.85) 100%)",
          }}
        />
        <div className="relative z-10 container-edge flex h-full flex-col justify-end pb-24 pt-32">
          <p className="label-tag fade-in text-[var(--brass)]">Yoga · Hatha</p>
          <h1 className="reveal-up font-display mt-6 max-w-4xl text-[44px] leading-[1.02] sm:text-6xl md:text-[88px]">
            Strength, expansion, warmth.
          </h1>
          <p className="reveal-up mt-8 max-w-xl text-base text-white/80 md:text-lg">
            Private Hatha Yoga sessions with Carla — for small groups who want to slow down,
            breathe, and remember they are not separate from anything.
          </p>
        </div>
      </section>

      {/* TEACHER */}
      <section className="container-edge py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="label-tag text-[var(--brass-dark)]">The Teacher</p>
            <h2 className="font-display mt-4 text-3xl leading-tight md:text-5xl">
              Meet Carla
            </h2>
            <p className="label-tag mt-3 text-muted-foreground">
              Hatha Yoga Instructor · Since 2017
            </p>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                My name is Carla. I have been a Hatha Yoga instructor since 2017, and an eternal
                student of this beautiful way of life.
              </p>
              <p>
                I completed my first teacher training in 2017 at the Sivananda Ashram in southern
                India. I have continued to study with different teachers and am currently in a new
                training.
              </p>
              <p>
                A Hatha Yoga class brings together physical practice, breath, meditation and
                relaxation — offering inner quiet and an opening toward yourself and the world.
              </p>
              <p>
                More than a physical practice, Yoga is the recognition of our true Nature, the
                remembering that we are not separate.
              </p>
              <p className="font-display text-2xl italic text-foreground">
                "Yoga é força, expansão e aconchego."
              </p>
            </div>
          </div>
          <div className="md:pt-12">
            <div className="aspect-[4/5] overflow-hidden bg-foreground/10">
              <img
                src={carlaImg.url}
                alt="Carla teaching"
                className="img-warm h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="border-y" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-edge py-24">
          <p className="label-tag text-[var(--brass-dark)]">Packages</p>
          <h2 className="font-display mt-4 text-3xl md:text-5xl">Practice together</h2>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground">
            All sessions are designed for groups. Bring a friend, a partner, your family or
            colleagues — the practice deepens when shared.
          </p>

          <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
            {/* Drop-in */}
            <div className="bg-[var(--surface)] p-10">
              <div className="flex items-center gap-3 text-[var(--brass-dark)]">
                <Users className="h-5 w-5" strokeWidth={1.25} />
                <span className="label-tag">Group Session</span>
              </div>
              <h3 className="font-display mt-6 text-4xl md:text-5xl">€30</h3>
              <p className="label-tag mt-2 text-muted-foreground">
                Per person · Per hour · Min. 2 people
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Pay per session, no commitment",
                  "Choose your own day and time",
                  "Indoor or outdoor",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brass-dark)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weekly */}
            <div className="relative bg-[var(--surface)] p-10">
              <span className="absolute right-6 top-6 inline-flex items-center gap-1 border border-[var(--brass)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--brass-dark)]">
                <Sparkles className="h-3 w-3" /> Save 15%
              </span>
              <div className="flex items-center gap-3 text-[var(--brass-dark)]">
                <Calendar className="h-5 w-5" strokeWidth={1.25} />
                <span className="label-tag">Weekly Package</span>
              </div>
              <h3 className="font-display mt-6 text-4xl md:text-5xl">
                €25.50
                <span className="ml-2 text-xl text-muted-foreground line-through">€30</span>
              </h3>
              <p className="label-tag mt-2 text-muted-foreground">
                Per person · Per hour · One session each week
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "15% discount on every session",
                  "Build a consistent practice",
                  "Carla shapes the arc across weeks",
                  "Reserved time slot for your group",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brass-dark)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Travel outside the Lisbon metro area may incur a small fee. Bespoke retreats and
            workshops on request.
          </p>
        </div>
      </section>

      {/* INCLUDES */}
      <section className="container-edge py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="label-tag text-[var(--brass-dark)]">What's included</p>
            <h2 className="font-display mt-4 text-3xl leading-tight md:text-5xl">
              Every session
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              A complete Hatha Yoga class woven from asana, breath, meditation and rest —
              tailored to the people in the room.
            </p>
          </div>
          <ul className="md:pt-12 space-y-4">
            {INCLUDES.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 border-b border-border pb-4"
              >
                <Check className="mt-1 h-4 w-4 text-[var(--brass-dark)]" />
                <span className="text-sm text-foreground">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-edge py-24">
          <p className="label-tag text-[var(--brass-dark)]">How it works</p>
          <h2 className="font-display mt-4 text-3xl md:text-5xl">From first message to first breath</h2>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-4">
            {STEPS.map((s) => (
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
        <h2 className="font-display mt-4 text-3xl md:text-5xl">Good to know</h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                {f.q}
                <span className="text-2xl text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-white" style={{ backgroundColor: "var(--surface-darker)" }}>
        <div className="container-edge py-24 text-center">
          <h2 className="font-display mx-auto max-w-3xl text-4xl md:text-6xl">
            Gather your people. Roll out the mats.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/65">
            Send us a note with your group size and preferred days. Carla will be in touch
            within one business day.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-3 border border-[var(--brass)] px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--brass)] transition-all hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
          >
            Book a session <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
