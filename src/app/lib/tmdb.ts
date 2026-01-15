// TMDB API Integration Utility
const TMDB_API_KEY = '0db4b147e5e93aafaf72883962830fa0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBCredits {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
  }>;
}

/**
 * Search for a movie by title and optionally year
 */
export async function searchMovie(title: string, year?: string): Promise<TMDBMovie | null> {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: title,
      include_adult: 'false'
    });

    if (year) {
      params.append('year', year);
    }

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`TMDB API error for "${title}": ${response.status}`);
      return null;
    }

    const data: TMDBSearchResponse = await response.json();
    
    // Return the first result (best match)
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error(`Error searching for movie "${title}":`, error);
    return null;
  }
}

/**
 * Get movie credits (cast & crew) including director
 */
export async function getMovieCredits(movieId: number): Promise<TMDBCredits | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`TMDB API error for credits ${movieId}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching credits for movie ${movieId}:`, error);
    return null;
  }
}

/**
 * Get full poster URL from TMDB poster_path
 * Sizes: w92, w154, w185, w342, w500, w780, original
 */
export function getPosterUrl(posterPath: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

/**
 * Get full backdrop URL from TMDB backdrop_path
 * Sizes: w300, w780, w1280, original
 */
export function getBackdropUrl(backdropPath: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
}

/**
 * Find director from movie credits
 */
export function findDirector(credits: TMDBCredits | null): string {
  if (!credits || !credits.crew) return 'Unknown';
  
  const director = credits.crew.find(
    person => person.job === 'Director'
  );
  
  return director ? director.name : 'Unknown';
}

/**
 * Discover random movies from TMDB
 */
export async function discoverRandomMovies(count: number = 10): Promise<TMDBMovie[]> {
  try {
    // Get a random page between 1-100 for variety (high-rated movies)
    const randomPage = Math.floor(Math.random() * 100) + 1;
    
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      sort_by: 'vote_average.desc',
      include_adult: 'false',
      'vote_count.gte': '2000', // Only movies with substantial votes
      'vote_average.gte': '7.0', // High ratings only (7.0+)
      page: randomPage.toString()
    });

    const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`TMDB discover API error: ${response.status}`);
      return [];
    }

    const data: TMDBSearchResponse = await response.json();
    
    // Shuffle and return requested count
    const shuffled = data.results.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error discovering movies:', error);
    return [];
  }
}

/**
 * Get trending movies of the week
 */
export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`TMDB trending API error: ${response.status}`);
      return [];
    }

    const data: TMDBSearchResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

/**
 * Batch search with rate limiting
 */
export async function batchSearchMovies(
  movies: Array<{ title: string; year: string }>,
  delayMs: number = 250 // TMDB allows ~40 requests/10 seconds
): Promise<Map<string, TMDBMovie>> {
  const results = new Map<string, TMDBMovie>();

  for (const movie of movies) {
    const key = `${movie.title}|${movie.year}`;
    const result = await searchMovie(movie.title, movie.year);
    
    if (result) {
      results.set(key, result);
    }

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return results;
}

/**
 * Get genre name from genre ID
 */
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export function getGenreName(genreIds: number[]): string {
  if (!genreIds || genreIds.length === 0) return 'Unknown';
  return genreIds.slice(0, 2).map(id => GENRE_MAP[id] || 'Unknown').join(', ');
}
