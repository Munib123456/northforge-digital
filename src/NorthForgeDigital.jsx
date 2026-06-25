import React, { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// Quayside Digital — one-page consultancy site (v3, Linear/dark)
// Brand placeholder: "Quayside Digital". Swap BRAND to rename.
// Replace EMAIL / LINKEDIN before launch.
// TESTIMONIALS below are PLACEHOLDERS — replace with real client
// quotes after your first few free audits. Do not launch with fakes.
// ─────────────────────────────────────────────────────────────

const BRAND = "NorthForge Digital";
const OWNER = "Munib Ahmed";
const EMAIL = "hello@northforgedigital.co.uk"; // ← change
const LINKEDIN = "https://linkedin.com/in/your-handle"; // ← change

const ACCENT = "#5E6AD2";
const ACCENT_BRIGHT = "#7C8AF0";
const FG = "#F2F2F4";
const FG_MUTED = "#9098A3";

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, as: Tag = "div", style }) {
  const [ref, shown] = useReveal();
  return (
    <Tag ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(20px)",
      transition: `opacity .55s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .55s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      ...style,
    }}>{children}</Tag>
  );
}

// Glass card with cursor-following spotlight + accent edge glow
function SpotCard({ children, style, pad = 26 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: -300, y: -300, on: false });
  const move = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  }, []);
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => setPos((p) => ({ ...p, on: false }))}
      className="qd-card qd-hover"
      style={{ position: "relative", overflow: "hidden", padding: pad, height: "100%", ...style }}>
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: pos.on ? 1 : 0, transition: "opacity .35s ease",
        background: `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, rgba(124,138,240,0.16), transparent 65%)`,
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit", padding: 1,
        opacity: pos.on ? 1 : 0, transition: "opacity .35s ease",
        background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(124,138,240,0.5), transparent 60%)`,
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude",
      }} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

