'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const KEY_MOJ = 'marica30_moj';

// Floating disco-ball decorations (ported from the design).
const ALL_DECOR = [
  { c: '🪩', l: '5%', t: '13%', s: 50, a: 'floaty 6s' },
  { c: '🪩', l: '89%', t: '18%', s: 30, a: 'twinkle 2.4s' },
  { c: '🪩', l: '82%', t: '64%', s: 44, a: 'floaty 8s' },
  { c: '🪩', l: '13%', t: '68%', s: 26, a: 'twinkle 3s' },
  { c: '🪩', l: '40%', t: '7%', s: 24, a: 'twinkle 2.2s' },
  { c: '🪩', l: '93%', t: '43%', s: 24, a: 'twinkle 2.8s' },
  { c: '🪩', l: '4%', t: '40%', s: 26, a: 'twinkle 3.2s' },
  { c: '🪩', l: '29%', t: '86%', s: 34, a: 'floatyB 7s' },
  { c: '🪩', l: '9%', t: '90%', s: 38, a: 'floaty 7.5s' },
  { c: '🪩', l: '91%', t: '86%', s: 26, a: 'twinkle 2.6s' },
  { c: '🪩', l: '56%', t: '4%', s: 22, a: 'twinkle 2.9s' },
  { c: '🪩', l: '63%', t: '38%', s: 22, a: 'twinkle 2.2s' },
  { c: '🪩', l: '17%', t: '28%', s: 24, a: 'twinkle 3.4s' },
  { c: '🪩', l: '77%', t: '29%', s: 28, a: 'floatyB 7.2s' },
];

const CONFETTI_COLORS = ['#FF6A00', '#FF8A00', '#FFE600', '#FFF3A0', '#FFFFFF', '#FFB800', '#D96BFF'];

