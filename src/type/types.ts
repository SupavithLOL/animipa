//Jikan API Types

export type ApiResponse<T> = {
  data: T | null;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  error: string | null;
}

export interface Anime {
  mal_id: number;
  url: string,
  title: string;
  images: {
    jpg: {
      image_url: string,
      small_image_url: string,
      large_image_url: string
    };
  };
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  }
  score?: number;
  rank?: number;
  favorites: number;
  synopsis?: string;
  season: string;
  genres: [
    {
        mal_id: number;
        type: string;
        name: string;
        url: string;
    }
  ]
  status: string;
  aired: {
    from: Date;
    to: Date;
    prop: {
        from: {
            day: number;
            month: number;
            year: number
        }
        to: {
            day: number;
            month: number;
            year: number
        }
    }
  }
};

export interface Genre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

export interface Character {
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    name: string;
  };
  role: string;
  voice_actors: Array<{
    person: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      name: string;
    };
    language: string;
  }>;
}

// User-related types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  username: string;
}

export interface FavoriteAnime {
  id: string;
  animeId: number;
  userId: string;
  addedAt: string;
  anime?: Anime;
}

export interface WatchlistItem {
  id: string;
  animeId: number;
  userId: string;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold';
  rating?: number;
  progress?: number;
  updatedAt: string;
  anime?: Anime;
}

export interface AnimeComment {
  id: string;
  animeId: number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
  };
}