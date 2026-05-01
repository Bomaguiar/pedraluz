import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";

const TIKTOK_URL = "https://www.tiktok.com/@lightstone_pt";
const PHONE_NUMBER = "+351915873259";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Pedro & Luz" },
      { name: "description", content: "Request a consultation. Initial conversations are complimentary." },
      { property: "og:title", content: "Contact — Pedro & Luz" },
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
  const { t } = useLang();
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
      toast.error("Something went wrong. Please email us directly at hello@pedroeluz.com");
      return;
    }

    setDone(true);
    toast.success(t("contact.toast.success"));
  }

  return (
    <SiteLayout overHero>
      <section className="pt-32" style={{ backgroundColor: "var(--surface-darker)" }}>
        <div className="container-edge py-24 text-white">
          <p className="label-tag text-[var(--brass)]">{t("contact.hero.eyebrow")}</p>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-tight md:text-7xl">
            {t("contact.hero.title")}
          </h1>
        </div>
      </section>

      <section className="container-edge py-24">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="heading-section text-[var(--brass-dark)]">{t("contact.studio")}</p>
            <p className="mt-6 text-base leading-relaxed text-foreground">
              {t("contact.body")}
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-4 w-4 text-[var(--brass-dark)]" />
                <div>
                  <p className="label-tag text-muted-foreground">{t("contact.email")}</p>
                  <a href="mailto:hello@pedroeluz.com" className="text-base text-foreground hover:text-[var(--brass-dark)]">
                    hello@pedroeluz.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-4 w-4 text-[var(--brass-dark)]" />
                <div>
                  <p className="label-tag text-muted-foreground">{t("contact.phone") ?? "Phone"}</p>
                  <a href={`tel:${PHONE_NUMBER}`} className="text-base text-foreground hover:text-[var(--brass-dark)]">
                    {PHONE_NUMBER}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-4 w-4 text-[var(--brass-dark)]" />
                <div>
                  <p className="label-tag text-muted-foreground">{t("contact.locations")}</p>
                  <p className="text-base text-foreground">Lisbon, Portugal</p>
                  <p className="text-base text-foreground">Greater Palm Springs, California</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="mt-1 h-4 w-4 text-[var(--brass-dark)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.34a8.16 8.16 0 0 0 4.77 1.52V6.41a4.85 4.85 0 0 1-1.84-.27z" />
                </svg>
                <div>
                  <p className="label-tag text-muted-foreground">TikTok</p>
                  <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="text-base text-foreground hover:text-[var(--brass-dark)]">
                    @lightstone_pt
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {done ? (
              <div className="border border-border bg-card p-12 text-center">
                <p className="label-tag text-[var(--brass-dark)]">{t("contact.success.eyebrow")}</p>
                <h2 className="font-display mt-4 text-3xl">{t("contact.success.title")}</h2>
                <p className="mt-4 text-muted-foreground">
                  {t("contact.success.body")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label={t("contact.field.name")} name="name" required />
                  <Field label={t("contact.field.email")} name="email" type="email" required />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label={t("contact.field.phone")} name="phone" />
                  <SelectField label={t("contact.field.service")} name="service_type" options={SERVICES} required selectPlaceholder={t("contact.select")} />
                </div>
                <SelectField label={t("contact.field.budget")} name="budget" options={BUDGETS} required selectPlaceholder={t("contact.select")} />
                <div>
                  <label className="label-tag text-muted-foreground">{t("contact.field.brief")}</label>
                  <textarea
                    name="notes"
                    rows={6}
                    required
                    className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                    placeholder={t("contact.field.briefPlaceholder")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-[var(--brass-dark)] disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("cta.requestConsultation")}
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

function SelectField({ label, name, options, required, selectPlaceholder }: { label: string; name: string; options: string[]; required?: boolean; selectPlaceholder: string }) {
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}{required && " *"}</label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
      >
        <option value="" disabled>{selectPlaceholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