export default function Page() {
  const [stage, setStage] = useState('sealed'); // sealed | opening | open
  const [ime, setIme] = useState('');
  const [dolazak, setDolazak] = useState(null); // true | false | null
  const [pice, setPice] = useState('');
  const [poslano, setPoslano] = useState(false);
  const [zadnji, setZadnji] = useState(null);
  const [hint, setHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const particlesRef = useRef([]);
  const runningRef = useRef(false);

  // ---------- Restore my previous answer ----------
  useEffect(() => {
    try {
      const moj = JSON.parse(localStorage.getItem(KEY_MOJ) || 'null');
      if (moj) {
        setZadnji(moj);
        setPoslano(true);
        setIme(moj.ime || '');
        setDolazak(typeof moj.dolazak === 'boolean' ? moj.dolazak : null);
        setPice(moj.pice || '');
      }
    } catch {}
  }, []);

  // ---------- Confetti canvas ----------
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resizeCanvas]);

  const animate = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) {
      runningRef.current = false;
      return;
    }
    const W = window.innerWidth;
    const H = window.innerHeight;
    ctx.clearRect(0, 0, W, H);
    const ps = particlesRef.current;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.vy += 0.17;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rot += p.vr;
      p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 35));
      ctx.fillStyle = p.color;
      if (p.shape === 0) ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      else {
        ctx.beginPath();
        ctx.arc(0, 0, p.s / 2, 0, 7);
        ctx.fill();
      }
      ctx.restore();
      if (p.y > H + 40 || p.life <= 0) ps.splice(i, 1);
    }
    if (ps.length > 0) requestAnimationFrame(animate);
    else {
      runningRef.current = false;
      ctx.clearRect(0, 0, W, H);
    }
  }, []);

  const konfeti = useCallback(
    (x, y, count) => {
      if (!ctxRef.current) resizeCanvas();
      if (!ctxRef.current) return;
      const ps = particlesRef.current;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 4 + Math.random() * 9;
        ps.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 6,
          s: 7 + Math.random() * 9,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          rot: Math.random() * 7,
          vr: (Math.random() - 0.5) * 0.4,
          life: 60 + Math.random() * 45,
          shape: Math.random() < 0.5 ? 0 : 1,
        });
      }
      if (!runningRef.current) {
        runningRef.current = true;
        requestAnimationFrame(animate);
      }
    },
    [animate, resizeCanvas]
  );

  // ---------- Handlers ----------
  const open = useCallback(() => {
    setStage('opening');
    requestAnimationFrame(() => konfeti(window.innerWidth / 2, window.innerHeight * 0.4, 220));
    setTimeout(() => konfeti(window.innerWidth * 0.25, window.innerHeight * 0.45, 120), 280);
    setTimeout(() => konfeti(window.innerWidth * 0.75, window.innerHeight * 0.45, 120), 440);
    setTimeout(() => setStage('open'), 1050);
  }, [konfeti]);

  const posalji = useCallback(async () => {
    const cleanIme = ime.trim();
    if (!cleanIme || dolazak === null) {
      setHint(true);
      return;
    }
    setServerError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanIme, attending: dolazak, drink: pice.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data?.error || 'Greška pri spremanju. Pokušaj ponovno.');
        setSubmitting(false);
        return;
      }
      const entry = { ime: cleanIme, dolazak, pice: pice.trim(), t: Date.now() };
      try {
        localStorage.setItem(KEY_MOJ, JSON.stringify(entry));
      } catch {}
      setZadnji(entry);
      setPoslano(true);
      setHint(false);
      setSubmitting(false);
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
      requestAnimationFrame(() => konfeti(window.innerWidth / 2, window.innerHeight * 0.35, 300));
      setTimeout(() => konfeti(window.innerWidth * 0.2, window.innerHeight * 0.5, 140), 250);
      setTimeout(() => konfeti(window.innerWidth * 0.8, window.innerHeight * 0.5, 140), 420);
    } catch {
      setServerError('Nema veze sa serverom. Provjeri internet i pokušaj ponovno.');
      setSubmitting(false);
    }
  }, [ime, dolazak, pice, konfeti]);

  const promijeni = useCallback(() => {
    setPoslano(false);
    setServerError('');
  }, []);

  // ---------- Location / calendar actions ----------
  const otvoriMapu = useCallback(() => {
    const q = encodeURIComponent('Downstairs, Krešićeva 32, Zagreb');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener,noreferrer');
  }, []);

  const dodajUKalendar = useCallback(() => {
    // 29.8.2026. od 21h — party runs into the night (local time).
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Marica 30//RSVP//HR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:marica30-2026@marica',
      'DTSTART:20260829T210000',
      'DTEND:20260830T020000',
      'SUMMARY:Marica slavi 360 mjeseci 🪩',
      'DESCRIPTION:Downstairs\\, Krešićeva 32 — terminali Borongaj\\, niz stepenice kod Mlinara.',
      'LOCATION:Downstairs\\, Krešićeva 32\\, Zagreb',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marica-30.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  // ---------- Derived ----------
  const decorations = useMemo(
    () =>
      ALL_DECOR.map((d, i) => ({
        char: d.c,
        style: {
          position: 'absolute',
          left: d.l,
          top: d.t,
          fontSize: d.s + 'px',
          zIndex: 1,
          animation: d.a + ' ease-in-out infinite',
          animationDelay: ((i * 0.37) % 3).toFixed(2) + 's',
          filter: 'drop-shadow(0 4px 6px rgba(120,45,0,.25))',
          opacity: 0.92,
          pointerEvents: 'none',
        },
      })),
    []
  );

  const enabled = ime.trim().length > 0 && dolazak !== null;
  const z = zadnji || {};
  const hintText = !ime.trim() ? 'Prvo napiši tko si!' : 'Odaberi dolaziš li ili ne!';

  const btnBase = {
    border: '3px solid rgba(255,255,255,.20)',
    borderRadius: '18px',
    padding: '16px 10px',
    fontFamily: "'Fredoka',sans-serif",
    fontWeight: 700,
    fontSize: '18px',
    cursor: 'pointer',
    background: 'rgba(255,255,255,.06)',
    color: '#fff',
  };
  const daStyle =
    dolazak === true
      ? { ...btnBase, background: '#FFE600', color: '#2A0845', borderColor: '#FFE600', boxShadow: '0 12px 26px rgba(255,230,0,.4)' }
      : btnBase;
  const neStyle =
    dolazak === false
      ? { ...btnBase, background: '#FFFFFF', color: '#2A0845', borderColor: '#FFFFFF', boxShadow: '0 12px 26px rgba(255,255,255,.35)' }
      : btnBase;

  const posaljiStyle = {
    width: '100%',
    marginTop: '24px',
    border: 'none',
    borderRadius: '999px',
    padding: 'clamp(15px, 4vw, 18px)',
    fontFamily: "'Fredoka',sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(18px, 4.6vw, 21px)',
    cursor: submitting ? 'wait' : 'pointer',
    background: '#FFE600',
    color: '#2A0845',
    opacity: enabled && !submitting ? 1 : 0.55,
    boxShadow: '0 16px 34px rgba(0,0,0,.4)',
    animation: enabled && !submitting ? 'pulseGlow 1.8s ease-in-out infinite' : 'none',
  };

  const inviteVisible = stage !== 'sealed';
  const sealedVisible = stage !== 'open';

  return (
    <div style={rootStyle}>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 90 }}
      />

      {/* floating decorations */}
      {decorations.map((d, i) => (
        <div key={i} style={d.style}>
          {d.char}
        </div>
      ))}

      {/* ========== INVITE ========== */}
      {inviteVisible && (
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 760, margin: '0 auto', padding: 'clamp(28px, 7vw, 48px) clamp(18px, 5vw, 20px) 80px' }}>
          {/* HERO */}
          <div style={{ textAlign: 'center', animation: 'popIn .9s cubic-bezier(.2,.9,.3,1.3) both' }}>
            <h1 style={heroTitleStyle}>
              Marica slavi
              <br />
              360 mjeseci
            </h1>

            <div style={{ position: 'relative', display: 'inline-block', margin: '26px 0 4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/marica-cutout-v3.png" alt="Marica" style={heroImgStyle} />
            </div>
          </div>

          {/* DETAILS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, margin: '30px 0 8px', animation: 'riseIn .7s .25s both' }}>
            <button
              className="mc-chip"
              onClick={dodajUKalendar}
              title="Dodaj u kalendar"
              style={{ ...chipStyle, borderColor: '#FFE600', transform: 'rotate(-1.5deg)' }}
            >
              📅 29.8.2026. od 21h
            </button>
            <button
              className="mc-chip"
              onClick={otvoriMapu}
              title="Otvori u Google Maps"
              style={{ ...chipStyle, borderColor: '#FFF3A0', transform: 'rotate(1.5deg)' }}
            >
              📍 Downstairs, Krešićeva 32
            </button>
          </div>
          <p style={{ textAlign: 'center', color: '#FFE9C4', fontSize: 16, fontWeight: 600, maxWidth: 460, margin: '10px auto 0', lineHeight: 1.5, animation: 'riseIn .7s .3s both' }}>
            terminali Borongaj — ide se niz stepenice kod Mlinara
          </p>

          {/* FORM */}
          {!poslano && (
            <div style={cardStyle}>
              <div style={cardBadgeStyle}>JAVI SE 🪩</div>

              <p style={{ fontWeight: 600, fontSize: 18, color: '#fff', margin: '20px 0 10px' }}>Tko si?</p>
              <input
                className="mc-field"
                value={ime}
                onChange={(e) => setIme(e.target.value)}
                placeholder="ime i prezime"
                style={inputStyle}
              />

              <p style={{ textAlign: 'center', fontWeight: 600, fontSize: 21, color: '#fff', margin: '26px 0 16px' }}>1. Dolaziš li?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button className="mc-choice" onClick={() => { setDolazak(true); setHint(false); }} style={daStyle}>
                  Dolazim 🪩
                </button>
                <button className="mc-choice" onClick={() => { setDolazak(false); setHint(false); }} style={neStyle}>
                  Ne dolazim 🪩
                </button>
              </div>

              <p style={{ fontWeight: 600, fontSize: 18, color: '#fff', margin: '26px 0 4px' }}>2. Što bi pio/pila?</p>
              <p style={{ fontSize: 14, color: '#FFE9C4', fontWeight: 600, margin: '0 0 12px' }}>Napiši okvirno</p>
              <textarea
                className="mc-field"
                value={pice}
                onChange={(e) => setPice(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
              />

              <button onClick={posalji} disabled={submitting} style={posaljiStyle}>
                {submitting ? 'Šaljem…' : 'Pošalji odgovor 🪩'}
              </button>

              {hint && (
                <p style={{ textAlign: 'center', color: '#FFE600', fontWeight: 700, fontSize: 14, margin: '10px 0 0', animation: 'wob .4s ease-in-out 2' }}>
                  {hintText}
                </p>
              )}
              {serverError && (
                <p style={{ textAlign: 'center', color: '#FFB4B4', fontWeight: 700, fontSize: 14, margin: '10px 0 0' }}>{serverError}</p>
              )}
            </div>
          )}

          {/* THANK YOU */}
          {poslano && (
            <div style={{ ...cardStyle, textAlign: 'center', animation: 'popIn .8s cubic-bezier(.2,.9,.3,1.3) both', paddingTop: 38, paddingBottom: 38 }}>
              <div style={{ fontSize: 'clamp(58px, 15vw, 80px)', animation: 'bounceBall 2.2s ease-in-out infinite' }}>🪩</div>
              <h2 style={{ fontFamily: "'Bagel Fat One','Fredoka',cursive", fontWeight: 400, fontSize: 'clamp(30px, 8vw, 38px)', color: '#fff', margin: '6px 0 4px' }}>
                {z.dolazak ? 'VIDIMO SE!' : 'Plaky'}
              </h2>
              <p style={{ fontSize: 19, color: '#FFE9C4', fontWeight: 600, margin: '0 0 18px' }}>
                {z.dolazak
                  ? 'Odgovor je zabilježen. Pripremi se za disko.'
                  : 'Odgovor je zabilježen. Ako se predomisliš, promijeni odgovor.'}
              </p>

              <div style={summaryBoxStyle}>
                <div>
                  <strong style={{ color: '#FFE600' }}>Ime:</strong> {z.ime || ''}
                </div>
                <div>
                  <strong style={{ color: '#FFE600' }}>Dolazak:</strong> {z.dolazak ? 'DOLAZIM' : 'NE DOLAZIM'}
                </div>
                <div>
                  <strong style={{ color: '#FFE600' }}>Piće:</strong> {z.pice || '—'}
                </div>
              </div>

              <button className="mc-ghost" onClick={promijeni} style={ghostBtnStyle}>
                ↩ promijeni odgovor
              </button>
            </div>
          )}

          <p style={{ textAlign: 'center', color: '#FFE9C4', fontWeight: 600, fontSize: 14, margin: '30px 0 0', opacity: 0.8 }}>
            vidimo se 29.8. 🪩
          </p>
        </div>
      )}

      {/* ========== SEALED ENVELOPE ========== */}
      {sealedVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            animation: stage === 'opening' ? 'puffOut 1s ease-in forwards' : 'none',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ '--env-w': 'clamp(200px, 64vw, 300px)', position: 'relative', width: 'var(--env-w)', height: 'calc(var(--env-w) * 0.7)', margin: '0 auto 8px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 26, border: '3px solid #FFE600', animation: 'ringPulse 2.2s ease-out infinite' }} />
              <div style={envelopeStyle}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, borderLeft: 'calc(var(--env-w) / 2) solid transparent', borderRight: 'calc(var(--env-w) / 2) solid transparent', borderTop: 'calc(var(--env-w) * 0.393) solid #B57DDB', opacity: 0.95 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, borderLeft: 'calc(var(--env-w) / 2) solid transparent', borderRight: 'calc(var(--env-w) / 2) solid transparent', borderTop: 'calc(var(--env-w) * 0.36) solid #9A5BC8', opacity: 0.55 }} />
              </div>
            </div>

            <h2 style={{ fontFamily: "'Bagel Fat One','Fredoka',cursive", fontWeight: 400, fontSize: 'clamp(26px, 7vw, 34px)', color: '#fff', margin: '18px 0 2px' }}>Marica 30</h2>

            <button onClick={open} style={openBtnStyle}>
              🪩 OTVORI 🪩
            </button>
          </div>
        </div>
      )}

      {/* opening flash */}
      {stage === 'opening' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 85, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 42%, #fff 0%, transparent 60%)', animation: 'flashIn 1s ease-out forwards' }} />
      )}
    </div>
  );
}

