import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://quran-api-id.vercel.app/surah', {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('Failed to fetch from Quran API');
    
    const json = await res.json();
    // The actual data is in json.data
    return NextResponse.json(json.data || []);
  } catch (error) {
    console.error('Quran Proxy Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data Al-Quran dari server' }, { status: 500 });
  }
}
