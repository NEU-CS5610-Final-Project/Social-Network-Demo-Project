const REMOTE_SERVER =
  import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";

const API_BASE = `${REMOTE_SERVER.replace(/\/+$/, "")}/api`;

export interface MovieSearchResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieSearchResponse {
  page: number;
  results: MovieSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails {
  adult: boolean;
  vote_average: number;
  vote_count: number;
  overview: string;
  id: number;
  original_language: string;
  poster_path: string;
  release_date: string;
  title: string;
  genres: Array<{ id: number; name: string }>;
}


// const API_BASE = "http://localhost:4000/api";

export const searchMovies = async (
  query: string,
  page: number = 1,
  language: string = "en-US"
): Promise<MovieSearchResponse> => {
  try {
    const response = await fetch(
      `${API_BASE}/tmdb/search?q=${encodeURIComponent(query)}&page=${page}&lang=${language}`
    );
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (
  movieId: number,
  language: string = "en-US"
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${API_BASE}/tmdb/details/${movieId}?lang=${language}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get movie details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting movie details:", error);
    throw error;
  }
};

export const getPosterUrl = (posterPath: string, size: string = "w500"): string => {
  if (!posterPath) return "";
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};
