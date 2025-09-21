const BASE_URL = 'https://api.jikan.moe/v4';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class JikanAPI {
    private lastRequestTime: number;
    private minInterval: number;

    constructor() {
    this.lastRequestTime = 0;
    this.minInterval = 1000;
  }

   private async request(url: string) {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minInterval) {
      await delay(this.minInterval - elapsed);
    }

    const res = await fetch(`${BASE_URL}${url}`, {
      next: { revalidate: 3600 },
    });

    if(res.status === 404) return { data: null };

    if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);

    this.lastRequestTime = Date.now();
    return res.json();
  }

  getAnimeById(id: string) {
    return this.request(`/anime/${id}/full`);
  }
}

export const jikanAPI = new JikanAPI();