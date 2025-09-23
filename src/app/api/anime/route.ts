// import { NextRequest, NextResponse } from 'next/server';
// import { jikanAPI } from '@/lib/jikan';

// // GET /api/anime?q=query&page=1&type=top
// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const query = searchParams.get('q');
//     const page = parseInt(searchParams.get('page') || '1');
//     const type = searchParams.get('type') || 'search';
//     const filter = searchParams.get('filter') || 'bypopularity';

//     let data;
    
//     if (type === 'top') {
//       data = await jikanAPI.getTopAnime(page, filter);
//     } else if (type === 'seasonal') {
//       data = await jikanAPI.getCurrentSeason();
//     } else if (query) {
//       data = await jikanAPI.searchAnime(query, page);
//     } else {
//       data = await jikanAPI.getTopAnime(page, filter);
//     }

//     return NextResponse.json(data, {
//       headers: {
//         'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
//       },
//     });
//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch anime data' },
//       { status: 500 }
//     );
//   }
// }