export default function QuaysideDigital() {
  const [form, setForm] = useState({ name: "", website: "", email: "", note: "" });
  const [sent, setSent] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = () => {
    if (!form.website || !form.email) return;
    const body = encodeURIComponent(`Name: ${form.name}\nWebsite: ${form.website}\nEmail: ${form.email}\n\n${form.note}`);
    window.location.href = `mailto:${EMAIL}?subject=Website%20review%20request&body=${body}`;
    setSent(true);
  };

  const nav = [["How it works", "#how"], ["Services", "#services"], ["Sample report", "#sample"], ["About", "#about"]];

  const steps = [
    { n: "01", t: "Quick check", d: "I view your site like a customer would, on a phone first. Two minutes tells me if anything is worth flagging." },
    { n: "02", t: "Full review", d: "Speed, mobile layout, how easy you are to contact or book, and whether the site looks trustworthy. AI speeds it up; I check every finding." },
    { n: "03", t: "Plain report", d: "What is wrong, why it costs you enquiries, and what fixing it looks like. No jargon, no upsell." },
    { n: "04", t: "Fix it", d: "A few fixes, a rebuild, or nothing. I tell you honestly which one you need." },
  ];

  const fixes = [
    { t: "Hard to contact on a phone", d: "Tiny buttons, a number you cannot tap, a form that breaks. Around 6 in 10 visitors are on mobile. If it is awkward, they leave.", span: 4 },
    { t: "Slow to load", d: "Over half of people leave a page that takes more than 3 seconds.", span: 2 },
    { t: "Confusing booking", d: "If booking is not obvious in seconds, that is a lost customer.", span: 2 },
    { t: "Looks out of date", d: "No reviews shown, old design, no clear contact details. Small things that quietly make people doubt you.", span: 4 },
    { t: "Invisible on Google", d: "A neglected Google profile means missing the people searching for you now.", span: 3 },
    { t: "Broken on mobile", d: "Overflowing text, cut-off images, menus that do not work.", span: 3 },
  ];

  const services = [
    { t: "Website review", d: "A full health check with a clear, ranked list of what to fix first.", tag: "Start here" },
    { t: "Targeted fixes", d: "Speed, mobile layout, contact forms, and booking flow sorted without a full rebuild." },
    { t: "Google profile setup", d: "Get found by people searching locally, with hours, photos, and reviews in place." },
    { t: "Website rebuild", d: "A fast, modern site when patching the old one is no longer worth it." },
    { t: "Ongoing support", d: "Updates, backups, and small changes so the site keeps working after launch." },
    { t: "Booking and forms", d: "Simpler forms and booking that more visitors actually finish." },
  ];

  // PLACEHOLDER testimonials — replace with real ones after your first audits.
  const reviews = [
    { q: "Found three things on our site I had no idea were turning people away. The phone fix alone got us more calls.", name: "Sarah", role: "Salon owner, Gosforth" },
    { q: "Straight talking. He told me I did not need a new site, just a few fixes. Saved me hundreds.", name: "Dale", role: "Plumber, Gateshead" },
    { q: "The report was simple enough that I actually understood it. Bookings are up since the changes.", name: "Priya", role: "Clinic manager, Jesmond" },
  ];

  return (
    <div style={{ background: "#050506", color: FG, fontFamily: '"Geist", "Inter", system-ui, sans-serif', lineHeight: 1.55, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${ACCENT}; color: #fff; }
        :target { scroll-margin-top: 88px; }
        .qd-wrap { max-width: 1140px; margin: 0 auto; padding: 0 22px; }
        .qd-mono { font-family: "Geist Mono", ui-monospace, monospace; }
        .qd-card {
          background: linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.06), 0 2px 24px rgba(0,0,0,0.45), 0 0 50px rgba(0,0,0,0.2);
          transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s cubic-bezier(.16,1,.3,1), border-color .35s ease;
        }
        .qd-hover:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.12); box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.08), 0 12px 44px rgba(0,0,0,0.55), 0 0 70px rgba(94,106,210,0.14); }
        .qd-btn { font-family: inherit; cursor: pointer; border: none; transition: all .2s cubic-bezier(.16,1,.3,1); position: relative; overflow: hidden; }
        .qd-btn:active { transform: scale(.98); }
        .qd-btn-primary { background: ${ACCENT}; color: #fff; font-weight: 600; box-shadow: 0 0 0 1px rgba(94,106,210,0.5), 0 6px 18px rgba(94,106,210,0.35), inset 0 1px 0 0 rgba(255,255,255,0.25); }
        .qd-btn-primary:hover { background: #6872D9; box-shadow: 0 0 0 1px rgba(94,106,210,0.65), 0 8px 26px rgba(94,106,210,0.5), inset 0 1px 0 0 rgba(255,255,255,0.3); }
        .qd-btn-ghost { background: rgba(255,255,255,0.05); color: ${FG}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1); }
        .qd-btn-ghost:hover { background: rgba(255,255,255,0.09); }
        .qd-link { color: ${FG_MUTED}; text-decoration: none; transition: color .2s ease; }
        .qd-link:hover { color: ${FG}; }
        .qd-input { font-family: inherit; font-size: 16px; width: 100%; padding: 13px 15px; background: #0E0E11; border: 1px solid rgba(255,255,255,0.10); border-radius: 10px; color: #f3f4f6; transition: border-color .2s ease, box-shadow .2s ease; }
        .qd-input::placeholder { color: #636b78; }
        .qd-input:focus { outline: none; border-color: ${ACCENT}; box-shadow: 0 0 0 3px rgba(94,106,210,0.25); }
        .qd-btn:focus-visible, .qd-link:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; border-radius: 6px; }
        h1,h2,h3 { line-height: 1.04; letter-spacing: -0.025em; font-weight: 600; }
        .qd-grad { background: linear-gradient(180deg, #fff 25%, rgba(255,255,255,0.62)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .qd-accent { background: linear-gradient(100deg, ${ACCENT}, #9aa6ff, ${ACCENT}); background-size: 220% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 7s linear infinite; }
        @keyframes shimmer { to { background-position: 220% center; } }
        @keyframes float1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(0,-30px) rotate(2deg); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(24px,18px); } }
        @keyframes pulse { 0%,100% { opacity: .07; } 50% { opacity: .15; } }
        .qd-bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
        .qd-svc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .qd-rev { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .qd-navlinks { display: none; }
        @media (min-width: 820px) { .qd-navlinks { display: flex; } .qd-menu-btn { display: none; } }
        @media (max-width: 819px) {
          .qd-bento, .qd-svc, .qd-rev { grid-template-columns: 1fr; }
          .qd-bento > * { grid-column: 1 / -1 !important; }
        }
        @media (min-width: 560px) and (max-width: 819px) { .qd-svc, .qd-rev { grid-template-columns: 1fr 1fr; } }
        @media (prefers-reduced-motion: reduce) { *, html { scroll-behavior: auto; animation: none !important; } }
      `}</style>

      {/* AMBIENT BACKGROUND */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at top, #0b0b11 0%, #050506 52%, #020203 100%)" }}>
        <div style={{ position: "absolute", top: -220, left: "50%", marginLeft: -460, width: 920, height: 1000, borderRadius: "50%", background: "rgba(94,106,210,0.22)", filter: "blur(155px)", animation: "float1 9s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: 320, left: -220, width: 620, height: 800, borderRadius: "50%", background: "rgba(150,94,210,0.13)", filter: "blur(125px)", animation: "float2 11s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: 220, right: -160, width: 520, height: 720, borderRadius: "50%", background: "rgba(94,150,210,0.12)", filter: "blur(105px)", animation: "float1 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -120, left: "30%", width: 720, height: 520, borderRadius: "50%", background: "rgba(94,106,210,1)", filter: "blur(150px)", animation: "pulse 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* NAV */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: scrolled ? "rgba(5,5,6,0.72)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "transparent"}`, transition: "background .3s ease, border-color .3s ease" }}>
          <div className="qd-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
            <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: FG, fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>
              <span style={{ width: 11, height: 11, borderRadius: 3, background: ACCENT, boxShadow: `0 0 12px ${ACCENT}`, transform: "rotate(45deg)" }} />
              {BRAND}
            </a>
            <nav className="qd-navlinks" style={{ gap: 30, alignItems: "center", fontSize: 14.5 }}>
              {nav.map(([t, h]) => <a key={h} href={h} className="qd-link">{t}</a>)}
              <a href="#contact" className="qd-btn qd-btn-primary" style={{ padding: "9px 17px", borderRadius: 9, fontSize: 14, textDecoration: "none" }}>Free review</a>
            </nav>
            <button className="qd-btn qd-menu-btn" aria-label="Menu" onClick={() => setMenu((m) => !m)} style={{ background: "transparent", color: FG, padding: 8, borderRadius: 8 }}>
              {menu ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
          {menu && (
            <div style={{ background: "rgba(5,5,6,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "14px 22px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
              {nav.map(([t, h]) => <a key={h} href={h} className="qd-link" onClick={() => setMenu(false)} style={{ padding: "11px 0", fontSize: 16 }}>{t}</a>)}
              <a href="#contact" className="qd-btn qd-btn-primary" onClick={() => setMenu(false)} style={{ padding: 13, borderRadius: 9, textAlign: "center", textDecoration: "none", marginTop: 8 }}>Free review</a>
            </div>
          )}
        </header>

        <main id="top">
          {/* HERO */}
          <section style={{ padding: "clamp(72px,11vw,128px) 0 clamp(64px,9vw,104px)" }}>
            <div className="qd-wrap" style={{ textAlign: "center" }}>
              <Reveal>
                <div className="qd-mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase", color: FG_MUTED, padding: "7px 14px", border: "1px solid rgba(94,106,210,0.3)", borderRadius: 999, marginBottom: 28, background: "rgba(94,106,210,0.05)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                  Newcastle &amp; the North East
                </div>
              </Reveal>
              <Reveal delay={70}>
                <h1 style={{ fontSize: "clamp(38px,7.2vw,78px)", maxWidth: 900, margin: "0 auto", letterSpacing: "-0.035em", lineHeight: 1.02 }}>
                  <span className="qd-grad">Your website could be </span>
                  <span className="qd-accent">losing you customers.</span>
                  <span className="qd-grad"> I find out why.</span>
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p style={{ fontSize: "clamp(17px,2.1vw,20px)", color: FG_MUTED, maxWidth: 540, margin: "24px auto 0", lineHeight: 1.55 }}>
                  I review local business websites, show you what stops people calling or booking, then fix it. Plain English, no waffle.
                </p>
              </Reveal>
              <Reveal delay={230}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 36 }}>
                  <a href="#contact" className="qd-btn qd-btn-primary" style={{ padding: "15px 28px", borderRadius: 11, fontSize: 16, textDecoration: "none" }}>Get a free review</a>
                  <a href="#sample" className="qd-btn qd-btn-ghost" style={{ padding: "15px 26px", borderRadius: 11, fontSize: 16, textDecoration: "none" }}>See a sample</a>
                </div>
              </Reveal>
              <Reveal delay={300}>
                <p className="qd-mono" style={{ marginTop: 26, fontSize: 12, color: "#5d6470", letterSpacing: "0.04em" }}>CS graduate · one business at a time · no obligation</p>
              </Reveal>
            </div>
          </section>

          {/* PROBLEM STRIP */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(52px,7vw,76px) 0" }}>
            <div className="qd-wrap">
              <Reveal>
                <p style={{ fontSize: "clamp(21px,3vw,30px)", maxWidth: 820, lineHeight: 1.3, letterSpacing: "-0.015em" }}>
                  <span style={{ color: FG }}>Most owners think their website is fine because it exists.</span>{" "}
                  <span style={{ color: FG_MUTED }}>But a slow page or a broken form can cost real enquiries every week, and you would never know.</span>
                </p>
              </Reveal>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>How it works</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 560, marginBottom: 12 }}>Diagnose first. Fix what matters.</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, maxWidth: 500, marginBottom: 44, fontSize: 17 }}>Most agencies want to sell you a new site. I start by telling you if you even need one.</p></Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(218px,1fr))", gap: 14 }}>
                {steps.map((s, i) => (
                  <Reveal key={s.n} delay={i * 70}>
                    <SpotCard pad={24}>
                      <div className="qd-mono" style={{ fontSize: 13, color: ACCENT_BRIGHT, letterSpacing: "0.1em", marginBottom: 18, opacity: 0.9 }}>{s.n}</div>
                      <h3 style={{ fontSize: 19, marginBottom: 8, color: FG }}>{s.t}</h3>
                      <p style={{ color: FG_MUTED, fontSize: 14.5 }}>{s.d}</p>
                    </SpotCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* WHAT I LOOK FOR (bento) */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>What I look for</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 560, marginBottom: 44 }}>What quietly turns visitors away</h2></Reveal>
              <div className="qd-bento">
                {fixes.map((f, i) => (
                  <div key={f.t} style={{ gridColumn: `span ${f.span}` }}>
                    <Reveal delay={i * 60} style={{ height: "100%" }}>
                      <SpotCard pad={24} style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ width: 9, height: 9, borderRadius: 2, background: ACCENT, boxShadow: `0 0 12px ${ACCENT}`, marginBottom: 16, transform: "rotate(45deg)" }} />
                        <h3 style={{ fontSize: 18, marginBottom: 7, color: FG }}>{f.t}</h3>
                        <p style={{ color: FG_MUTED, fontSize: 14.5 }}>{f.d}</p>
                      </SpotCard>
                    </Reveal>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>Services</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 540, marginBottom: 12 }}>What I can do for you</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, maxWidth: 500, marginBottom: 44, fontSize: 17 }}>Start with a free review. Everything below follows only if it is worth your money.</p></Reveal>
              <div className="qd-svc">
                {services.map((s, i) => (
                  <Reveal key={s.t} delay={i * 55} style={{ height: "100%" }}>
                    <SpotCard pad={24} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {s.tag && <span className="qd-mono" style={{ alignSelf: "flex-start", fontSize: 10.5, color: ACCENT_BRIGHT, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(94,106,210,0.35)", padding: "3px 8px", borderRadius: 999, marginBottom: 4 }}>{s.tag}</span>}
                      <h3 style={{ fontSize: 18, color: FG }}>{s.t}</h3>
                      <p style={{ color: FG_MUTED, fontSize: 14.5 }}>{s.d}</p>
                    </SpotCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* SAMPLE REPORT */}
          <section id="sample" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>Sample report</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 520, marginBottom: 12 }}>Exactly what you get</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, maxWidth: 520, marginBottom: 40, fontSize: 17 }}>A short, visual review with a 90-second video walkthrough. Yours is specific to your site.</p></Reveal>
              <Reveal delay={150}><SampleReport /></Reveal>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>What people say</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 520, marginBottom: 44 }}>From recent reviews</h2></Reveal>
              <div className="qd-rev">
                {reviews.map((r, i) => (
                  <Reveal key={i} delay={i * 70} style={{ height: "100%" }}>
                    <SpotCard pad={26} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22 }}>
                      <div>
                        <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                          {[0,1,2,3,4].map((s) => <Star key={s} />)}
                        </div>
                        <p style={{ fontSize: 16, color: "#d6dae1", lineHeight: 1.5 }}>{r.q}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <span style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #5E6AD2, #9aa6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#fff" }}>{r.name[0]}</span>
                        <div>
                          <div style={{ fontSize: 14.5, fontWeight: 600, color: FG }}>{r.name}</div>
                          <div style={{ fontSize: 13, color: FG_MUTED }}>{r.role}</div>
                        </div>
                      </div>
                    </SpotCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap" style={{ maxWidth: 720 }}>
              <Reveal><Label>About</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(26px,4vw,40px)", marginBottom: 20 }}>A local CS graduate, not a call centre</h2></Reveal>
              <Reveal delay={110}>
                <div style={{ color: "#c2c7cf", fontSize: 17, display: "grid", gap: 14 }}>
                  <p>I am {OWNER}, a Computer Science graduate in Newcastle. I build and fix websites, and I am good at spotting the small things that make a site harder to use.</p>
                  <p>I work with one business at a time, so you get real attention. AI helps me move fast, but I check every finding myself. You never get nonsense dressed up as expertise.</p>
                  <p>If your site needs a few tweaks, I say so. If it needs rebuilding, I say that too. The honest answer is the point.</p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(64px,9vw,112px) 0 clamp(72px,10vw,120px)" }}>
            <div className="qd-wrap" style={{ maxWidth: 540 }}>
              <Reveal><div style={{ textAlign: "center" }}><Label center>Free, no obligation</Label></div></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", textAlign: "center", marginBottom: 14 }}>Get your free review</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, fontSize: 17, textAlign: "center", maxWidth: 420, margin: "0 auto 36px" }}>Send your website. I reply with the main things worth fixing. No pressure to buy.</p></Reveal>
              <Reveal delay={160}>
                <SpotCard pad={28}>
                  {sent ? (
                    <div style={{ textAlign: "center", padding: "14px 0" }}>
                      <div style={{ fontSize: 38, marginBottom: 8, color: ACCENT_BRIGHT }}>✓</div>
                      <h3 style={{ fontSize: 20, marginBottom: 8, color: FG }}>Your email is ready</h3>
                      <p style={{ color: FG_MUTED, fontSize: 15 }}>If your email app did not open, message me at <a href={`mailto:${EMAIL}`} style={{ color: ACCENT_BRIGHT, fontWeight: 600 }}>{EMAIL}</a>.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 14 }}>
                      <Field label="Your website" required><input className="qd-input" placeholder="yourbusiness.co.uk" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Field>
                      <Field label="Your email" required><input className="qd-input" type="email" placeholder="you@business.co.uk" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                      <Field label="Your name"><input className="qd-input" placeholder="First name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                      <Field label="Anything to look at? (optional)"><textarea className="qd-input" rows={3} placeholder="e.g. nobody uses our booking form" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
                      <button className="qd-btn qd-btn-primary" onClick={submit} style={{ padding: 15, borderRadius: 11, fontSize: 16, marginTop: 4 }}>Send me a free review</button>
                      <p style={{ fontSize: 12.5, color: "#5d6470", textAlign: "center" }}>I only use your details to reply about your review.</p>
                    </div>
                  )}
                </SpotCard>
              </Reveal>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer style={{ background: "#020203", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "38px 0" }}>
          <div className="qd-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: FG, fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: ACCENT, boxShadow: `0 0 10px ${ACCENT}`, transform: "rotate(45deg)" }} />
              {BRAND}
            </div>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
              <a href={`mailto:${EMAIL}`} className="qd-link">{EMAIL}</a>
              <a href={LINKEDIN} className="qd-link">LinkedIn</a>
              <span style={{ color: FG_MUTED }}>Newcastle upon Tyne</span>
            </div>
          </div>
          <div className="qd-wrap" style={{ marginTop: 16, fontSize: 12.5, color: "#4a5159" }}>
            © {new Date().getFullYear()} {BRAND}. Findings are based on a publicly observable website review only.
          </div>
        </footer>
      </div>
    </div>
  );
}

