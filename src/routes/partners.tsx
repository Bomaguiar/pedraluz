import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import partnerImg from "@/assets/partner-roto.jpg";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Pedro & Luz" },
      { name: "description", content: "Our strategic partnership with RoTo Architects (Los Angeles) and the studio team." },
      { property: "og:title", content: "Partners — Pedro & Luz" },
      { property: "og:description", content: "Global expertise. Local precision. Strategic partnership with RoTo Architects." },
      { property: "og:image", content: partnerImg },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  return (
    <SiteLayout overHero>
      <PageHero
        label="Partners"
        title="Global expertise. Local precision."
        subtitle="Strategic partnerships extend our reach across continents while keeping every project tightly held by our studio."
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
            <p className="label-tag text-[var(--brass-dark)]">Strategic Partner</p>
            <h2 className="font-display mt-4 text-4xl md:text-5xl">RoTo Architects</h2>
            <p className="label-tag mt-2 text-muted-foreground">Los Angeles, California · International</p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Founded by Michael Rotondi — co-founder of SCI-Arc (Southern
                California Institute of Architecture) — one of the most
                influential architectural institutions in the world.
              </p>
              <p>
                RoTo operates at the intersection of art, technology, and human
                experience, producing work of international significance. Our
                collaboration brings American design innovation and global reach
                to every Pedro & Luz project.
              </p>
            </div>

            <a
              href="https://rotoark.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 border-b border-[var(--brass)] pb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--brass-dark)] transition-colors hover:text-foreground"
            >
              Visit RoTo Architects →
            </a>
          </div>
        </div>
      </section>

      {/* Future partners */}
      <section className="border-t" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-edge py-24">
          <p className="label-tag text-[var(--brass-dark)]">Studio Network</p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl md:text-5xl">
            A small network of studios we trust on every continent we work.
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            We collaborate with structural engineers, landscape architects, lighting
            consultants, and contractors across Europe and the Americas. Partner
            studios are added carefully — we'd rather work with fewer people, longer.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