/* ---------- styles ---------- */
const rootStyle = {
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  overflowX: 'hidden',
  color: '#FFFFFF',
  fontFamily: "'Fredoka',sans-serif",
  background:
    'radial-gradient(circle at 15% 14%, #FF6A00 0%, transparent 45%), radial-gradient(circle at 86% 24%, #FFB800 0%, transparent 45%), radial-gradient(circle at 50% 96%, #FF8A00 0%, transparent 50%), linear-gradient(160deg,#FF9500,#A45CD0)',
};

const heroTitleStyle = {
  fontFamily: "'Bagel Fat One','Fredoka',cursive",
  fontWeight: 400,
  fontSize: 'clamp(34px, 10vw, 56px)',
  lineHeight: 1.18,
  margin: '18px 0 2px',
  paddingBottom: 6,
  color: '#FFE600',
};

const heroImgStyle = {
  display: 'block',
  height: 'clamp(220px, 54vw, 380px)',
  maxWidth: '86vw',
  objectFit: 'contain',
  transform: 'rotate(2deg)',
  filter:
    'drop-shadow(4px 0 0 #FFE600) drop-shadow(-4px 0 0 #FFE600) drop-shadow(0 4px 0 #FFE600) drop-shadow(0 -4px 0 #FFE600) drop-shadow(0 18px 26px rgba(0,0,0,.55))',
};

