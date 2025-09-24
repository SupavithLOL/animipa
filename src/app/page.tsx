import { Suspense } from "react";
import Top10Section from "./components/sections/Top10AnimeSection";
import LoadingSkeleton from "./components/ui/LoadingSkeleton";
import { getTop10PopularAnime } from "@/lib/jikan";

export default async function Home() {
  const { data: topAnime } = await getTop10PopularAnime();
  return (
    <div>
      <Suspense fallback={<LoadingSkeleton type="anime-grid" />}>
        <Top10Section topAnime={topAnime} />
      </Suspense>
    </div>
  );
}
