import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/rsvp  -> create or update an RSVP (deduped by lowercased name).
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtjev.' }, { status: 400 });
  }

  const name = String(body?.name ?? '').trim();
  const attending = body?.attending;
  const drink = String(body?.drink ?? '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Prvo napiši tko si!' }, { status: 400 });
  }
  if (attending !== true && attending !== false) {
    return NextResponse.json({ error: 'Odaberi dolaziš li ili ne!' }, { status: 400 });
  }
  if (name.length > 120 || drink.length > 500) {
    return NextResponse.json({ error: 'Predugačak unos.' }, { status: 400 });
  }

  const row = {
    name,
    name_key: name.toLowerCase(),
    attending,
    drink: drink || null,
  };

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('rsvps')
      .upsert(row, { onConflict: 'name_key' })
      .select()
      .single();

    if (error) {
      console.error('[rsvp] supabase error', error);
      return NextResponse.json({ error: 'Greška pri spremanju. Pokušaj ponovno.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, rsvp: data });
  } catch (err) {
    console.error('[rsvp] fatal', err);
    return NextResponse.json({ error: 'Server nije konfiguriran.' }, { status: 500 });
  }
}
