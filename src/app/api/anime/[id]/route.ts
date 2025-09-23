// import { NextRequest, NextResponse } from 'next/server';
// import { jikanAPI } from '@/lib/jikan';

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const id = params.id;

//         if(!id) {
//             return NextResponse.json({ error: 'Missing id' }, { status: 400 });
//         }

//         const data = await jikanAPI.getAnimeById(id);

//         return NextResponse.json(data, {headers: {"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",},});

//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch anime details' }, { status: 500 });
//     }
// }