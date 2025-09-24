"use client";

import AnimeCard from "../ui/AnimeCard";
import { Anime } from "@/type/types";

export default function Top10Section({ topAnime }: { topAnime: Anime[] }) {
  return (
    <section className="py-12 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white relative">
            อนิเมะยอดนิยม
            <span className="block w-1/2 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mt-2 rounded-full"></span>
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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {topAnime.map((anime: Anime) => (
          <AnimeCard key={anime.mal_id} {...anime} />
        ))}
      </div>
    </section>
  );
}
