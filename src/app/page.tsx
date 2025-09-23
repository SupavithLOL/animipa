import { Suspense } from "react";
import Top10Section from "./components/sections/Top10AnimeSection";
import LoadingSkeleton from "./components/ui/LoadingSkeleton";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<LoadingSkeleton type="anime-grid" />}>
        <Top10Section />
      </Suspense>
    </div>
  );
}
