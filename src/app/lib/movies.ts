// Enhanced movie database with TMDB poster integration
import { TOP_RATED_FILMS } from './curated-films';
import { generateMovieId } from './movies-enhanced';

export interface Movie {
  id: string;
  title: string;
  year: string;
  rating: number;
  genre: string;
  leadActor: string;
  director: string;
  poster: string | null;
  backdrop: string | null;
  plot?: string; // Optional - for TMDB discovery films
}

// Convert curated films to Movie format (posters will be fetched via TMDB)
export const PREMIUM_SLIDESHOW_MOVIES: Movie[] = TOP_RATED_FILMS.map(film => ({
  id: generateMovieId(film.title, film.year),
  ...film,
  poster: null, // Will be fetched from TMDB
  backdrop: null // Will be fetched from TMDB
}));

// Legacy export for backward compatibility (will use TMDB-enhanced movies)
export const MOVIES: Movie[] = PREMIUM_SLIDESHOW_MOVIES;

// Discovery films - these will use TMDB's discover API for random suggestions
export const RANDOM_FILMS: Movie[] = [];

// Full watch history count
export const TOTAL_FILMS_WATCHED = 907;