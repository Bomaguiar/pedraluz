import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "var(--surface-darker)" }}
    >
      <div className="container-edge py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-2xl tracking-[0.25em]">PEDRO & LUZ</div>
            <p className="mt-4 max-w-xs text-sm text-white/60">{t("footer.tagline")}</p>
          </div>

          <div>
            <p className="heading-section text-white/40">{t("footer.services")}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link to="/services/new-home-build" className="hover:text-white">{t("svc.newhome.t")}</Link></li>
              <li><Link to="/services/remodeling" className="hover:text-white">{t("svc.remodel.t")}</Link></li>
              <li><Link to="/services/home-additions" className="hover:text-white">{t("svc.addition.t")}</Link></li>
              <li><Link to="/services/commercial" className="hover:text-white">{t("svc.commercial.t")}</Link></li>
            </ul>
          </div>

          <div>
            <p className="heading-section text-white/40">{t("footer.studio")}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link to="/process" className="hover:text-white">{t("nav.process")}</Link></li>
              <li><Link to="/portfolio" className="hover:text-white">{t("nav.portfolio")}</Link></li>
              <li><Link to="/about" className="hover:text-white">{t("nav.about")}</Link></li>
              <li><Link to="/partners" className="hover:text-white">{t("nav.partners")}</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">{t("footer.dashboard")}</Link></li>
            </ul>
          </div>

          <div>
            <p className="heading-section text-white/40">{t("footer.contact")}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>hello@pedroeluz.com</li>
              <li>Lisbon, Portugal</li>
              <li>Greater Palm Springs, California</li>
              <li><Link to="/contact" className="text-[var(--brass)] hover:text-white">{t("footer.requestConsult")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} {t("footer.rights")}</p>
          <p className="label-tag text-white/30">{t("footer.locations")}</p>
        </div>
      </div>
    </footer>
  );
}
