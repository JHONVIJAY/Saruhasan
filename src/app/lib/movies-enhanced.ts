// Enhanced movie database with TMDB integration
import { getPosterUrl, getBackdropUrl, searchMovie } from './tmdb';

export interface EnhancedMovie {
  id: string;
  title: string;
  year: string;
  rating: number;
  genre: string;
  leadActor: string;
  director: string;
  poster: string | null;
  backdrop: string | null;
  tmdbId?: number;
}

// Cache for TMDB lookups to avoid repeated API calls
const tmdbCache = new Map<string, any>();

/**
 * Generate a unique ID from title and year
 */
export function generateMovieId(title: string, year: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${year}`;
}

/**
 * Fetch TMDB poster for a movie with caching
 */
export async function fetchMoviePoster(
  title: string, 
  year: string
): Promise<{ poster: string | null; backdrop: string | null; tmdbId?: number }> {
  const cacheKey = `${title}|${year}`;
  
  // Check cache first
  if (tmdbCache.has(cacheKey)) {
    return tmdbCache.get(cacheKey);
  }

  try {
    const tmdbMovie = await searchMovie(title, year);
    
    if (tmdbMovie) {
      const result = {
        poster: getPosterUrl(tmdbMovie.poster_path, 'w500'),
        backdrop: getBackdropUrl(tmdbMovie.backdrop_path, 'w1280'),
        tmdbId: tmdbMovie.id
      };
      
      // Cache the result
      tmdbCache.set(cacheKey, result);
      return result;
    }
  } catch (error) {
    console.error(`Error fetching poster for ${title} (${year}):`, error);
  }

  // Return null if not found
  const result = { poster: null, backdrop: null };
  tmdbCache.set(cacheKey, result);
  return result;
}

/**
 * Create placeholder image for movies without TMDB data
 */
export function getPlaceholderPoster(title: string, genre: string): string {
  // Use Unsplash with genre-based search
  const genreKeywords = genre.split(',')[0].trim().toLowerCase();
  return `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop&q=80`;
}

/**
 * Get display rating with stars
 */
export function getRatingDisplay(rating: number): string {
  if (rating === 5) return '⭐⭐⭐⭐⭐';
  if (rating === 4.5) return '⭐⭐⭐⭐✨';
  if (rating === 4) return '⭐⭐⭐⭐';
  if (rating === 3.5) return '⭐⭐⭐✨';
  if (rating === 3) return '⭐⭐⭐';
  if (rating === 2.5) return '⭐⭐✨';
  if (rating === 2) return '⭐⭐';
  if (rating === 1.5) return '⭐✨';
  return '⭐';
}

/**
 * Filter movies by minimum rating
 */
export function filterByRating(movies: EnhancedMovie[], minRating: number): EnhancedMovie[] {
  return movies.filter(movie => movie.rating >= minRating);
}

/**
 * Filter movies by genre
 */
export function filterByGenre(movies: EnhancedMovie[], genre: string): EnhancedMovie[] {
  return movies.filter(movie => 
    movie.genre.toLowerCase().includes(genre.toLowerCase())
  );
}

/**
 * Search movies by title, actor, or director
 */
export function searchMovies(movies: EnhancedMovie[], query: string): EnhancedMovie[] {
  const lowerQuery = query.toLowerCase();
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.leadActor.toLowerCase().includes(lowerQuery) ||
    movie.director.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get unique genres from movie list
 */
export function getUniqueGenres(movies: EnhancedMovie[]): string[] {
  const genreSet = new Set<string>();
  movies.forEach(movie => {
    movie.genre.split(',').forEach(g => genreSet.add(g.trim()));
  });
  return Array.from(genreSet).sort();
}

/**
 * Get unique directors from movie list
 */
export function getUniqueDirectors(movies: EnhancedMovie[]): string[] {
  const directorSet = new Set<string>();
  movies.forEach(movie => directorSet.add(movie.director));
  return Array.from(directorSet).sort();
}

/**
 * Sort movies by rating (descending)
 */
export function sortByRating(movies: EnhancedMovie[]): EnhancedMovie[] {
  return [...movies].sort((a, b) => b.rating - a.rating);
}

/**
 * Sort movies by year (descending)
 */
export function sortByYear(movies: EnhancedMovie[]): EnhancedMovie[] {
  return [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
}

/**
 * Sort movies alphabetically by title
 */
export function sortByTitle(movies: EnhancedMovie[]): EnhancedMovie[] {
  return [...movies].sort((a, b) => a.title.localeCompare(b.title));
}
