import { getAnimeById } from "@/lib/jikan";
import { notFound } from "next/navigation";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await getAnimeById(id);
  const anime = response.data;

  if (!anime) notFound();

  return (
    <div>
      <h1>{anime.title}</h1>
      <div>{anime.synopsis}</div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const response = await getAnimeById(id);
  const anime = response.data;

  if (!anime) return { title: "Anime Not Found" };

  return {
    title: `${anime.title} - Animipa`,
    description:
      anime.synopsis?.slice(0, 160) || `ดูข้อมูล ${anime.title} อนิเมะยอดนิยม`,
    openGraph: {
      title: anime.title,
      description: anime.synopsis?.slice(0, 160),
      images: [anime.images?.jpg?.large_image_url],
    },
  };
}
