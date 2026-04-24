import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/site/ServicePageTemplate";
import img from "@/assets/service-addition.jpg";

export const Route = createFileRoute("/services/home-additions")({
  head: () => ({
    meta: [
      { title: "Home Additions — Pedro & Luz" },
      { name: "description", content: "Additions that integrate with — or deliberately contrast — the original structure." },
      { property: "og:title", content: "Home Additions — Pedro & Luz" },
      { property: "og:description", content: "New volumes that read as one with the original structure." },
      { property: "og:image", content: img },
    ],
  }),
  component: () => (
    <ServicePageTemplate
      label="Service"
      title="Home Additions"
      subtitle="New volumes that read as one with the original structure — or deliberately contrast it."
      image={img}
      overview="Additions are the hardest residential work. Done well, they look inevitable; done poorly, they look bolted on. We approach every addition as a conversation with what already exists — sometimes deferential, sometimes assertive, never accidental."
      deliverables={[
        "Existing conditions and code analysis",
        "Massing studies tied to setback and FAR",
        "Foundation and structural integration",
        "Mechanical/electrical extension drawings",
        "Permit + neighbor notification coordination",
        "Construction administration",
      ]}
      steps={[
        { n: "01", t: "Feasibility", d: "Zoning, setbacks, structural capacity." },
        { n: "02", t: "Massing", d: "Where new meets old — and how." },
        { n: "03", t: "Design", d: "Refine relationship of materials and openings." },
        { n: "04", t: "Documents", d: "Drawings and details for bid and permit." },
        { n: "05", t: "Permit", d: "Submission, comments, approval." },
        { n: "06", t: "Build", d: "On-site through completion." },
      ]}
      faqs={[
        { q: "Will the addition look like an addition?", a: "Only if you want it to. We design both seamless additions and ones that frankly express the new — both are valid; neither should be accidental." },
        { q: "Can you handle the structural integration?", a: "Yes. We coordinate directly with structural engineers from day one, since the structure often drives the design." },
        { q: "Does an addition require us to move out?", a: "Usually only during the structural connection phase, and even that depends on scope. We plan construction sequencing with livability in mind." },
      ]}
    />
  ),
});
