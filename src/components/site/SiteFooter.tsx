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
            <div className="font-display text-2xl tracking-[0.25em] text-[var(--brass)]">PEDRA & LUZ</div>
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
              <li><a href="mailto:hello@pedroeluz.com" className="hover:text-white">hello@pedroeluz.com</a></li>
              <li><a href="tel:+351915873259" className="hover:text-white">+351 915 873 259</a></li>
              <li>
                <a
                  href="https://wa.me/17606096731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--brass)] hover:text-white"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  WhatsApp +1 (760) 609-6731
                </a>
              </li>
              <li>Lisbon, Portugal</li>
              <li>Greater Palm Springs, California</li>
              <li>
                <a
                  href="https://www.tiktok.com/@lightstone_pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.34a8.16 8.16 0 0 0 4.77 1.52V6.41a4.85 4.85 0 0 1-1.84-.27z" />
                  </svg>
                  TikTok @lightstone_pt
                </a>
              </li>
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
