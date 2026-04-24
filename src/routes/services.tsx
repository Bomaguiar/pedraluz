import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";
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

const SERVICES = [
  { slug: "new-home-build", title: "New Home Build", desc: "Ground-up residential design tuned to site, climate, and life.", img: newhomeImg },
  { slug: "remodeling", title: "Remodeling", desc: "Transformations that honor the bones and rewrite the experience.", img: remodelImg },
  { slug: "home-additions", title: "Home Additions", desc: "New volumes that read as one with the original structure.", img: additionImg },
  { slug: "commercial", title: "Commercial", desc: "Restaurants, retail and workplaces designed to be lived in.", img: commercialImg },
];

function ServicesPage() {
  return (
    <SiteLayout overHero>
      <PageHero
        label="Services"
        title="Four disciplines. One studio."
        subtitle="From ground-up homes to commercial fit-outs — we work where design demands precision."
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
              <img src={s.img} alt={s.title} loading="lazy"
                className="img-warm absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,26,24,0) 30%, rgba(26,26,24,0.85) 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <h2 className="font-display text-3xl md:text-4xl">{s.title}</h2>
                <p className="mt-2 max-w-sm text-sm text-white/75">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brass)]">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
