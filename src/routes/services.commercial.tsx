import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/site/ServicePageTemplate";
import img from "@/assets/service-commercial.jpg";

export const Route = createFileRoute("/services/commercial")({
  head: () => ({
    meta: [
      { title: "Commercial — Pedro & Luz" },
      { name: "description", content: "Restaurants, retail, and workplaces designed for atmosphere and operation." },
      { property: "og:title", content: "Commercial — Pedro & Luz" },
      { property: "og:description", content: "Restaurants, retail and workplaces designed to be lived in." },
      { property: "og:image", content: img },
    ],
  }),
  component: () => (
    <ServicePageTemplate
      label="Service"
      title="Commercial"
      subtitle="Restaurants, retail, and workplaces designed for both atmosphere and operation."
      image={img}
      overview="Commercial spaces have to work twice — once aesthetically, once operationally. A restaurant whose plan kills service flow is a bad restaurant, no matter how it photographs. We design in close collaboration with operators from the first sketch."
      deliverables={[
        "Concept and brand-aligned design direction",
        "Space planning and operational workflow",
        "Fit-out drawings and construction documents",
        "Lighting and acoustic design coordination",
        "Permit and accessibility compliance",
        "Construction administration and FF&E support",
      ]}
      steps={[
        { n: "01", t: "Brief", d: "Operations, brand, and ambition aligned." },
        { n: "02", t: "Concept", d: "Plan, atmosphere, material direction." },
        { n: "03", t: "Design Dev", d: "Lighting, acoustics, MEP coordination." },
        { n: "04", t: "Documents", d: "Bid-ready drawings and specifications." },
        { n: "05", t: "Permit + Bid", d: "Approvals and contractor selection." },
        { n: "06", t: "Build + Open", d: "On-site through opening day." },
      ]}
      faqs={[
        { q: "Do you work with hospitality operators?", a: "Yes — restaurants, bars, boutique hotels, and member spaces are a core part of our commercial practice." },
        { q: "How fast can a fit-out be delivered?", a: "Smaller retail or office fit-outs can move from kickoff to opening in 6–9 months. Restaurant projects with kitchens and licensing typically need 9–14 months." },
        { q: "Can you support multi-location rollouts?", a: "Yes. We've designed prototypes that adapt across locations while preserving brand consistency and local code." },
      ]}
    />
  ),
});
