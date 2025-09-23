import { getTop10PopularAnime } from "@/lib/jikan";
import AnimeCard from "../ui/AnimeCard";
import { Anime } from "@/type/types";

export default async function Top10Section() {
  const { data: top10Anime } = await getTop10PopularAnime();

  return (
    <section className="py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white relative">
            อนิเมะยอดนิยม
            <span className="block w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mt-2 rounded-full"></span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            อนิเมะที่ได้รับความนิยมสูงสุดบน MyAnimeList
          </p>
        </div>
        <a
          href="/top-anime"
          className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
        >
          ดูทั้งหมด →
        </a>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {top10Anime.map((anime: Anime) => (
          <AnimeCard key={anime.mal_id} {...anime} />
        ))}
      </div>
    </section>
  );
}
