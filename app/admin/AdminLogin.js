'use client';

import { useState } from 'react';

export default function AdminLogin({ configError }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Prijava nije uspjela.');
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch {
      setError('Nema veze sa serverom.');
      setLoading(false);
    }
  }

  return (
    <div style={wrap}>
      <form onSubmit={submit} style={card}>
        <div style={{ fontFamily: "'Bagel Fat One','Fredoka',cursive", fontSize: 30, color: '#FFE600', marginBottom: 6 }}>Marica 30 · admin</div>
        <p style={{ color: '#FFE9C4', fontWeight: 600, margin: '0 0 20px' }}>Unesi lozinku za pregled odgovora.</p>

        {configError ? (
          <p style={{ color: '#FFB4B4', fontWeight: 700 }}>{configError}</p>
        ) : (
          <>
            <input
              className="mc-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="lozinka"
              autoFocus
              style={input}
            />
            <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Provjeravam…' : 'Uđi 🪩'}
            </button>
            {error && <p style={{ color: '#FFB4B4', fontWeight: 700, marginTop: 12, textAlign: 'center' }}>{error}</p>}
          </>
        )}
      </form>
    </div>
  );
}

const wrap = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  background: 'linear-gradient(160deg,#FF9500,#A45CD0)',
};
const card = {
  width: '100%',
  maxWidth: 380,
  background: 'rgba(146,78,190,.92)',
  border: '4px solid #FFE600',
  borderRadius: 28,
  padding: '30px 26px',
  boxShadow: '0 26px 60px rgba(0,0,0,.5)',
};
const input = {
  width: '100%',
  border: '2px solid rgba(255,255,255,.26)',
  background: 'rgba(255,255,255,.07)',
  color: '#fff',
  borderRadius: 16,
  padding: '14px 16px',
  fontSize: 16,
  fontWeight: 500,
  outline: 'none',
  marginBottom: 14,
};
const btn = {
  width: '100%',
  border: 'none',
  borderRadius: 999,
  padding: 15,
  background: '#FFE600',
  color: '#2A0845',
  fontFamily: "'Fredoka',sans-serif",
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
};
