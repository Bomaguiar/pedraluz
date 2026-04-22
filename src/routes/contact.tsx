import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bourim Architecture Studio" },
      { name: "description", content: "Request a consultation. Initial conversations are complimentary." },
      { property: "og:title", content: "Contact — Bourim Architecture Studio" },
      { property: "og:description", content: "Tell us about your project. We respond within one business day." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service_type: z.string().min(1, "Select a service"),
  budget: z.string().min(1, "Select a budget range"),
  notes: z.string().trim().min(10, "Tell us a bit more (min 10 chars)").max(2000),
});

const SERVICES = ["New Home Build", "Remodeling", "Home Addition", "Commercial", "Other"];
const BUDGETS = ["< €100K", "€100K – €500K", "€500K – €1.5M", "€1.5M – €5M", "€5M+"];

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      service_type: String(fd.get("service_type") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("clients").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service_type: parsed.data.service_type,
      source: "website",
      status: "inquiry",
      notes: `Budget: ${parsed.data.budget}\n\n${parsed.data.notes}`,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please email us directly at hello@bourim.com");
      return;
    }

    setDone(true);
    toast.success("Message received. We'll be in touch within one business day.");
  }

  return (
    <SiteLayout overHero>
      <section className="pt-32" style={{ backgroundColor: "var(--surface-darker)" }}>
        <div className="container-edge py-24 text-white">
          <p className="label-tag text-[var(--brass)]">Begin</p>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-tight md:text-7xl">
            Tell us about your project.
          </h1>
        </div>
      </section>

      <section className="container-edge py-24">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="heading-section text-[var(--brass-dark)]">Studio</p>
            <p className="mt-6 text-base leading-relaxed text-foreground">
              Initial consultations are complimentary. We respond within one business
              day. For active project inquiries, attach a brief or share a few
              reference images — it helps us prepare.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-4 w-4 text-[var(--brass-dark)]" />
                <div>
                  <p className="label-tag text-muted-foreground">Email</p>
                  <a href="mailto:hello@bourim.com" className="text-base text-foreground hover:text-[var(--brass-dark)]">
                    hello@bourim.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-4 w-4 text-[var(--brass-dark)]" />
                <div>
                  <p className="label-tag text-muted-foreground">Locations</p>
                  <p className="text-base text-foreground">Lisbon, Portugal</p>
                  <p className="text-base text-foreground">Greater Palm Springs, California</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {done ? (
              <div className="border border-border bg-card p-12 text-center">
                <p className="label-tag text-[var(--brass-dark)]">Received</p>
                <h2 className="font-display mt-4 text-3xl">Thank you.</h2>
                <p className="mt-4 text-muted-foreground">
                  Your inquiry has been logged. A partner will reach out within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Phone" name="phone" />
                  <SelectField label="Service" name="service_type" options={SERVICES} required />
                </div>
                <SelectField label="Budget Range" name="budget" options={BUDGETS} required />
                <div>
                  <label className="label-tag text-muted-foreground">Project Brief</label>
                  <textarea
                    name="notes"
                    rows={6}
                    required
                    className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                    placeholder="Tell us about the site, the program, the timing, and what success looks like."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-[var(--brass-dark)] disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Request Consultation
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}{required && " *"}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}{required && " *"}</label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
