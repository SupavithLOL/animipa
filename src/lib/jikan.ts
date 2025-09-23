import { cache } from "react";
import { Anime, ApiResponse, Character, Genre } from "@/type/types";

const BASE_URL = process.env.NEXT_PUBLIC_JIKAN_API_BASE_URL || "https://api.jikan.moe/v4";
const MIN_INTERVAL = 1000; 

export const CACHE_TIMES = {
  NO_CACHE: 0,
  SHORT: 300,      // 5 minutes
  MEDIUM: 3600,    // 1 hour
  LONG: 86400,     // 24 hours
};

let lastRequestTime = 0;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

type RequestOptions = {
  revalidate?: number;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { revalidate = CACHE_TIMES.MEDIUM } = options;

  // --- Rate Limiting ---
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL) {
    await delay(MIN_INTERVAL - elapsed);
  }
  lastRequestTime = Date.now();

  // --- Fetch Options ---
  const fetchOptions: RequestInit = {
    headers: { "User-Agent": "MyAwesomeAnimeApp/1.0.0" },
    // Use Next.js's built-in fetch caching
    next: revalidate > 0 ? { revalidate } : undefined,
    cache: revalidate === 0 ? "no-store" : "default",
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    return await handleResponse<T>(res, endpoint, options);
  } catch (err) {
    return handleError(err);
  }
}

async function handleResponse<T>(res: Response, endpoint: string, originalOptions: RequestOptions): Promise<ApiResponse<T>> {
  if (res.status === 404) {
    return { data: null, error: "Not Found" };
  }

  if (res.status === 429) { // Too Many Requests
    const retryAfter = res.headers.get("retry-after");
    const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000;
    console.warn(`Jikan API rate limited. Retrying endpoint "${endpoint}" after ${waitTime}ms.`);
    await delay(waitTime);
    return request<T>(endpoint, originalOptions); // Retry with the original options
  }

  if (!res.ok) {
    throw new Error(`Jikan API error: ${res.status} ${res.statusText} for endpoint "${endpoint}"`);
  }

  const json = await res.json();
  return { data: json.data, pagination: json.pagination, error: null };
}

function handleError<T>(error: unknown): ApiResponse<T> {
  console.error("Jikan API request failed:", error);
  const message = error instanceof Error ? error.message : "An unknown error occurred.";
  return { data: null, error: message };
}

const requestLong = cache(<T,>(endpoint: string) =>
  request<T>(endpoint, { revalidate: CACHE_TIMES.LONG })
);

export const getGenres = () => requestLong<Genre[]>("/genres/anime");

export const getAnimeCharacters = (id: string | number) => requestLong<Character[]>(`/anime/${id}/characters`);

export const getAnimeById = (id: string | number) =>
  request<Anime>(`/anime/${id}/full`, { revalidate: CACHE_TIMES.MEDIUM * 2 }); // 2 hours

export const searchAnime = (
  query: string,
  page = 1,
  options: {
    type?: string;
    status?: string;
    rating?: string;
    genres?: string;
    limit?: number;
  } = {}
) => {
  const params = new URLSearchParams({
    q: query, // URLSearchParams handles encoding
    page: page.toString(),
    limit: (options.limit ?? 25).toString(),
  });

  Object.entries(options).forEach(([key, value]) => {
    if (value && key !== "limit") {
      params.append(key, String(value));
    }
  });
  
  return request<Anime[]>(`/anime?${params.toString()}`, { revalidate: CACHE_TIMES.MEDIUM });
};

export const getTopAnime = (page = 1, filter: "airing" | "upcoming" | "bypopularity" | "favorite" = "bypopularity") =>
  request<Anime[]>(`/top/anime?page=${page}&filter=${filter}`, {
    revalidate: filter === "airing" ? CACHE_TIMES.SHORT : CACHE_TIMES.MEDIUM,
  });

export const getCurrentSeason = () =>
  request<Anime[]>("/seasons/now", { revalidate: CACHE_TIMES.SHORT * 2 }); // 10 minutes

export const getSeasonalAnime = (year: number, season: "winter" | "spring" | "summer" | "fall") => {
  const isCurrentYear = year === new Date().getFullYear();
  return request<Anime[]>(`/seasons/${year}/${season}`, {
    revalidate: isCurrentYear ? CACHE_TIMES.MEDIUM : CACHE_TIMES.LONG,
  });
};

export const getRandomAnime = () =>
  request<Anime>("/random/anime", { revalidate: CACHE_TIMES.NO_CACHE });

export const getTop10PopularAnime = async (): Promise<{ data: Anime[]; error: string | null }> => {
  const res = await getTopAnime(1, "bypopularity");
  if (res.error || !res.data || !Array.isArray(res.data)) {
    return { data: [], error: res.error || "Failed to fetch top popular anime." };
  }
  const animeArray: Anime[] = Array.isArray(res.data) ? res.data : [res.data];

  return { data: animeArray.slice(0, 10), error: null };
};