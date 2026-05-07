import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/proposals/yulia")({
  head: () => ({
    meta: [
      { title: "Proposal — Yuliya Pozdniak · Pedra & Luz" },
      { name: "description", content: "Private proposal for Yuliya Pozdniak." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: YuliaProposalPage,
});

const ACCESS_CODE = "welcome";
const STORAGE_KEY = "proposal_yulia_unlocked";

function YuliaProposalPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError("Invalid access code.");
    }
  };

  if (!unlocked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#1a1814",
          color: "#f4f0e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            border: "0.5px solid rgba(200,169,110,0.35)",
            padding: 40,
            maxWidth: 380,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              color: "#c8a96e",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Pedra & Luz
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6e6a62", marginBottom: 28 }}>
            Private Proposal
          </div>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Access code"
            autoFocus
            style={{
              width: "100%",
              background: "transparent",
              border: "0.5px solid rgba(200,169,110,0.35)",
              color: "#f4f0e8",
              padding: "12px 14px",
              fontSize: 13,
              letterSpacing: "0.1em",
              textAlign: "center",
              outline: "none",
              marginBottom: 12,
            }}
          />
          {error && <div style={{ color: "#c8a96e", fontSize: 11, marginBottom: 12 }}>{error}</div>}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "none",
              border: "0.5px solid #c8a96e",
              color: "#c8a96e",
              padding: "12px 18px",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <ProposalDeck />;
}

