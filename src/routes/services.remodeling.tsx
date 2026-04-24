import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/site/ServicePageTemplate";
import img from "@/assets/service-remodel.jpg";

export const Route = createFileRoute("/services/remodeling")({
  head: () => ({
    meta: [
      { title: "Remodeling — Pedro & Luz" },
      { name: "description", content: "Whole-home remodels and interior transformations that honor original structure." },
      { property: "og:title", content: "Remodeling — Pedro & Luz" },
      { property: "og:description", content: "Transformations that honor the bones and rewrite the experience." },
      { property: "og:image", content: img },
    ],
  }),
  component: () => (
    <ServicePageTemplate
      label="Service"
      title="Remodeling"
      subtitle="Transformations that honor the original bones and rewrite the experience inside them."
      image={img}
      overview="Most homes are misconfigured for the way their owners actually live. A great remodel is part archaeology, part editing — finding what's worth keeping and giving it a new logic. We work from existing conditions surveys and structural analysis, never from assumption."
      deliverables={[
        "Existing-conditions survey + structural assessment",
        "Demolition and structural drawings",
        "New layout, finish, and lighting plans",
        "Permit coordination",
        "Interior specifications and millwork details",
        "Construction administration",
      ]}
      steps={[
        { n: "01", t: "Discovery", d: "Walk the home, listen, identify constraints." },
        { n: "02", t: "Existing Survey", d: "Measured drawings, structural analysis." },
        { n: "03", t: "Concept", d: "Two directions for the new spatial logic." },
        { n: "04", t: "Design Documents", d: "Drawings detailed enough to bid accurately." },
        { n: "05", t: "Bid + Permit", d: "Contractor selection and permit submission." },
        { n: "06", t: "Build", d: "On-site weekly through completion." },
      ]}
      faqs={[
        { q: "Can you work with our existing structure?", a: "Almost always. Even when significant intervention is required, we plan around the most valuable elements — original framing, fenestration, a particular ceiling height." },
        { q: "How disruptive is a remodel?", a: "It depends on scope. Whole-home remodels typically require relocation; targeted kitchen/bath remodels can be lived through. We'll tell you honestly which one yours is." },
        { q: "Do you handle historic properties?", a: "Yes, including review-board coordination. Our partner studios bring deep historic experience when needed." },
        { q: "What's a realistic remodel budget?", a: "In Lisbon and California, expect €/$ 2,500–6,000 per square meter for a high-quality remodel, depending on systems replacement and finish level." },
      ]}
    />
  ),
});
