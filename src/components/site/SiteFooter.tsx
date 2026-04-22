import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "var(--surface-darker)" }}
    >
      <div className="container-edge py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-2xl tracking-[0.25em]">BOURIM</div>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Architecture engineered for tomorrow. Licensed California architect.
              Lisbon · California · International.
            </p>
          </div>

          <div>
            <p className="heading-section text-white/40">Services</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link to="/services/new-home-build" className="hover:text-white">New Home Build</Link></li>
              <li><Link to="/services/remodeling" className="hover:text-white">Remodeling</Link></li>
              <li><Link to="/services/home-additions" className="hover:text-white">Home Additions</Link></li>
              <li><Link to="/services/commercial" className="hover:text-white">Commercial</Link></li>
            </ul>
          </div>

          <div>
            <p className="heading-section text-white/40">Studio</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link to="/process" className="hover:text-white">Process</Link></li>
              <li><Link to="/portfolio" className="hover:text-white">Portfolio</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/partners" className="hover:text-white">Partners</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Studio Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <p className="heading-section text-white/40">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>hello@bourim.com</li>
              <li>Lisbon, Portugal</li>
              <li>Greater Palm Springs, California</li>
              <li><Link to="/contact" className="text-[var(--brass)] hover:text-white">Request Consultation →</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} Bourim Architecture Studio · Licensed California Architect · All Rights Reserved</p>
          <p className="label-tag text-white/30">Lisbon · California · International</p>
        </div>
      </div>
    </footer>
  );
}
