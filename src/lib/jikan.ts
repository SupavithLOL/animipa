import { cache } from "react";
import { Anime, ApiResponse, Character, Genre } from "@/type/types";

const BASE_URL = "https://api.jikan.moe/v4";

export const CACHE_TIMES = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 3600,    // 1 hour 
  LONG: 86400,     // 24 hours
};

type RequestOptions = {
  revalidate?: number;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { revalidate = CACHE_TIMES.MEDIUM } = options;

  const fetchOptions: RequestInit = {
    headers: { "User-Agent": "AnimipaApp/1.0" },
    next: { revalidate },
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    
    if (res.status === 404) {
      return { data: null, error: "Not Found" };
    }
    
    if (!res.ok) {
      return { data: null, error: `Network error ${res.status}` };
    }

    const json = await res.json();
    return { data: json.data, pagination: json.pagination, error: null };
    
  } catch (error) {
    return { data: null, error: "Network error" };
  }
}

// Cache ฟังก์ชันที่ใช้บ่อย
const cachedRequest = cache(<T,>(endpoint: string, revalidate: number) =>
  request<T>(endpoint, { revalidate })
);

// Export functions - ง่ายและเร็ว
export const getAnimeById = (id: string | number) =>
  cachedRequest<Anime>(`/anime/${id}/full`, CACHE_TIMES.MEDIUM * 2);

export const getAnimeCharacters = (id: string | number) =>
  cachedRequest<Character[]>(`/anime/${id}/characters`, CACHE_TIMES.LONG);

export const getGenres = () =>
  cachedRequest<Genre[]>("/genres/anime", CACHE_TIMES.LONG);

export const searchAnime = (query: string, page = 1, options: Record<string, number> = {}) => {
  const params = new URLSearchParams({
    q: String(query),
    page: String(page),
    limit: "25",
    ...options
  });
  
  return request<Anime[]>(`/anime?${params}`, { revalidate: CACHE_TIMES.MEDIUM });
};

export const getTopAnime = (page = 1, filter: "airing" | "upcoming" | "bypopularity" | "favorite" = "bypopularity") =>
  request<Anime[]>(`/top/anime?page=${page}&filter=${filter}`, {
    revalidate: filter === "airing" ? CACHE_TIMES.SHORT : CACHE_TIMES.MEDIUM,
  });

export const getCurrentSeason = () =>
  cachedRequest<Anime[]>("/seasons/now", CACHE_TIMES.SHORT);

export const getSeasonalAnime = (year: number, season: "winter" | "spring" | "summer" | "fall") =>
  cachedRequest<Anime[]>(`/seasons/${year}/${season}`, CACHE_TIMES.LONG);

export const getRandomAnime = () =>
  request<Anime>("/random/anime", { revalidate: 0 });

export const getTop10PopularAnime = async () => {
  const response = await getTopAnime(1, "bypopularity");
  
  if (response.error || !response.data) {
    return { data: [], error: response.error || "Failed to fetch" };
  }
  
  const top10 = response.data.slice(0, 10);
  return { data: top10, error: null };
};