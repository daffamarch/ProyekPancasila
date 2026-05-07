import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`https://quran-api-id.vercel.app/surah/${id}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('Failed to fetch surah detail');
    
    const json = await res.json();
    const surahData = json.data;
    
    // Extract audio from first verse if top-level audio is not available
    const audioUrl = surahData.verses?.[0]?.audio?.primary || '';
    
    return NextResponse.json({
      ...surahData,
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error('Quran Detail Proxy Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil detail surah dari server' }, { status: 500 });
  }
}
