import React, { useState, useEffect, useRef } from "react";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:       #0d1117;
    --navy-mid:   #111827;
    --navy-light: #1c2333;
    --faint:      #3a4a5c;
    --muted:      #6b7f94;
    --silver:     #a8b8cc;
    --off-white:  #e8ecf0;
    --rain-blue:  #5b8fc9;
    --rain-soft:  #7aaed6;
    --blood-sky:  #1a0505;
    --crimson:    #8b1a1a;
    --ash-red:    #c0392b;
    --dim-red:    #4a1010;
    --serif: 'Georgia','Garamond','Times New Roman',serif;
    --sans:  'Segoe UI',system-ui,sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--off-white);
    font-family: var(--sans);
    min-height: 100vh;
    overflow-x: hidden;
    transition: background 0.8s;
  }

  body.demon-mode { background: var(--blood-sky); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--rain-blue); }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .page { display: none; }
  .page.active { display: block; animation: fadeIn 0.5s ease forwards; }

  #rain-canvas, #red-canvas {
    position: fixed; inset: 0;
    pointer-events: none;
    z-index: 1;
  }
  #red-canvas { display: none; }
  body.demon-mode #rain-canvas { display: none; }
  body.demon-mode #red-canvas  { display: block; }

  #thunder {
    position: fixed; inset: 0;
    background: rgba(180,210,255,0.04);
    pointer-events: none; z-index: 2;
    opacity: 0; transition: opacity 0.1s;
  }

  #clock {
    position: fixed; bottom: 20px; right: 24px; z-index: 200;
    font-family: var(--sans); font-size: 11px; color: var(--muted);
    letter-spacing: 0.06em; pointer-events: none;
  }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(13,17,23,0.85);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(8px);
    transition: background 0.6s, border-color 0.6s;
  }
  body.demon-mode nav {
    background: rgba(26,5,5,0.85);
    border-bottom-color: rgba(139,26,26,0.4);
  }
  .nav-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 24px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    background: none; border: none; cursor: pointer;
    font-family: var(--serif); font-size: 22px; color: var(--off-white);
  }
  .nav-links { display: flex; gap: 24px; flex-wrap: wrap; }
  .nav-link {
    background: none; border: none; cursor: pointer;
    font-family: var(--sans); font-size: 12px;
    letter-spacing: 0.05em; font-weight: 300;
    color: var(--muted); padding: 4px 0;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }
  .nav-link:hover { color: var(--off-white); }
  .nav-link.active { color: var(--rain-blue); border-bottom-color: var(--rain-blue); }
  body.demon-mode .nav-link.active { color: var(--ash-red); border-bottom-color: var(--ash-red); }

  .hamburger {
    display: none; background: none; border: none;
    cursor: pointer; color: var(--off-white); font-size: 20px;
  }
  .mobile-menu {
    display: none; flex-direction: column; gap: 16px;
    padding: 16px 24px;
    background: var(--navy-mid);
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .mobile-menu.open { display: flex; }

  @media (max-width: 780px) {
    .nav-links { display: none; }
    .hamburger { display: block; }
  }

  main { padding-top: 56px; }

  .section {
    min-height: 100vh;
    padding: 80px 24px 80px;
    max-width: 760px;
    margin: 0 auto;
  }
  .section.center {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
  }

  .eyebrow {
    font-family: var(--sans); font-size: 11px;
    color: var(--rain-blue); letter-spacing: 0.2em;
    margin-bottom: 12px;
  }
  h1 {
    font-family: var(--serif);
    font-size: clamp(36px, 7vw, 60px);
    font-weight: 400; color: var(--off-white);
    margin-bottom: 12px; line-height: 1.1;
  }
  .subtitle {
    font-family: var(--sans); font-size: 14px;
    color: var(--muted); font-weight: 300;
    margin-bottom: 64px;
  }
  p { line-height: 1.9; }

  .home-title {
    font-family: var(--serif);
    font-size: clamp(52px, 10vw, 88px);
    font-weight: 400; color: var(--off-white);
    letter-spacing: -0.02em; line-height: 1; margin-bottom: 6px;
  }
  .home-kana { font-family: var(--sans); font-size: 13px; color: var(--muted); letter-spacing: 0.2em; margin-bottom: 12px; }
  .home-gloss { font-family: var(--sans); font-size: 11px; color: var(--faint); letter-spacing: 0.15em; line-height: 2; margin-bottom: 40px; }
  .vline { width: 1px; height: 60px; background: linear-gradient(to bottom, transparent, var(--rain-blue), transparent); margin: 0 auto 40px; }
  .tagline { font-family: var(--serif); font-size: clamp(18px,3vw,22px); color: var(--silver); line-height: 2; margin-bottom: 40px; }
  .since { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; letter-spacing: 0.04em; margin-bottom: 48px; }
  .btn-storm {
    background: none; border: 1px solid var(--rain-blue);
    color: var(--rain-blue); font-family: var(--sans); font-size: 13px;
    letter-spacing: 0.1em; font-weight: 300;
    padding: 12px 32px; cursor: pointer;
    transition: background 0.3s, color 0.3s;
  }
  .btn-storm:hover { background: var(--rain-blue); color: var(--navy); }
  #cloud-btn {
    background: none; border: none; cursor: pointer;
    font-size: 40px; opacity: 0.35;
    transition: opacity 0.3s, transform 0.3s;
    display: block; margin: 72px auto 0;
  }
  #cloud-btn:hover { opacity: 0.7; transform: scale(1.1); }
  #cloud-count { font-size: 10px; color: var(--faint); letter-spacing: 0.1em; margin-top: 8px; min-height: 14px; text-align: center; }

  .timeline { position: relative; }
  .timeline::before {
    content: ''; position: absolute;
    left: 0; top: 8px; bottom: 8px; width: 1px;
    background: linear-gradient(to bottom, var(--rain-blue), var(--faint));
  }
  .tl-entry { padding-left: 36px; padding-bottom: 52px; position: relative; }
  .tl-dot { position: absolute; left: -5px; top: 9px; width: 11px; height: 11px; border-radius: 50%; background: var(--navy); border: 2px solid var(--rain-blue); }
  .tl-year { font-family: var(--serif); font-size: 28px; color: var(--off-white); font-weight: 400; display: inline; margin-right: 12px; }
  .tl-age { font-family: var(--sans); font-size: 11px; color: var(--rain-blue); letter-spacing: 0.1em; }
  .tl-title { font-family: var(--serif); font-size: 18px; color: var(--silver); font-weight: 400; margin: 4px 0 10px; }
  .tl-body { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; line-height: 1.9; }

  .note-entry { padding: 36px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .note-date { font-family: var(--sans); font-size: 11px; color: var(--rain-blue); letter-spacing: 0.12em; margin-bottom: 10px; }
  .note-title { font-family: var(--serif); font-size: 22px; color: var(--off-white); font-weight: 400; margin-bottom: 14px; }
  .note-body { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; line-height: 1.95; }

  .project-card { border: 1px solid rgba(255,255,255,0.06); padding: 32px 28px; margin-bottom: 2px; transition: border-color 0.3s; cursor: default; }
  .project-card:hover { border-color: var(--rain-blue); }
  .project-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .project-name { font-family: var(--serif); font-size: 20px; color: var(--off-white); font-weight: 400; }
  .project-year { font-family: var(--sans); font-size: 11px; color: var(--rain-blue); letter-spacing: 0.1em; margin-top: 3px; }
  .project-badge { font-family: var(--sans); font-size: 11px; color: var(--rain-blue); border: 1px solid var(--faint); padding: 4px 12px; letter-spacing: 0.08em; white-space: nowrap; }
  .project-why { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; line-height: 1.85; margin-bottom: 18px; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { font-family: var(--sans); font-size: 11px; background: var(--navy-light); color: var(--silver); padding: 3px 10px; border-radius: 2px; letter-spacing: 0.05em; }

  .valaden-hero { text-align: center; margin-bottom: 64px; }
  .valaden-title { font-family: var(--serif); font-size: clamp(48px,10vw,80px); font-weight: 400; color: var(--off-white); letter-spacing: 0.04em; margin-bottom: 14px; }
  .valaden-sub { font-family: var(--serif); font-size: 17px; color: var(--silver); font-style: italic; }
  .divider { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
  .divider-line { flex: 1; height: 1px; background: var(--faint); }
  .v-section { margin-bottom: 40px; }
  .v-section-title { font-family: var(--serif); font-size: 20px; color: var(--off-white); font-weight: 400; margin-bottom: 14px; }
  .v-body { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; line-height: 1.95; }
  .v-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .v-list li { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; }
  .v-list strong { color: var(--silver); font-weight: 400; }
  .coming-soon { font-family: var(--sans); font-size: 13px; color: var(--faint); font-style: italic; letter-spacing: 0.05em; }

  .d-eyebrow { font-family: var(--sans); font-size: 11px; color: var(--ash-red); letter-spacing: 0.2em; margin-bottom: 12px; }
  .d-body { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; line-height: 1.95; }
  .lore-box { border: 1px solid rgba(139,26,26,0.45); padding: 36px 32px; margin-bottom: 48px; }
  .lore-box p { font-family: var(--sans); font-size: 14px; color: var(--muted); font-weight: 300; line-height: 1.95; margin-bottom: 16px; }
  .lore-box p:last-child { font-family: var(--serif); font-size: 17px; color: var(--silver); font-style: italic; margin-bottom: 0; }
  .inv-label { font-family: var(--sans); font-size: 11px; color: var(--ash-red); letter-spacing: 0.2em; margin-bottom: 20px; }
  .inv-row {
    border: 1px solid rgba(139,26,26,0.25);
    padding: 20px 24px; margin-bottom: 2px;
    display: flex; justify-content: space-between; align-items: center;
    transition: border-color 0.3s;
  }
  .inv-row:hover { border-color: rgba(192,57,43,0.6); }
  .inv-name { font-family: var(--serif); font-size: 16px; color: var(--silver); font-weight: 400; }
  .inv-year { font-family: var(--sans); font-size: 10px; color: #5a2020; letter-spacing: 0.15em; font-style: italic; }
  .inv-note { font-family: var(--sans); font-size: 12px; color: #5a3030; font-style: italic; line-height: 1.7; margin-top: 20px; }

  .strike-row { display: flex; gap: 24px; align-items: flex-start; padding: 26px 0; border-bottom: 1px solid rgba(255,255,255,0.04); transition: padding-left 0.3s; cursor: default; }
  .strike-row:hover { padding-left: 12px; }
  .bolt { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
  .strike-title { font-family: var(--serif); font-size: 18px; color: var(--off-white); font-weight: 400; margin-bottom: 5px; }
  .strike-desc { font-family: var(--sans); font-size: 12px; color: var(--muted); font-weight: 300; letter-spacing: 0.04em; }

  .letter-box { border: 1px solid rgba(91,143,201,0.3); padding: 40px 36px; margin-bottom: 24px; text-align: center; }
  .letter-icon { font-size: 28px; margin-bottom: 20px; }
  .letter-email { font-family: var(--serif); font-size: 18px; color: var(--off-white); margin-bottom: 8px; }
  .letter-connect { font-family: var(--sans); font-size: 12px; color: var(--muted); font-weight: 300; margin-bottom: 28px; }
  .social-links { display: flex; justify-content: center; gap: 32px; }
  .social-link { font-family: var(--sans); font-size: 13px; color: var(--rain-blue); font-weight: 300; text-decoration: none; letter-spacing: 0.05em; transition: color 0.2s; }
  .social-link:hover { color: var(--off-white); }
  .rain-time { font-family: var(--sans); font-size: 12px; color: var(--faint); font-weight: 300; }

  .secret-title { font-family: var(--serif); font-size: clamp(28px,5vw,44px); font-weight: 400; color: var(--off-white); text-align: center; margin-bottom: 20px; }
  .secret-hr { width: 60px; height: 1px; background: var(--rain-blue); margin: 0 auto 64px; }
  .secret-block { margin-bottom: 40px; }
  .secret-block.quote { padding-left: 24px; border-left: 2px solid var(--faint); }
  .secret-para { font-family: var(--serif); font-size: 16px; color: var(--muted); line-height: 1.9; margin-bottom: 14px; }
  .secret-para:last-child { margin-bottom: 0; }
  .secret-footer { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 40px; margin-top: 20px; text-align: center; }
  .secret-sig { font-family: var(--serif); font-size: 14px; color: var(--rain-blue); font-style: italic; margin-bottom: 12px; }
  .secret-found { font-family: var(--sans); font-size: 12px; color: var(--faint); font-weight: 300; }

  footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 36px 24px; text-align: center; transition: border-color 0.6s; }
  body.demon-mode footer { border-top-color: rgba(139,26,26,0.2); }
  .footer-text { font-family: var(--sans); font-size: 11px; color: var(--faint); font-weight: 300; letter-spacing: 0.08em; }

  #red-sky-overlay {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    background: radial-gradient(ellipse at 50% 0%, rgba(100,10,10,0.35) 0%, transparent 70%);
    display: none;
  }
  body.demon-mode #red-sky-overlay { display: block; }
`;

/* ────── RAIN CANVAS COMPONENTS ────── */
const BlueRain = () => {
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // create drops
    const count = 60;
    const newDrops = [];
    for (let i = 0; i < count; i++) {
      newDrops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        len: 20 + Math.random() * 30,
        speed: 8 + Math.random() * 8,
        alpha: 0.07 + Math.random() * 0.16,
      });
    }
    dropsRef.current = newDrops;

    const ang = (7 * Math.PI) / 180;
    const dx = Math.sin(ang);
    const dy = Math.cos(ang);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dropsRef.current.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + dx * d.len, d.y + dy * d.len);
        ctx.strokeStyle = "#7aaed6";
        ctx.globalAlpha = d.alpha;
        ctx.lineWidth = 1;
        ctx.stroke();

        d.x += dx * d.speed * 0.25;
        d.y += dy * d.speed * 0.5;
        if (d.y > canvas.height + 60) {
          d.y = -60;
          d.x = Math.random() * canvas.width;
        }
        if (d.x > canvas.width + 60) {
          d.x = -60;
        }
      });
      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="rain-canvas" ref={canvasRef} />;
};

const RedRain = () => {
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 80;
    const newDrops = [];
    for (let i = 0; i < count; i++) {
      newDrops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        len: 15 + Math.random() * 25,
        speed: 6 + Math.random() * 10,
        alpha: 0.1 + Math.random() * 0.25,
      });
    }
    dropsRef.current = newDrops;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dropsRef.current.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.3 * d.len, d.y + d.len);
        ctx.strokeStyle = "#8b2020";
        ctx.globalAlpha = d.alpha;
        ctx.lineWidth = 1;
        ctx.stroke();
        d.y += d.speed * 0.5;
        d.x += 0.4;
        if (d.y > canvas.height + 40) {
          d.y = -40;
          d.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="red-canvas" ref={canvasRef} />;
};

/* ────── THUNDER EFFECT ────── */
const Thunder = () => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    let timeoutId;

    const flash = () => {
      timeoutId = setTimeout(() => {
        el.style.opacity = "1";
        setTimeout(() => {
          el.style.opacity = "0";
          flash();
        }, 120);
      }, 8000 + Math.random() * 20000);
    };
    flash();

    return () => clearTimeout(timeoutId);
  }, []);

  return <div id="thunder" ref={overlayRef} />;
};

/* ────── CLOCK ────── */
const Clock = () => {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <div id="clock">{timeStr}</div>;
};

/* ────── MAIN APP ────── */
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cloudClicks, setCloudClicks] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const demonMode = currentPage === "demonology";

  // body class toggle
  useEffect(() => {
    if (demonMode) {
      document.body.classList.add("demon-mode");
    } else {
      document.body.classList.remove("demon-mode");
    }
  }, [demonMode]);

  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMenu = () => setMenuOpen((p) => !p);

  const handleCloudClick = () => {
    setCloudClicks((prev) => {
      const next = prev + 1;
      if (next >= 7) {
        navigate("secret");
        return 0;
      }
      return next;
    });
  };

  const remaining = 7 - cloudClicks;

  /* ── reusable nav link class ── */
  const linkClass = (page) =>
    `nav-link${currentPage === page ? " active" : ""}`;

  /* ── page renderer ── */
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="section center" style={{ maxWidth: 560 }}>
            <div className="home-kana">恋雨</div>
            <h1 className="home-title">koigarame</h1>
            <div className="home-gloss">
              koi (恋) longing &nbsp;·&nbsp; ame (雨) rain
            </div>
            <div className="vline" />
            <p className="tagline">Builder.&nbsp;&nbsp;Writer.&nbsp;&nbsp;Dreamer.</p>
            <p className="since">Documenting life, code, and rain since 2021.</p>
            <button className="btn-storm" onClick={() => navigate("storm-log")}>
              Enter the Storm
            </button>
            <button id="cloud-btn" onClick={handleCloudClick} title="Click me">
              ☁
            </button>
            <div id="cloud-count">{cloudClicks > 0 ? remaining : ""}</div>
          </div>
        );

      case "storm-log":
        return (
          <div className="section" style={{ maxWidth: 680 }}>
            <p className="eyebrow">STORM LOG</p>
            <h1>A Chronicle of Storms</h1>
            <p className="subtitle">Every year a season. Every season a lesson.</p>
            <div className="timeline">
              {[
                [2021, "Age 13", "First Drops", "Started with block Python at 13. Drag-and-drop logic before syntax. Watched tutorials until midnight. That age when most kids were worried about school — I was learning to speak in code. Those first lines felt like discovering a secret language only I understood."],
                [2022, "Age 14", "The Kitchen Storm", "Built a table-to-kitchen ordering app using MIT App Inventor for a local cafe. No backend. Just logic and hope. Took it to a hackathon and placed 5th globally against builders twice my age. That same year, started HTML, CSS, and JavaScript. Three new languages before I turned 15. The rain was teaching me faster than time."],
                [2023, "Age 15", "First Light", "Made my first real website. People used it. Then came the certification — youngest app developer recognized by Whitehat at 15. A title. A badge. But mostly, the moment you realize you're not a kid who codes anymore. You're a coder who happens to be a kid."],
                [2024, "Age 16", "The Monsoon", "Sold my first website for ₹40,000. Held those rupees like rain in my hands. That's when I understood — you don't become a professional at some arbitrary age. You become one when someone believes in your work enough to pay for it. Completed my 2-year HTML course that same year. The world was starting to hear my code."],
                [2025, "Age 17", "Beyond Code", "Built a Minecraft injector — skins, capes, DLL modifications. Learned that building extends beyond web and apps. Code lives in browsers, in games, in worlds. The monsoon taught me that rain doesn't just water projects. It waters imagination."],
                [2026, "Age 18", "The Eye of the Storm", "Started React. Building the next chapter. Standing here now, watching the rain, knowing that the best things are built during the storm. From 13 to 18 — five years of drops. And the monsoon is far from over."],
              ].map(([year, age, title, body], i, arr) => (
                <div className="tl-entry" key={year} style={i === arr.length - 1 ? { paddingBottom: 0 } : {}}>
                  <div className="tl-dot" />
                  <div>
                    <span className="tl-year">{year}</span>
                    <span className="tl-age">{age}</span>
                  </div>
                  <div className="tl-title">{title}</div>
                  <p className="tl-body">{body}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "rain-notes":
        return (
          <div className="section" style={{ maxWidth: 680 }}>
            <p className="eyebrow">RAIN NOTES</p>
            <h1>Thoughts Whispered to the Storm</h1>
            <p className="subtitle">Poems. Midnight ideas. Journal entries.</p>
            <div className="note-entry">
              <p className="note-date">September '24</p>
              <h3 className="note-title">What Rs. 40,000 Meant at 16</h3>
              <p className="note-body">A client paid me forty thousand rupees for code I wrote at 16. I was still in school. Still figuring out who I was. But suddenly someone believed in my code enough to pay for it. It's not about the money. It's about the moment your thoughts are worth currency.</p>
            </div>
            <div className="note-entry">
              <p className="note-date">Nov 2024</p>
              <h3 className="note-title">The Age Question</h3>
              <p className="note-body">People ask me 'How did you start so young?' Like 13 was early. Like the fact that I was a kid makes my code less real. But that's the thing — at 13, I didn't know I was supposed to wait. Didn't know coding was 'for later.' I just wanted to build. The rain doesn't ask your age. It just falls.</p>
            </div>
            <div className="note-entry">
              <p className="note-date">June '26</p>
              <h3 className="note-title">From Blocks to React</h3>
              <p className="note-body">Started with drag-and-drop blocks in Python at 13. Now chasing hooks and state at 18. Five years isn't much, but I've lived through five different frameworks, five different versions of myself as a builder. Each language a new dialect of the same dream. Block Python was the first raindrop. React is the monsoon.</p>
            </div>
            <div className="note-entry" style={{ borderBottom: "none" }}>
              <p className="note-date">June '26</p>
              <h3 className="note-title">A Letter to 13-Year-Old Me</h3>
              <p className="note-body">Dear 13-year-old Sid: You're about to start learning block Python. You'll spend 5 years building websites, apps, injectors, and worlds. You'll win hackathons. You'll sell code. You'll be certified the youngest, and it will feel amazing and suffocating at the same time. But the most important thing: building isn't about age. It's about passion. The rain doesn't wait for you to grow up. Welcome to the monsoon.</p>
            </div>
          </div>
        );

      case "builds":
        return (
          <div className="section">
            <p className="eyebrow">PROJECTS</p>
            <h1>Things Built During The Rain</h1>
            <p className="subtitle">Projects that started as ideas and became real.</p>
            {[
              { name: "Kitchen Ordering System", year: "2022", badge: "5th Global Hackathon", why: "A local cafe needed a way to take orders from tables. No backend, just logic. Built table routing and kitchen display. Then took it to a global hackathon against developers twice my age.", tags: ["MIT App Inventor", "Mobile", "Logic Flow"] },
              { name: "First Website", year: "2023", badge: "First Ever Site", why: "A friend needed an online presence. HTML, CSS, JavaScript from scratch. Shaky code, but real. They loved it. First time code meant something to someone else.", tags: ["HTML", "CSS", "JavaScript"] },
              { name: "Website v2", year: "2024", badge: "Sold for ₹40,000", why: "Better code. Cleaner design. A client found me, offered ₹40,000. I said yes before I could second-guess myself. That payment changed how I see what I build.", tags: ["HTML", "CSS", "JavaScript", "Responsive"] },
              { name: "Minecraft Injector", year: "2025", badge: "Beyond the Web", why: "Started exploring beyond web. Skins, capes, DLL injection. Learned that building lives everywhere — in browsers, in games, in the spaces between systems.", tags: ["Java", "DLL", "Minecraft Modding"] },
            ].map((p, idx) => (
              <div className="project-card" key={idx}>
                <div className="project-head">
                  <div>
                    <div className="project-name">{p.name}</div>
                    <div className="project-year">{p.year}</div>
                  </div>
                  <div className="project-badge">{p.badge}</div>
                </div>
                <p className="project-why">{p.why}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "valaden":
        return (
          <div className="section" style={{ maxWidth: 680 }}>
            <div className="valaden-hero">
              <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--rain-blue)", letterSpacing: "0.25em", marginBottom: 16 }}>MINECRAFT · WORLD</p>
              <h1 className="valaden-title">Valaden</h1>
              <p className="valaden-sub">Where the rain never truly stops.</p>
            </div>
            <div className="divider"><div className="divider-line" /><span style={{ fontSize: 18 }}>🌧️</span><div className="divider-line" /></div>
            <div className="v-section">
              <h3 className="v-section-title">The Lore</h3>
              <p className="v-body">Valaden is a kingdom in eternal monsoon season. The rain is constant, the sky is grey, and the people have learned to live not despite the rain, but because of it. Every building channels water. Every garden drinks deep. The culture celebrates the storm — not as disaster, but as gift.</p>
            </div>
            <div className="v-section">
              <h3 className="v-section-title">Notable Structures</h3>
              <ul className="v-list">
                <li>🏰 <strong>The Central Palace</strong> — Built around a waterfall that flows from the highest peak</li>
                <li>🌳 <strong>The Rain Garden</strong> — Plants that thrive in constant moisture, tended by monks of water</li>
                <li>🏞️ <strong>The Reflection Ponds</strong> — Mirror lakes where sky and earth lose their border</li>
                <li>📚 <strong>The Archive of Storms</strong> — Library of every weather pattern ever recorded in Valaden</li>
              </ul>
            </div>
            <div className="v-section">
              <h3 className="v-section-title">Philosophy</h3>
              <p className="v-body">In Valaden, rain is not something you survive. It is something you celebrate. The architecture accepts water, channels it, and transforms it into beauty. That is the lesson: not resistance of circumstance, but transformation of it into art.</p>
            </div>
            <div className="v-section"><h3 className="v-section-title">Maps &amp; Builds</h3><p className="coming-soon">coming soon — still building the world</p></div>
            <div className="v-section"><h3 className="v-section-title">Screenshots</h3><p className="coming-soon">coming soon — still building the world</p></div>
          </div>
        );

      case "demonology":
        return (
          <div className="section" style={{ maxWidth: 680 }}>
            <p className="d-eyebrow">SID · DEMONOLOGIST</p>
            <h1>Demonology</h1>
            <p className="subtitle" style={{ color: "#7a5050", marginBottom: 48 }}>Between worlds. Between names.</p>
            <div className="lore-box">
              <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--ash-red)", letterSpacing: "0.2em", marginBottom: 20 }}>THE LORE</p>
              <p>I'm Sid. A demonologist drawn to what hides between worlds.</p>
              <p>It began in 2013, after my mother passed. A week later, voices. Things moving — subtle, but real. I ignored it for years.</p>
              <p>In 2015, I learned about the realm beyond our own. That's when I started experimenting, Charlie Charlie, spirit contact, eventually the Ouija board. Since then, something has been attached to me.</p>
              <p>Coding came later. Just another way to make sense of chaos. My investigations took me across Assam and beyond, chasing knowledge that nearly cost me my life in 2024.</p>
              <p>Then last November, my father passed. And ever since, I can feel something darker brewing close, but unseen. I don't know what or why. But I know it's moving.</p>
              <p>That's me.</p>
            </div>
            <p className="inv-label">INVESTIGATION LOGS</p>
            <div className="inv-row"><span className="inv-name">The Ouija Sessions</span><span className="inv-year">2015 · coming soon</span></div>
            <div className="inv-row"><span className="inv-name">Assam Investigation</span><span className="inv-year">2019 · coming soon</span></div>
            <div className="inv-row"><span className="inv-name">The 2024 Incident</span><span className="inv-year">2024 · coming soon</span></div>
            <div className="inv-row"><span className="inv-name">Post-November</span><span className="inv-year">2025 · coming soon</span></div>
            <p className="inv-note">Logs are being written. Some things take time to put into words. Come back when the sky is darker.</p>
          </div>
        );

      case "lightning":
        return (
          <div className="section" style={{ maxWidth: 680 }}>
            <p className="eyebrow">LIGHTNING STRIKES</p>
            <h1>Rare Moments</h1>
            <p className="subtitle">When the storm itself seemed to celebrate.</p>
            <div className="strike-row"><span className="bolt">⚡</span><div><div className="strike-title">5th Global Hackathon Rank</div><div className="strike-desc">2022 · Age 14 · Kitchen Ordering App — against developers twice my age</div></div></div>
            <div className="strike-row"><span className="bolt">⚡</span><div><div className="strike-title">Youngest App Developer Certified</div><div className="strike-desc">2023 · Age 15 · Official recognition by Whitehat Junior</div></div></div>
            <div className="strike-row"><span className="bolt">⚡</span><div><div className="strike-title">Completed 2-Year HTML Mastery</div><div className="strike-desc">2024 · Age 16 · Two years of patient building, done</div></div></div>
            <div className="strike-row"><span className="bolt">⚡</span><div><div className="strike-title">First Website Sold for ₹40,000</div><div className="strike-desc">2024 · Age 16 · First time code became currency</div></div></div>
            <div className="strike-row"><span className="bolt">⚡</span><div><div className="strike-title">Built Beyond the Web</div><div className="strike-desc">2025 · Age 17 · Minecraft injector — skins, capes, DLL</div></div></div>
            <div className="strike-row" style={{ borderBottom: "none" }}><span className="bolt">⚡</span><div><div className="strike-title">Started React</div><div className="strike-desc">2026 · Age 18 · The next storm begins</div></div></div>
          </div>
        );

      case "contact":
        return (
          <div className="section center" style={{ maxWidth: 540 }}>
            <p className="eyebrow">SEND A LETTER</p>
            <h1>Drop a Message Into the Storm</h1>
            <p className="subtitle" style={{ marginBottom: 48 }}>I'll find it.</p>
            <div className="letter-box" style={{ width: "100%" }}>
              <div className="letter-icon">✉️</div>
              <p className="letter-email">solcyfer@gmail.com</p>
              <p className="letter-connect">Or find me across the storm:</p>
              <div className="social-links">
                <a href="https://github.com/solcyfer" className="social-link">GitHub</a>
                <a href="https://open.spotify.com/user/zplwii7mzh7ml9pq66bxp4u5t?si=a8a21d7ca1a0450e" className="social-link">Spotify</a>
                <a href="https://pinterest.com/Koigarame/" className="social-link">Pinterest</a>
              </div>
            </div>
            <p className="rain-time">Response time: depends on how hard it's raining. ☔</p>
          </div>
        );

      case "secret":
        return (
          <div className="section" style={{ maxWidth: 600 }}>
            <h1 className="secret-title">For The Rain That Never Knew</h1>
            <div className="secret-hr" />
            <div className="secret-block">
              <p className="secret-para">She doesn't know I think about her when it rains.</p>
              <p className="secret-para">The grey sky, the wet windows, the sound of water hitting glass — all of it tastes like her now.</p>
              <p className="secret-para">I don't know if that's beautiful or tragic. Maybe it's both.</p>
            </div>
            <div className="secret-block quote">
              <p className="secret-para">I keep starting sentences and deleting them.</p>
              <p className="secret-para">What do you say to someone who changed everything about how you see the world, but you were too late to tell them?</p>
              <p className="secret-para">What do you say to the rain?</p>
            </div>
            <div className="secret-block">
              <p className="secret-para">There's this song — Alag Aasman — that plays when I'm not thinking about it.</p>
              <p className="secret-para">And suddenly I'm thinking about her again.</p>
              <p className="secret-para">And the rain seems louder.</p>
            </div>
            <div className="secret-block quote">
              <p className="secret-para">Maybe one day I'll build something so good, so real, that it speaks for me.</p>
              <p className="secret-para">Maybe one day she'll see it.</p>
              <p className="secret-para">Maybe one day the rain will stop being about her and just be about me.</p>
            </div>
            <div className="secret-block">
              <p className="secret-para">But not today.</p>
              <p className="secret-para">Today, in the rain, she lives in every line of code I write.</p>
              <p className="secret-para">Today, the monsoon is still hers.</p>
            </div>
            <div className="secret-footer">
              <p className="secret-sig">— Unfinished thoughts, 3:47 AM</p>
              <p className="secret-found">You found it. The mess behind the art. Stay if you want. Leave if you need to.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <BlueRain />
      <RedRain />
      <div id="red-sky-overlay" />
      <Thunder />
      <Clock />

      <nav>
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => navigate("home")}>
            恋雨
          </button>
          <div className="nav-links">
            {[
              ["home", "Home"],
              ["storm-log", "Storm Log"],
              ["rain-notes", "Rain Notes"],
              ["builds", "During The Rain"],
              ["valaden", "Valaden"],
              ["demonology", "Demonology"],
              ["lightning", "Lightning Strikes"],
              ["contact", "Send A Letter"],
            ].map(([page, label]) => (
              <button
                key={page}
                className={linkClass(page)}
                data-page={page}
                onClick={() => navigate(page)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu open">
            {[
              ["home", "Home"],
              ["storm-log", "Storm Log"],
              ["rain-notes", "Rain Notes"],
              ["builds", "During The Rain"],
              ["valaden", "Valaden"],
              ["demonology", "Demonology"],
              ["lightning", "Lightning Strikes"],
              ["contact", "Send A Letter"],
            ].map(([page, label]) => (
              <button
                key={page}
                className="nav-link"
                onClick={() => navigate(page)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main>
        <div className="page active" key={currentPage}>
          {renderPage()}
        </div>
      </main>

      <footer>
        <p className="footer-text">
          Built during monsoon season. © 2026 恋雨. All storms preserved.
        </p>
      </footer>
    </>
  );
}
