import { notFound } from "next/navigation";
import { jikanAPI } from "@/lib/jikan";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = await params;
    const response = await jikanAPI.getAnimeById(id);
    const anime = response.data;

    if (!anime) {
      notFound();
    }

    return (
      <div>
        <h1>{anime.title}</h1>
        <p>{anime.synopsis}</p>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const response = await jikanAPI.getAnimeById(id);
    const anime = response.data;

    return {
      title: `${anime.title} - Animipa`,
      description:
        anime.synopsis?.slice(0, 160) ||
        `ดูข้อมูล ${anime.title} อนิเมะยอดนิยม`,
      openGraph: {
        title: anime.title,
        description: anime.synopsis?.slice(0, 160),
        images: [anime.images?.jpg?.large_image_url],
      },
    };
  } catch (error) {
    return {
      title: "Anime Not Found - AnimeHub",
    };
  }
}
