import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase';
import AdminLogin from './AdminLogin';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

const COOKIE = 'marica_admin';

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminPage() {
  const expected = process.env.ADMIN_PASSWORD;
  const store = await cookies();
  const authed = !!expected && store.get(COOKIE)?.value === expected;

  if (!authed) {
    return <AdminLogin configError={!expected ? 'ADMIN_PASSWORD nije postavljen. Dodaj ga u environment varijable.' : ''} />;
  }

  let rows = [];
  let loadError = '';
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('rsvps')
      .select('id, name, attending, drink, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    rows = data || [];
  } catch (err) {
    loadError = 'Ne mogu dohvatiti odgovore. Provjeri Supabase konfiguraciju i da tablica "rsvps" postoji.';
  }

  const dolazi = rows.filter((r) => r.attending);
  const neDolazi = rows.filter((r) => !r.attending);

  return (
    <div style={page}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 18px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Bagel Fat One','Fredoka',cursive", fontSize: 30, color: '#FFE600', lineHeight: 1.1 }}>Marica 30 · odgovori</div>
            <div style={{ color: '#FFE9C4', fontWeight: 600, marginTop: 4 }}>29.8.2026. · Downstairs, Krešićeva 32</div>
          </div>
          <LogoutButton />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '22px 0 8px' }}>
          <Stat label="Ukupno" value={rows.length} />
          <Stat label="Dolazi 🪩" value={dolazi.length} accent="#FFE600" />
          <Stat label="Ne dolazi" value={neDolazi.length} accent="#FFFFFF" />
        </div>

        {loadError && (
          <div style={{ background: 'rgba(180,40,40,.35)', border: '2px solid #FFB4B4', color: '#fff', borderRadius: 16, padding: 16, fontWeight: 600, marginTop: 16 }}>
            {loadError}
          </div>
        )}

        {!loadError && rows.length === 0 && (
          <p style={{ color: '#FFE9C4', fontWeight: 600, marginTop: 24 }}>Još nema odgovora.</p>
        )}

        {/* Table */}
        {rows.length > 0 && (
          <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
            {rows.map((r) => (
              <div key={r.id} style={rowCard}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>{r.name}</span>
                  <span style={r.attending ? badgeYes : badgeNo}>{r.attending ? 'DOLAZI 🪩' : 'ne dolazi'}</span>
                </div>
                <div style={{ color: '#FFE9C4', fontSize: 14, marginTop: 8 }}>
                  <strong style={{ color: '#FFE600' }}>Piće:</strong> {r.drink || '—'}
                </div>
                <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, marginTop: 6 }}>{fmtDate(r.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent = '#FFE9C4' }) {
  return (
    <div style={{ flex: '1 1 140px', background: 'rgba(146,78,190,.92)', border: '3px solid ' + accent, borderRadius: 20, padding: '16px 18px', boxShadow: '0 10px 24px rgba(0,0,0,.35)' }}>
      <div style={{ fontSize: 34, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
      <div style={{ color: '#FFE9C4', fontWeight: 600, marginTop: 4, fontSize: 14 }}>{label}</div>
    </div>
  );
}

const page = {
  minHeight: '100vh',
  color: '#fff',
  fontFamily: "'Fredoka',sans-serif",
  background: 'radial-gradient(circle at 15% 14%, #FF6A00 0%, transparent 45%), radial-gradient(circle at 86% 24%, #FFB800 0%, transparent 45%), linear-gradient(160deg,#FF9500,#A45CD0)',
};
const rowCard = {
  background: 'rgba(146,78,190,.92)',
  border: '2px solid rgba(255,230,0,.55)',
  borderRadius: 20,
  padding: '16px 18px',
  boxShadow: '0 10px 24px rgba(0,0,0,.3)',
};
const badgeYes = {
  background: '#FFE600',
  color: '#2A0845',
  borderRadius: 999,
  padding: '4px 14px',
  fontWeight: 700,
  fontSize: 13,
  whiteSpace: 'nowrap',
};
const badgeNo = {
  background: 'rgba(255,255,255,.85)',
  color: '#2A0845',
  borderRadius: 999,
  padding: '4px 14px',
  fontWeight: 700,
  fontSize: 13,
  whiteSpace: 'nowrap',
};
