import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/site/ServicePageTemplate";
import img from "@/assets/service-newhome.jpg";

export const Route = createFileRoute("/services/new-home-build")({
  head: () => ({
    meta: [
      { title: "New Home Build — Pedro & Luz" },
      { name: "description", content: "Ground-up residential architecture engineered to site, climate, and life." },
      { property: "og:title", content: "New Home Build — Pedro & Luz" },
      { property: "og:description", content: "Custom residential architecture from concept to completion." },
      { property: "og:image", content: img },
    ],
  }),
  component: () => (
    <ServicePageTemplate
      label="Service"
      title="New Home Build"
      subtitle="Ground-up residential architecture engineered to site, climate, and the life you actually live."
      image={img}
      overview="A new home is not a kit of parts. It's a precise response to one site, one client, one set of constraints. We design from first principles — orientation, structure, circulation — and let materials speak quietly through proportion and light."
      deliverables={[
        "Schematic design package with site analysis",
        "Full construction documents (BIM)",
        "Permit submission + jurisdictional coordination",
        "Material and finish specifications",
        "Construction administration through completion",
        "Optional FF&E and landscape coordination",
      ]}
      steps={[
        { n: "01", t: "Programming", d: "Translate your life into a spatial brief." },
        { n: "02", t: "Site Analysis", d: "Topography, climate, code, and views inform the form." },
        { n: "03", t: "Schematic Design", d: "Three directions explored. One refined together." },
        { n: "04", t: "Design Development", d: "Materials, structure, systems integrated." },
        { n: "05", t: "Construction Docs", d: "BIM-driven drawings, specs, and details." },
        { n: "06", t: "Construction Admin", d: "Weekly site presence, RFI response, change control." },
      ]}
      faqs={[
        { q: "How long does a new home project take?", a: "From first sketch to move-in, expect 18–30 months. Design is typically 6–9 months; construction 12–20 months depending on scope and jurisdiction." },
        { q: "Do you work with our preferred contractor?", a: "Yes. We'll either bid the project competitively or work with a contractor you already trust. We advise either way and remain your advocate throughout." },
        { q: "What is the typical fee structure?", a: "Most new home projects are billed as a percentage of construction cost (10–15%) or as a fixed fee per phase. We propose what fits the project after the initial consultation." },
        { q: "Do you handle permits?", a: "Yes — permit submission and jurisdictional coordination are included in our scope, both in California and Portugal." },
        { q: "Can you work in jurisdictions you're not licensed in?", a: "Yes, in collaboration with a locally licensed architect of record. We've delivered projects across the US and EU this way." },
      ]}
    />
  ),
});
