import React, { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// NorthForge Digital — one-page consultancy site (v5)
// Voice: first person singular ("I"), honest solo positioning.
// Replace EMAIL if your real inbox differs. LinkedIn is set.
// TODO before launch (not in this file): favicon, OpenGraph meta,
//   real Privacy/Terms/Cookies pages, form backend, analytics.
// To add your photo: drop src/munib.jpg, add  import munibPhoto from "./munib.jpg";
//   at the top, and swap the placeholder div in About for an <img>.
// ─────────────────────────────────────────────────────────────

const BRAND = "NorthForge Digital";
const OWNER = "Munib Ahmed";
const EMAIL = "hello@north-forge.studio"; // ← must be a real inbox you can read
const LINKEDIN = "https://www.linkedin.com/in/munib-ahmed-53a568294/";

const ACCENT = "#5E6AD2";
const ACCENT_BRIGHT = "#7C8AF0";
const FG = "#F2F2F4";
const FG_MUTED = "#9098A3";
const RED = "#c0492f";
const GREEN = "#3d8a5f";

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.12 }
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
      <div style={{ position: "relative", height: "100%" }}>{children}</div>
    </div>
  );
}

export default function NorthForgeDigital() {
  const [form, setForm] = useState({ business: "", website: "", email: "", note: "" });
  const [sent, setSent] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.website || !form.email) return;

    const formData = new FormData(event.currentTarget);
    const body = new URLSearchParams();
    formData.forEach((value, key) => {
      body.append(key, value.toString());
    });

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    setSent(true);
  };

  const nav = [["How it works", "#how"], ["Services", "#services"], ["Pricing", "#pricing"], ["FAQ", "#faq"], ["About", "#about"]];

  const who = ["Dentists", "Trades & builders", "Mechanics", "Gyms", "Clinics", "Accountants", "Estate agents", "Barbers", "Restaurants"];

  const steps = [
    { n: "1", t: "Website review", d: "I go through your site like a customer would, on a phone first." },
    { n: "2", t: "Identify issues", d: "I find what is actually stopping enquiries, calls, and bookings." },
    { n: "3", t: "Recommend solutions", d: "A clear, ranked plan in plain English. Only what is worth doing." },
    { n: "4", t: "Implement", d: "A few fixes, a rebuild, or nothing. I deliver whatever you choose." },
  ];

  // Cause -> effect: why websites lose customers
  const causeEffect = [
    { cause: "Slow loading pages", effect: "Visitors leave before the page even appears." },
    { cause: "Broken or fiddly forms", effect: "Enquiries never reach you." },
    { cause: "Poor mobile experience", effect: "Lost bookings from phone users." },
    { cause: "Confusing layout", effect: "People can't find how to contact you." },
    { cause: "No reviews on show", effect: "Visitors doubt you and go elsewhere." },
    { cause: "Hard to find on Google", effect: "Local customers never see you." },
  ];

  const fixes = [
    { t: "Hard to contact on a phone", d: "Tiny buttons, a number you cannot tap, a form that breaks. Around 6 in 10 visitors are on mobile.", span: 4 },
    { t: "Slow to load", d: "Over half of people leave a page that takes more than 3 seconds.", span: 2 },
    { t: "Confusing booking", d: "If booking is not obvious in seconds, that is a lost customer.", span: 2 },
    { t: "Looks out of date", d: "No reviews shown, old design, no clear contact details. Small things that make people doubt you.", span: 4 },
    { t: "Invisible on Google", d: "A neglected Google profile means missing the people searching for you now.", span: 3 },
    { t: "Broken on mobile", d: "Overflowing text, cut-off images, menus that do not work.", span: 3 },
  ];

  // Services phrased as business outcomes
  const services = [
    { t: "Find what's costing you customers", d: "A full review of what's stopping your site getting enquiries.", tag: "Start here" },
    { t: "Fix what's putting people off", d: "Broken buttons, poor mobile layouts, slow pages, confusing forms and booking." },
    { t: "Rebuild it properly", d: "If the current site is too far gone, a clean modern rebuild from scratch." },
    { t: "Make it easy to contact you", d: "Mobile improvements so phone users can call, book, or enquire in seconds." },
    { t: "Turn visitors into enquiries", d: "Simpler booking and contact so more people actually finish." },
    { t: "Get found locally on Google", d: "Opening hours, services, photos, and trust signals on your Google profile." },
    { t: "Stop people leaving early", d: "Faster pages by compressing images and reducing what slows the site down." },
    { t: "Build trust at a glance", d: "Reviews, clearer wording, better service pages, and obvious next steps." },
    { t: "Keep it running smoothly", d: "Ongoing updates, small changes, monitoring, fixes, backups, and new pages." },
  ];

  const trust = [
    "Computer Science graduate, Northumbria University",
    "Based in Newcastle, not a faceless call centre",
    "Every recommendation reviewed by a real person",
    "No unnecessary rebuilds or upselling",
    "Plain English, never jargon",
    "Honest answers, even when they cost me work",
  ];

  const wontDo = [
    "Sell you a new website if yours only needs a few fixes.",
    "Bury you in technical jargon and frameworks.",
    "Recommend work you do not actually need.",
  ];

  const reviewSteps = [
    "You send me your website.",
    "I review it properly and find the biggest issues.",
    "I explain them in plain English.",
    "I recommend only the work that needs doing.",
    "You decide if you want me to fix anything.",
    "If not, you keep the review for free.",
  ];

  const faqs = [
    { q: "Do I actually need a new website?", a: "Often, no. Most sites just need a few targeted fixes. I will tell you honestly which one applies to you." },
    { q: "How long does a review take?", a: "The review itself is quick. I usually send it back within a day or two, with a short video walking through it." },
    { q: "Do you work with WordPress, Wix, Squarespace?", a: "Yes. I work with whatever your site is built on, and can fix the existing one rather than forcing a rebuild." },
    { q: "Can you work on my current site?", a: "Yes. Improving what you already have is usually the cheaper, faster option, and often all you need." },
    { q: "Is this a security test?", a: "No. I only review what is publicly visible. I do not do any kind of hacking, scanning, or intrusive testing." },
    { q: "What does it cost to get started?", a: "Nothing. The first review is free with no obligation. You only pay if you want me to carry out the work." },
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
        .qd-btn:focus-visible, .qd-link:focus-visible, .qd-faq:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; border-radius: 6px; }
        h1,h2,h3 { line-height: 1.04; letter-spacing: -0.025em; font-weight: 600; }
        .qd-grad { background: linear-gradient(180deg, #fff 25%, rgba(255,255,255,0.62)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .qd-accent { background: linear-gradient(100deg, ${ACCENT}, #9aa6ff, ${ACCENT}); background-size: 220% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 7s linear infinite; }
        @keyframes shimmer { to { background-position: 220% center; } }
        @keyframes float1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(0,-30px) rotate(2deg); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(24px,18px); } }
        @keyframes pulse { 0%,100% { opacity: .07; } 50% { opacity: .15; } }
        .qd-bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
        .qd-svc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .qd-ce { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .qd-steps4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; align-items: stretch; }
        .qd-two { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .qd-navlinks { display: none; }
        @media (min-width: 880px) { .qd-navlinks { display: flex; } .qd-menu-btn { display: none; } }
        @media (max-width: 879px) {
          .qd-bento, .qd-steps4, .qd-two { grid-template-columns: 1fr; }
          .qd-bento > * { grid-column: 1 / -1 !important; }
          .qd-svc, .qd-ce { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) { .qd-svc, .qd-ce { grid-template-columns: 1fr; } }
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
            <nav className="qd-navlinks" style={{ gap: 26, alignItems: "center", fontSize: 14.5 }}>
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
          <section style={{ padding: "clamp(72px,11vw,128px) 0 clamp(56px,8vw,88px)" }}>
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
                  <span className="qd-grad"> I find out why, and fix it.</span>
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p style={{ fontSize: "clamp(17px,2.1vw,21px)", color: FG_MUTED, maxWidth: 560, margin: "24px auto 0", lineHeight: 1.55 }}>
                  I review websites, find what's costing you customers, and put the right fix in place.
                </p>
              </Reveal>
              <Reveal delay={230}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 36 }}>
                  <a href="#contact" className="qd-btn qd-btn-primary" style={{ padding: "15px 28px", borderRadius: 11, fontSize: 16, textDecoration: "none" }}>Request your free website review</a>
                  <a href="#sample" className="qd-btn qd-btn-ghost" style={{ padding: "15px 26px", borderRadius: 11, fontSize: 16, textDecoration: "none" }}>See a sample</a>
                </div>
              </Reveal>
              <Reveal delay={300}>
                <p className="qd-mono" style={{ marginTop: 26, fontSize: 12, color: "#5d6470", letterSpacing: "0.04em" }}>One business at a time · honest advice · no obligation</p>
              </Reveal>
            </div>
          </section>

          {/* WHO I HELP */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(44px,6vw,64px) 0" }}>
            <div className="qd-wrap" style={{ textAlign: "center" }}>
              <Reveal>
                <p className="qd-mono" style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT_BRIGHT, marginBottom: 22 }}>I work with local businesses like</p>
              </Reveal>
              <Reveal delay={60}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  {who.map((w) => (
                    <span key={w} style={{ fontSize: 14.5, color: "#c8cdd5", padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)" }}>{w}</span>
                  ))}
                </div>
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

          {/* WHY WEBSITES LOSE CUSTOMERS (cause -> effect) */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>Why websites lose customers</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 560, marginBottom: 44 }}>Small problems, real lost business</h2></Reveal>
              <div className="qd-ce">
                {causeEffect.map((c, i) => (
                  <Reveal key={c.cause} delay={i * 55} style={{ height: "100%" }}>
                    <SpotCard pad={22} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CrossIcon color={RED} />
                        <span style={{ fontSize: 16.5, fontWeight: 600, color: FG }}>{c.cause}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 4 }}>
                        <ArrowDown />
                        <span style={{ fontSize: 14.5, color: FG_MUTED }}>{c.effect}</span>
                      </div>
                    </SpotCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>How it works</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 560, marginBottom: 12 }}>Diagnose first. Fix what matters.</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, maxWidth: 500, marginBottom: 44, fontSize: 17 }}>Most agencies want to sell you a new site. I start by telling you if you even need one.</p></Reveal>
              <div className="qd-steps4">
                {steps.map((s, i) => (
                  <Reveal key={s.n} delay={i * 70} style={{ height: "100%" }}>
                    <SpotCard pad={24} style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(94,106,210,0.15)", border: "1px solid rgba(94,106,210,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: ACCENT_BRIGHT, marginBottom: 16, fontSize: 17 }}>{s.n}</div>
                      <h3 style={{ fontSize: 18, marginBottom: 8, color: FG }}>{s.t}</h3>
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
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 560, marginBottom: 12 }}>What I can do for your business</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, maxWidth: 560, marginBottom: 44, fontSize: 17 }}>I don't just tell you what's wrong. I implement the fixes, improve your current website, or rebuild it if that's the better option.</p></Reveal>
              <div className="qd-svc">
                {services.map((s, i) => (
                  <Reveal key={s.t} delay={i * 45} style={{ height: "100%" }}>
                    <SpotCard pad={22} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {s.tag && <span className="qd-mono" style={{ alignSelf: "flex-start", fontSize: 10.5, color: ACCENT_BRIGHT, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(94,106,210,0.35)", padding: "3px 8px", borderRadius: 999, marginBottom: 3 }}>{s.tag}</span>}
                      <h3 style={{ fontSize: 17, color: FG }}>{s.t}</h3>
                      <p style={{ color: FG_MUTED, fontSize: 14 }}>{s.d}</p>
                    </SpotCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* WHY TRUST + WHAT I WON'T DO */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap qd-two">
              <Reveal>
                <Label>Why trust NorthForge</Label>
                <h2 className="qd-grad" style={{ fontSize: "clamp(26px,4vw,38px)", marginBottom: 28 }}>Built to be trusted</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {trust.map((w) => (
                    <div key={w} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <CheckIcon color={GREEN} />
                      <span style={{ fontSize: 16, color: "#d6dae1" }}>{w}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={100}>
                <Label>What I won't do</Label>
                <h2 className="qd-grad" style={{ fontSize: "clamp(26px,4vw,38px)", marginBottom: 28 }}>No pressure, no nonsense</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {wontDo.map((w) => (
                    <div key={w} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <CrossIcon color={RED} />
                      <span style={{ fontSize: 16, color: "#d6dae1" }}>{w}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* WHAT HAPPENS DURING A REVIEW */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>What happens during a review</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 560, marginBottom: 40 }}>No risk to you, no catch</h2></Reveal>
              <Reveal delay={120}>
                <SpotCard pad={30} style={{ maxWidth: 700 }}>
                  <div style={{ display: "grid", gap: 16 }}>
                    {reviewSteps.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "rgba(61,138,95,0.18)", border: "1px solid rgba(61,138,95,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckIcon color={GREEN} small /></span>
                        <span style={{ fontSize: 16, color: "#d6dae1" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </SpotCard>
              </Reveal>
            </div>
          </section>

          {/* SAMPLE REPORT */}
          <section id="sample" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap">
              <Reveal><Label>Sample report</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", maxWidth: 520, marginBottom: 12 }}>Exactly what you get</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, maxWidth: 540, marginBottom: 14, fontSize: 17 }}>A short, visual review with a 90-second video walkthrough. Yours is specific to your site.</p></Reveal>
              <Reveal delay={140}><p className="qd-mono" style={{ fontSize: 12, color: "#5d6470", marginBottom: 40, letterSpacing: "0.04em" }}>EXAMPLE ONLY — created to show the format</p></Reveal>
              <Reveal delay={170}><SampleReport /></Reveal>
            </div>
          </section>

          {/* PRICING (explainer, no numbers) */}
          <section id="pricing" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap" style={{ maxWidth: 760 }}>
              <Reveal><Label>Pricing</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", marginBottom: 12 }}>Simple, honest pricing</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, maxWidth: 540, marginBottom: 40, fontSize: 17 }}>Every business and website is different, so I don't do one-size-fits-all prices. Here's how it works.</p></Reveal>
              <Reveal delay={150}>
                <SpotCard pad={30}>
                  <div style={{ display: "grid", gap: 16 }}>
                    {[
                      "The first website review is completely free.",
                      "After the review, you get a clear, fixed quote for any work, with no obligation.",
                      "Small fixes cost far less than a rebuild, and I'll always point you to the cheaper option when it's the right one.",
                      "No hidden fees, no surprise charges, no pressure to go ahead.",
                    ].map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "rgba(61,138,95,0.18)", border: "1px solid rgba(61,138,95,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckIcon color={GREEN} small /></span>
                        <span style={{ fontSize: 16, color: "#d6dae1" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#contact" className="qd-btn qd-btn-primary" style={{ display: "inline-block", marginTop: 26, padding: "13px 24px", borderRadius: 11, fontSize: 15, textDecoration: "none" }}>Get my free review</a>
                </SpotCard>
              </Reveal>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap" style={{ maxWidth: 760 }}>
              <Reveal><Label>FAQ</Label></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", marginBottom: 40 }}>Questions, answered</h2></Reveal>
              <div style={{ display: "grid", gap: 12 }}>
                {faqs.map((f, i) => <Reveal key={i} delay={i * 40}><FaqItem q={f.q} a={f.a} /></Reveal>)}
              </div>
            </div>
          </section>

          {/* ABOUT (story-led, lower on page) */}
          <section id="about" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(60px,9vw,112px) 0" }}>
            <div className="qd-wrap" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start", maxWidth: 860 }}>
              <Reveal>
                {/* Photo placeholder. To use a real photo, add at the top of the file:
                    import munibPhoto from "./munib.jpg";  then replace this div with:
                    <img src={munibPhoto} alt="Munib Ahmed" width={132} height={132}
                      style={{ borderRadius: 20, objectFit: "cover",
                      border: "1px solid rgba(255,255,255,0.1)" }} /> */}
                <div style={{ width: 132, height: 132, borderRadius: 20, background: "linear-gradient(135deg, rgba(94,106,210,0.25), rgba(154,166,255,0.1))", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="qd-mono" style={{ fontSize: 12, color: FG_MUTED, textAlign: "center", padding: 12 }}>your photo here</span>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <Label>About</Label>
                <h2 className="qd-grad" style={{ fontSize: "clamp(24px,3.6vw,36px)", marginBottom: 18 }}>Why I started NorthForge</h2>
                <div style={{ color: "#c2c7cf", fontSize: 17, display: "grid", gap: 14 }}>
                  <p>I started NorthForge after noticing that most local businesses weren't losing customers because they had terrible websites. They were losing them because of small problems nobody had pointed out.</p>
                  <p>A broken booking form. A slow page. A site that's awkward on a phone. A confusing layout. Quiet issues that cost real enquiries every week.</p>
                  <p>My goal is simple: find those problems, explain them in plain English, and fix them. I'm {OWNER}, a Computer Science graduate from Northumbria University, based in Newcastle, and I work with one business at a time.</p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(64px,9vw,112px) 0 clamp(72px,10vw,120px)" }}>
            <div className="qd-wrap" style={{ maxWidth: 540 }}>
              <Reveal><div style={{ textAlign: "center" }}><Label center>Free, no obligation</Label></div></Reveal>
              <Reveal delay={60}><h2 className="qd-grad" style={{ fontSize: "clamp(30px,4.5vw,48px)", textAlign: "center", marginBottom: 14 }}>Request your free website review</h2></Reveal>
              <Reveal delay={110}><p style={{ color: FG_MUTED, fontSize: 17, textAlign: "center", maxWidth: 440, margin: "0 auto 36px" }}>Send your website. I reply with the main things worth fixing. No pressure to buy.</p></Reveal>
              <Reveal delay={160}>
                <SpotCard pad={28}>
                  {sent ? (
                    <div style={{ textAlign: "center", padding: "14px 0" }}>
                      <div style={{ fontSize: 38, marginBottom: 8, color: ACCENT_BRIGHT }}>✓</div>
                      <h3 style={{ fontSize: 20, marginBottom: 8, color: FG }}>Your review request is sent</h3>
                      <p style={{ color: FG_MUTED, fontSize: 15 }}>Thanks — I’ll review it and get back to you as soon as I can.</p>
                    </div>
                  ) : (
                    <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} style={{ display: "grid", gap: 14 }}>
                      <input type="hidden" name="form-name" value="contact" />
                      <input name="bot-field" style={{ display: "none" }} value="" onChange={() => {}} />
                      <Field label="Business name"><input className="qd-input" name="business" placeholder="Your business" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} /></Field>
                      <Field label="Your website" required><input className="qd-input" name="website" placeholder="yourbusiness.co.uk" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Field>
                      <Field label="Your email" required><input className="qd-input" name="email" type="email" placeholder="you@business.co.uk" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                      <Field label="Anything to look at? (optional)"><textarea className="qd-input" name="note" rows={3} placeholder="e.g. nobody uses our booking form" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
                      <button className="qd-btn qd-btn-primary" type="submit" style={{ padding: 15, borderRadius: 11, fontSize: 16, marginTop: 4 }}>Send my free review request</button>
                      <p style={{ fontSize: 12.5, color: "#5d6470", textAlign: "center" }}>I only use your details to reply about your review.</p>
                    </form>
                  )}
                </SpotCard>
              </Reveal>
              <Reveal delay={220}>
                <p style={{ textAlign: "center", marginTop: 40, fontSize: "clamp(18px,2.4vw,22px)", color: "#c2c7cf", maxWidth: 520, margin: "40px auto 0", lineHeight: 1.4 }}>
                  Your website should be helping your business grow, not quietly costing you customers.
                </p>
              </Reveal>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer style={{ background: "#020203", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 0" }}>
          <div className="qd-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: FG, fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: ACCENT, boxShadow: `0 0 10px ${ACCENT}`, transform: "rotate(45deg)" }} />
              {BRAND}
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              <a href={`mailto:${EMAIL}`} className="qd-link">{EMAIL}</a>
              <a href={LINKEDIN} className="qd-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="#contact" className="qd-link">Book a call</a>
              <span style={{ color: FG_MUTED }}>Newcastle upon Tyne</span>
            </div>
          </div>
          <div className="qd-wrap" style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", fontSize: 12.5, color: "#4a5159" }}>
            <span>© {new Date().getFullYear()} {BRAND}. Findings are based on a publicly observable website review only.</span>
            <span style={{ display: "flex", gap: 16 }}>
              <a href="/privacy" className="qd-link" style={{ fontSize: 12.5 }}>Privacy</a>
              <a href="/terms" className="qd-link" style={{ fontSize: 12.5 }}>Terms</a>
              <a href="/cookies" className="qd-link" style={{ fontSize: 12.5 }}>Cookies</a>
            </span>
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

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="qd-card" style={{ overflow: "hidden" }}>
      <button className="qd-btn qd-faq" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        style={{ width: "100%", background: "transparent", color: FG, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", fontSize: 16.5, fontWeight: 500 }}>
        {q}
        <span style={{ flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform .25s ease", color: ACCENT_BRIGHT, fontSize: 22, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 220 : 0, overflow: "hidden", transition: "max-height .3s cubic-bezier(.16,1,.3,1)" }}>
        <p style={{ padding: "0 22px 20px", color: FG_MUTED, fontSize: 15.5 }}>{a}</p>
      </div>
    </div>
  );
}

function CheckIcon({ color, small }) {
  const s = small ? 13 : 20;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>;
}
function CrossIcon({ color }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function ArrowDown() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C8AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>;
}

function SampleReport() {
  const rows = [
    { label: "Critical", color: "#c0492f", title: "Phone number is not tappable on mobile", impact: "Around 6 in 10 visitors are on phones. They have to copy the number by hand, and many won't bother.", fix: "Make it a tap-to-call link." },
    { label: "Critical", color: "#c0492f", title: "Pages take 6+ seconds to load", impact: "Over half of people leave after 3 seconds. You lose them before they see a word.", fix: "Compress images and clean up code." },
    { label: "Important", color: "#e08a2a", title: "Booking form has 11 fields", impact: "Long forms put people off. Cutting to 4 usually lifts completed bookings.", fix: "Trim to name, contact, date, service." },
    { label: "Important", color: "#e08a2a", title: "No reviews shown anywhere", impact: "Your Google reviews are strong but invisible on the site, where trust is decided.", fix: "Add a reviews strip near the top." },
    { label: "Quick win", color: "#3d8a5f", title: "Google profile missing opening hours", impact: "People searching nearby skip listings with no hours.", fix: "Add hours and photos. 5 minutes." },
  ];
  return (
    <div className="qd-card" style={{ overflow: "hidden", maxWidth: 820 }}>
      {/* header bar styled like a document */}
      <div style={{ background: "linear-gradient(to bottom, rgba(94,106,210,0.13), rgba(255,255,255,0.02))", padding: "22px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#c0492f" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#e08a2a" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#3d8a5f" }} />
          </div>
          <div>
            <div className="qd-mono" style={{ fontSize: 11, color: ACCENT_BRIGHT, letterSpacing: "0.13em", textTransform: "uppercase" }}>Website review</div>
            <div style={{ fontSize: 21, marginTop: 4, color: FG, fontWeight: 600, letterSpacing: "-0.01em" }}>Sample: a Newcastle barber</div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="qd-accent" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}>58<span style={{ fontSize: 18, color: FG_MUTED }}>/100</span></div>
          <div className="qd-mono" style={{ fontSize: 10.5, color: FG_MUTED, marginTop: 3, letterSpacing: "0.1em" }}>HEALTH SCORE</div>
        </div>
      </div>
      {/* column headers */}
      <div className="qd-mono" style={{ display: "grid", gridTemplateColumns: "92px 1fr", gap: 14, padding: "12px 26px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5d6470" }}>
        <span>Priority</span><span>Issue, impact &amp; fix</span>
      </div>
      <div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "92px 1fr", gap: 14, padding: "17px 26px", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)", alignItems: "flex-start" }}>
            <span className="qd-mono" style={{ alignSelf: "flex-start", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff", background: r.color, padding: "4px 9px", borderRadius: 6, justifySelf: "start" }}>{r.label}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15.5, color: FG, marginBottom: 4 }}>{r.title}</div>
              <div style={{ color: FG_MUTED, fontSize: 14, marginBottom: 6 }}>{r.impact}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#a9b0e0" }}>
                <CheckIcon color={GREEN} small />
                <span><strong style={{ color: "#c8cdd5", fontWeight: 600 }}>Fix:</strong> {r.fix}</span>
              </div>
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