function Label({ children, center }) {
  return (
    <div className="qd-mono" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, color: ACCENT_BRIGHT, marginBottom: 18, justifyContent: center ? "center" : "flex-start" }}>
      <span style={{ width: 22, height: 1, background: `linear-gradient(to right, ${ACCENT}, transparent)` }} />
      {children}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: FG, marginBottom: 7 }}>
        {label}{required && <span style={{ color: ACCENT_BRIGHT }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function Star() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="#7C8AF0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}

function SampleReport() {
  const rows = [
    { label: "Critical", color: "#c0492f", title: "Phone number is not tappable on mobile", impact: "Around 6 in 10 visitors are on phones. They have to copy the number by hand, and many will not bother." },
    { label: "Critical", color: "#c0492f", title: "Pages take 6+ seconds to load", impact: "Over half of people leave after 3 seconds. You lose them before they see a word." },
    { label: "Important", color: "#e08a2a", title: "Booking form has 11 fields", impact: "Long forms put people off. Cutting to 4 usually lifts completed bookings." },
    { label: "Important", color: "#e08a2a", title: "No reviews shown anywhere", impact: "Your Google reviews are strong but invisible on the site, where trust is decided." },
    { label: "Quick win", color: "#3d8a5f", title: "Google profile missing opening hours", impact: "People searching nearby skip listings with no hours. A 5-minute fix." },
  ];
  return (
    <div className="qd-card" style={{ overflow: "hidden", maxWidth: 780 }}>
      <div style={{ background: "linear-gradient(to bottom, rgba(94,106,210,0.13), rgba(255,255,255,0.02))", padding: "22px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <div className="qd-mono" style={{ fontSize: 11, color: ACCENT_BRIGHT, letterSpacing: "0.13em", textTransform: "uppercase" }}>Website review</div>
          <div style={{ fontSize: 21, marginTop: 4, color: FG, fontWeight: 600, letterSpacing: "-0.01em" }}>Sample: a Newcastle barber</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="qd-accent" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}>58<span style={{ fontSize: 18, color: FG_MUTED }}>/100</span></div>
          <div className="qd-mono" style={{ fontSize: 10.5, color: FG_MUTED, marginTop: 3, letterSpacing: "0.1em" }}>HEALTH SCORE</div>
        </div>
      </div>
      <div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "17px 26px", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)", alignItems: "flex-start" }}>
            <span className="qd-mono" style={{ flexShrink: 0, fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff", background: r.color, padding: "4px 9px", borderRadius: 6, marginTop: 2 }}>{r.label}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15.5, color: FG, marginBottom: 3 }}>{r.title}</div>
              <div style={{ color: FG_MUTED, fontSize: 14 }}>{r.impact}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="qd-mono" style={{ padding: "14px 26px", background: "rgba(94,106,210,0.08)", fontSize: 12.5, color: "#a9b0e0", borderTop: "1px solid rgba(255,255,255,0.06)", letterSpacing: "0.02em" }}>
        Effort to fix the critical items: <strong style={{ color: FG }}>about half a day.</strong> No rebuild needed.
      </div>
    </div>
  );
}

function MenuIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
}
function CloseIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