const chipStyle = {
  background: 'rgba(146,78,190,.92)',
  color: '#fff',
  border: '3px dashed #FFE600',
  borderRadius: 20,
  padding: 'clamp(10px, 2.8vw, 14px) clamp(13px, 3.6vw, 20px)',
  fontWeight: 600,
  fontSize: 'clamp(14px, 3.7vw, 18px)',
  boxShadow: '0 10px 24px rgba(0,0,0,.4)',
  fontFamily: "'Fredoka',sans-serif",
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
};

const cardStyle = {
  background: 'rgba(146,78,190,.92)',
  border: '4px solid #FFE600',
  borderRadius: 'clamp(22px, 6vw, 32px)',
  padding: 'clamp(22px, 6vw, 30px) clamp(18px, 5vw, 26px) clamp(26px, 7vw, 34px)',
  margin: 'clamp(26px, 7vw, 34px) auto 0',
  maxWidth: 560,
  boxShadow: '0 26px 60px rgba(0,0,0,.5)',
  animation: 'riseIn .8s .45s both',
  position: 'relative',
};

const cardBadgeStyle = {
  position: 'absolute',
  top: -26,
  left: '50%',
  transform: 'translateX(-50%) rotate(-3deg)',
  background: '#FFE600',
  color: '#2A0845',
  fontFamily: "'Bagel Fat One','Fredoka',cursive",
  fontSize: 'clamp(18px, 5vw, 24px)',
  padding: '8px clamp(18px, 5vw, 26px)',
  borderRadius: 999,
  boxShadow: '0 10px 20px rgba(0,0,0,.4)',
  whiteSpace: 'nowrap',
};