function ProposalDeck() {
  const [current, setCurrent] = useState(0);
  const total = 5;

  const go = (n: number) => {
    setCurrent(((n % total) + total) % total);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const handleGlobalClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button") || target.closest("input")) return;
    go(current + 1);
  };

  useEffect(() => {
    let lastScrollTime = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < 1000) return;
      const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
      if (e.deltaY > 50 && isAtBottom) {
        setCurrent((c) => (c + 1) % total);
        window.scrollTo(0, 0);
        lastScrollTime = now;
      }
    };
    let touchStart = 0;
    const onTouchStart = (e: TouchEvent) => { touchStart = e.changedTouches[0].screenY; };
    const onTouchEnd = (e: TouchEvent) => {
      const touchEnd = e.changedTouches[0].screenY;
      const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
      if (touchStart - touchEnd > 80 && isAtBottom) {
        setCurrent((c) => (c + 1) % total);
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("wheel", onWheel);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Tenor+Sans&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .pl-root { --stone:#1a1814;--stone-mid:#252118;--stone-warm:#302b22;--gold:#c8a96e;--gold-light:#e0c99a;--gold-dim:rgba(200,169,110,0.15);--cream:#f4f0e8;--cream-mid:#ccc8be;--muted:#6e6a62;--border:rgba(200,169,110,0.18);--border-s:rgba(200,169,110,0.35);
          background:var(--stone); color:var(--cream); font-family:'DM Sans',sans-serif; font-weight:300; line-height:1.5; min-height:100vh; cursor:pointer; overflow-x:hidden;
        }
        .pl-root *,.pl-root *::before,.pl-root *::after{box-sizing:border-box;margin:0;padding:0}
        .pl-pres{width:100%; max-width:860px; margin:0 auto; min-height:100vh; display:flex; flex-direction:column;}
        .pl-nav{display:flex;align-items:center;justify-content:space-between;padding:20px;border-bottom:0.5px solid var(--border); position:sticky; top:0; background:var(--stone); z-index:100;}
        .pl-nav-logo{font-family:'Cormorant Garamond',serif; font-weight:500; font-size:18px; letter-spacing:.1em; text-transform:uppercase; color:var(--gold);}
        .pl-nav-logo span{display:block; font-size:8px; letter-spacing:.15em; color:var(--muted); margin-top:2px; font-family:'DM Sans',sans-serif;}
        .pl-nav-dots{display:flex;gap:8px;align-items:center;}
        .pl-dot{width:6px;height:6px;border-radius:50%;background:var(--border-s);cursor:pointer;transition:background .25s;border:none;padding:0;}
        .pl-dot.active{background:var(--gold);}
        .pl-nav-btns{display:flex;gap:10px;}
        .pl-nav-btn{background:none;border:0.5px solid var(--border-s);color:var(--gold);font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:10px 18px;cursor:pointer;border-radius:2px;}
        .pl-slides{position:relative; flex-grow:1;}
        .pl-slide{display:none; min-height:85vh; flex-direction:column; justify-content:center; padding:60px 25px; user-select:none;}
        .pl-slide.active{display:flex;}
        .pl-brand-title{font-family:'Cormorant Garamond',serif; font-size:72px; font-weight:300; color:var(--gold); text-transform:uppercase; letter-spacing:0.05em; line-height:0.85; margin-bottom:15px;}
        .pl-s1-tag{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .pl-s1-tag::before{content:'';width:20px;height:0.5px;background:var(--gold);}
        .pl-s1-title{font-family:'Cormorant Garamond',serif; font-size:42px; font-weight:400; line-height:1.1; color:var(--cream-mid); margin-top:20px;}
        .pl-s1-title em{font-style:italic; color:var(--gold-light); border-top:1px solid var(--border); padding-top:10px; display:inline-block; margin-top:10px;}
        .pl-s1-client{margin-top:30px;}
        .pl-s1-client-name{font-family:'Cormorant Garamond',serif; font-size:24px; font-style:italic; color:var(--gold-light);}
        .pl-s1-meta{margin-top:30px; display:grid; grid-template-columns:1fr 1fr; gap:20px; padding-top:25px; border-top:0.5px solid var(--border);}
        .pl-s1-meta-label{font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);}
        .pl-s1-meta-val{font-size:12px;color:var(--cream);margin-top:4px; font-family:'Tenor Sans',sans-serif;}
        .pl-value-statement{font-size:13px; color:var(--gold-light); font-style:italic; margin-bottom:25px; max-width:500px; line-height:1.5; border-left:2px solid var(--gold); padding-left:15px;}
        .pl-features-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin-bottom:30px;}
        .pl-feat-item{font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:var(--gold); border:0.5px solid var(--border-s); padding:8px; text-align:center;}
        .pl-team-grid{display:grid; grid-template-columns:1fr; gap:20px; margin-top:15px;}
        .pl-team-member{border-left:1px solid var(--border); padding-left:15px;}
        .pl-team-name{font-family:'Cormorant Garamond',serif; font-size:18px; text-transform:uppercase; color:var(--gold); margin-bottom:2px;}
        .pl-team-role{font-size:8px; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); margin-bottom:6px;}
        .pl-team-bio{font-size:11px; color:var(--cream-mid); line-height:1.4;}
        .pl-section-label{font-size:9px;text-transform:uppercase;color:var(--gold);margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .pl-section-label::after{content:'';flex:1;height:0.5px;background:var(--border);}
        .pl-s4-grid{display:grid;grid-template-columns:1fr; gap:10px; margin-top:20px;}
        .pl-s4-item{background:var(--stone-mid);border:0.5px solid var(--border);padding:18px;display:flex;gap:15px;}
        .pl-s4-num{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold);opacity:0.6;}
        .pl-s4-item-title{font-family:'Tenor Sans',sans-serif; font-size:13px; text-transform:uppercase; color:var(--gold-light); margin-bottom:4px;}
        .pl-s4-item-desc{font-size:11px; color:var(--muted);}
        .pl-tl-item{display:flex;gap:15px;margin-bottom:15px;}
        .pl-tl-circle{width:32px;height:32px;border-radius:50%;border:0.5px solid var(--gold);background:var(--stone-mid);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--gold);font-family:'Cormorant Garamond',serif; flex-shrink:0;}
        .pl-tl-phase{font-family:'Cormorant Garamond',serif; font-size:20px; text-transform:uppercase; color:var(--gold-light); line-height:1;}
        .pl-tl-desc{font-size:10px; color:var(--muted); margin:2px 0;}
        .pl-tl-dur{font-size:14px; color:var(--cream); font-weight:400;}
        .pl-pay-item{display:flex;justify-content:space-between;padding:12px 0;border-bottom:0.5px solid var(--border); font-size:10px;}
        .pl-pay-pct{font-family:'Cormorant Garamond',serif; font-size:22px; color:var(--gold-light);}
        .pl-pay-total{margin-top:15px;padding:15px;background:var(--stone-mid);border:0.5px solid var(--border-s);display:flex;justify-content:space-between;align-items:center;}
        .pl-pay-total-val{font-family:'Cormorant Garamond',serif; font-size:24px; color:var(--gold-light);}
        .pl-s6-center{text-align:center;}
        .pl-s6-pre{font-size:12px; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); margin-bottom:15px;}
        .pl-s6-title{font-family:'Cormorant Garamond',serif; font-size:38px; text-transform:uppercase; color:var(--cream); line-height:1.1; margin-bottom:20px;}
        .pl-s6-contacts{display:grid; grid-template-columns:1fr; margin-top:30px; border:0.5px solid var(--border);}
        .pl-s6-contact{padding:15px; border-bottom:0.5px solid var(--border); text-decoration:none; cursor:pointer; position:relative; z-index:20; display:block; color:inherit;}
        .pl-s6-contact-val{font-size:12px; color:var(--gold); font-family:'Cormorant Garamond',serif;}
        .pl-counter{text-align:center;padding:15px;font-size:10px;color:var(--muted);border-top:0.5px solid var(--border); margin-top:auto;}
        @media (min-width:600px){
          .pl-brand-title{font-size:92px;}
          .pl-team-grid{grid-template-columns:1fr 1fr 1fr;}
          .pl-s4-grid{grid-template-columns:1fr 1fr;}
          .pl-s5-row{display:grid; grid-template-columns:1.2fr 0.8fr; gap:40px;}
          .pl-s6-contacts{grid-template-columns:repeat(4,1fr);}
          .pl-s6-contact{border-bottom:none; border-right:0.5px solid var(--border);}
        }
      `}</style>
      <div className="pl-root" onClick={handleGlobalClick}>
        <div className="pl-pres">
          <div className="pl-nav">
            <div className="pl-nav-logo">
              Pedra &amp; Luz<span>Architecture · International</span>
            </div>
            <div className="pl-nav-dots">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  className={`pl-dot${i === current ? " active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(i);
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="pl-nav-btns">
              <button className="pl-nav-btn" onClick={(e) => { e.stopPropagation(); go(current - 1); }}>
                Prev
              </button>
              <button className="pl-nav-btn" onClick={(e) => { e.stopPropagation(); go(current + 1); }}>
                Next
              </button>
            </div>
          </div>

          <div className="pl-slides">
            {/* Slide 0 — Cover */}
            <div className={`pl-slide${current === 0 ? " active" : ""}`}>
              <div className="pl-s1-tag">Proposal · PL-2026</div>
              <div className="pl-brand-title">Pedra<br />& Luz</div>
              <h1 className="pl-s1-title">
                Existing Conditions Survey <em>+ 3D Verification</em>
              </h1>
              <div className="pl-s1-client">
                <div className="pl-s1-meta-label">Prepared for</div>
                <div className="pl-s1-client-name">Yuliya Pozdniak</div>
              </div>
              <div className="pl-s1-meta">
                <div><div className="pl-s1-meta-label">Property</div><div className="pl-s1-meta-val">Cascais Res. (259sqm)</div></div>
                <div><div className="pl-s1-meta-label">Location</div><div className="pl-s1-meta-val">Portugal</div></div>
                <div><div className="pl-s1-meta-label">Total (incl. Tax)</div><div className="pl-s1-meta-val">€4,400.00</div></div>
                <div><div className="pl-s1-meta-label">Date</div><div className="pl-s1-meta-val">May 2026</div></div>
              </div>
            </div>

            {/* Slide 1 — Partners */}
            <div className={`pl-slide${current === 1 ? " active" : ""}`}>
              <div className="pl-section-label">The Partners</div>
              <p className="pl-value-statement">
                "Not the cheapest option — but built to avoid the problems that come from rushed or incomplete drawings."
              </p>
              <div className="pl-features-grid">
                <div className="pl-feat-item">U.S. Licensed Architect</div>
                <div className="pl-feat-item">3D Scan Verified</div>
                <div className="pl-feat-item">US · Asia · Europe</div>
                <div className="pl-feat-item">Architect-reviewed CAD</div>
                <div className="pl-feat-item">Clear deliverables</div>
              </div>
              <div className="pl-team-grid">
                <div className="pl-team-member">
                  <div className="pl-team-name">3D + Manual</div>
                  <div className="pl-team-bio">3D scanning verifies key dimensions. Every measurement is then checked manually on site by a trained eye.</div>
                </div>
                <div className="pl-team-member">
                  <div className="pl-team-name">Architect-reviewed</div>
                  <div className="pl-team-bio">Drawings are reviewed with an architect's eye, not just a technician's so they work for design, contractors and planning.</div>
                </div>
                <div className="pl-team-member">
                  <div className="pl-team-name">International standard</div>
                  <div className="pl-team-bio">Experienced across the US, Asia and Europe. Used to international clients and professional expectations.</div>
                </div>
              </div>
              <div className="pl-team-grid" style={{ marginTop: 30, borderTop: "0.5px solid var(--border)", paddingTop: 20 }}>
                <div className="pl-team-member">
                  <div className="pl-team-name">Ilya Bourim</div>
                  <div className="pl-team-role">Principal Architect</div>
                </div>
                <div className="pl-team-member">
                  <div className="pl-team-name">Pedro Aguiar</div>
                  <div className="pl-team-role">Operations & Technology Director</div>
                </div>
                <div className="pl-team-member">
                  <div className="pl-team-name">Francisco Manani</div>
                  <div className="pl-team-role">Lead Constructor</div>
                </div>
              </div>
            </div>

            {/* Slide 2 — Deliverables */}
            <div className={`pl-slide${current === 2 ? " active" : ""}`}>
              <div className="pl-section-label">Deliverables</div>
              <div className="pl-s4-grid">
                {[
                  { n: "01", t: "DWG Floor Plans", d: "High-precision verified CAD floor plans in professional DWG format." },
                  { n: "02", t: "PDF Drawing Set", d: "Fully annotated PDF set including room names and critical dimensions." },
                  { n: "03", t: "3D Verification", d: "LiDAR scan data used to cross-verify all site measurements." },
                  { n: "04", t: "Design Ready", d: "Architect-reviewed files ready for immediate design and contractor use." },
                ].map((it) => (
                  <div className="pl-s4-item" key={it.n}>
                    <div className="pl-s4-num">{it.n}</div>
                    <div>
                      <div className="pl-s4-item-title">{it.t}</div>
                      <div className="pl-s4-item-desc">{it.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide 3 — Timeline & Payment */}
            <div className={`pl-slide${current === 3 ? " active" : ""}`}>
              <div className="pl-s5-row">
                <div>
                  <div className="pl-section-label">Timeline</div>
                  {[
                    { n: "01", phase: "Site visit", desc: "Scheduled after deposit + access confirmation", dur: "1–3 working days" },
                    { n: "02", phase: "Draft delivery", desc: "CAD drawings issued for client review", dur: "5–7 days after visit" },
                    { n: "03", phase: "Final delivery", desc: "PDF + DWG files released on balance receipt", dur: "1–2 days after review" },
                  ].map((t) => (
                    <div className="pl-tl-item" key={t.n}>
                      <div className="pl-tl-circle">{t.n}</div>
                      <div>
                        <div className="pl-tl-phase">{t.phase}</div>
                        <div className="pl-tl-desc">{t.desc}</div>
                        <div className="pl-tl-dur">{t.dur}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="pl-section-label">Payment Terms</div>
                  <div className="pl-pay-item">
                    <div><div>Deposit (50%)</div><div style={{ color: "var(--muted)" }}>with contract signing</div></div>
                    <div className="pl-pay-pct">€2,200</div>
                  </div>
                  <div className="pl-pay-item">
                    <div><div>Balance (50%)</div><div style={{ color: "var(--muted)" }}>with deliverables</div></div>
                    <div className="pl-pay-pct">€2,200</div>
                  </div>
                  <div className="pl-pay-total">
                    <div>Total (incl. 23% VAT)</div>
                    <div className="pl-pay-total-val">€4,400.00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 4 — Contact */}
            <div className={`pl-slide${current === 4 ? " active" : ""}`}>
              <div className="pl-s6-center">
                <div className="pl-s6-pre">Yuliya Pozdniak</div>
                <div className="pl-s6-title">
                  START WITH ACCURATE DRAWINGS.<br />
                  <em>BUILD WITH CONFIDENCE.</em>
                </div>
                <div className="pl-s6-contacts">
                  <a href="https://pedraluz.lovable.app" className="pl-s6-contact" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    <div className="pl-s1-meta-label">Website</div>
                    <div className="pl-s6-contact-val">pedraluz.lovable.app</div>
                  </a>
                  <div className="pl-s6-contact">
                    <div className="pl-s1-meta-label">Email</div>
                    <div className="pl-s6-contact-val">hello@pedroeluz.com</div>
                  </div>
                  <a href="https://wa.me/351936661128" className="pl-s6-contact" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    <div className="pl-s1-meta-label">WhatsApp</div>
                    <div className="pl-s6-contact-val">+351 936 661 128</div>
                  </a>
                  <div className="pl-s6-contact">
                    <div className="pl-s1-meta-label">Phone</div>
                    <div className="pl-s6-contact-val">+351 915 873 259</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pl-counter">Slide {current + 1} of {total}</div>
        </div>
      </div>
    </>
  );
}
