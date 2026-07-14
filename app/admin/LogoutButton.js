'use client';

export default function LogoutButton() {
  async function logout() {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch {}
    window.location.reload();
  }
  return (
    <button onClick={logout} className="mc-ghost" style={btn}>
      Odjava
    </button>
  );
}

const btn = {
  background: 'none',
  border: '2px solid rgba(255,255,255,.26)',
  color: '#FFE9C4',
  borderRadius: 999,
  padding: '8px 18px',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: "'Fredoka',sans-serif",
};