const inputStyle = {
  width: '100%',
  border: '2px solid rgba(255,255,255,.26)',
  background: 'rgba(255,255,255,.07)',
  color: '#fff',
  borderRadius: 18,
  padding: '14px 16px',
  fontSize: 16,
  fontWeight: 500,
  outline: 'none',
};

const summaryBoxStyle = {
  background: 'rgba(255,255,255,.06)',
  border: '2px dashed rgba(255,255,255,.2)',
  borderRadius: 20,
  padding: 18,
  textAlign: 'left',
  fontSize: 15,
  lineHeight: 1.7,
  color: '#fff',
};

const ghostBtnStyle = {
  marginTop: 22,
  background: 'none',
  border: '2px solid rgba(255,255,255,.26)',
  color: '#FFE9C4',
  borderRadius: 999,
  padding: '10px 24px',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  fontFamily: "'Fredoka',sans-serif",
};

const envelopeStyle = {
  position: 'absolute',
  inset: 0,
  background: '#C9A0E8',
  borderRadius: 26,
  boxShadow: '0 24px 50px rgba(0,0,0,.5)',
  border: '4px solid #FFE600',
  overflow: 'hidden',
  animation: 'wob 4s ease-in-out infinite',
};

const openBtnStyle = {
  fontFamily: "'Bagel Fat One','Fredoka',cursive",
  fontSize: 'clamp(20px, 5.5vw, 24px)',
  background: '#FFE600',
  color: '#2A0845',
  border: 'none',
  borderRadius: 999,
  padding: 'clamp(14px, 4vw, 18px) clamp(30px, 8vw, 44px)',
  cursor: 'pointer',
  animation: 'pulseGlow 1.8s ease-in-out infinite',
};
