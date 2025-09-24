"use client";

import Image from "next/image";
import Link from "next/link";
import { Anime } from "@/type/types";
import { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";
import { formatDate } from "@/utils/data";

export default function AnimeCard({
  mal_id,
  title,
  images,
  trailer,
  score,
  genres,
  status,
  aired,
}: Anime) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if the device supports touch events
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const getVideoUrl = () => {
    if (!trailer?.youtube_id) return null;
    return `https://www.youtube.com/embed/${trailer.youtube_id}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`;
  };

  const handleInteraction = () => {
    if (isTouchDevice) {
      // Toggle for touch devices
      setIsHovered(!isHovered);
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsHovered(false);
    }
  };

  const videoUrl = getVideoUrl();
  const hasVideo = videoUrl && !videoError;

  return (
    <div
      className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg group bg-gray-800 transition-transform duration-300 hover:scale-105"
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={
          images?.jpg?.large_image_url ||
          images?.jpg?.image_url ||
          "/placeholder.jpg"
        }
        alt={title}
        fill
        className={`object-cover transition-opacity duration-500 ${
          isHovered && hasVideo ? "opacity-0" : "opacity-100"
        }`}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        priority={false}
      />

      {hasVideo && isHovered && (
        <iframe
          src={videoUrl}
          className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          loading="lazy"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
        {score && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Star color="white" size={16} fill="white" /> {score}
          </div>
        )}

        <h3 className="font-bold text-base line-clamp-2 mb-2 leading-tight">
          {title}
        </h3>

        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {genres.slice(0, 3).map((genre) => (
              <span
                key={genre.mal_id}
                className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-md text-gray-200"
              >
                {genre.name}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-400">
                +{genres.length - 3}
              </span>
            )}
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Link href={`/anime/${mal_id}`} passHref>
            <button className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200 w-full">
              ดูรายละเอียด
            </button>
          </Link>
        </div>

        {!isHovered && (
          <div className="absolute bottom-4 left-4 text-white font-bold text-xs px-2 py-1 rounded-md flex items-center gap-1">
            {status} | {formatDate(aired.from)} - {formatDate(aired.to)}
          </div>
        )}
      </div>
      {hasVideo && !isHovered && (
        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l8-5-8-5z" />
          </svg>
          Trailer
        </div>
      )}
    </div>
  );
}
