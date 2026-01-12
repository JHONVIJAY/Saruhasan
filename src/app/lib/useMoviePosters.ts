import { useState, useEffect } from 'react';
import { fetchMoviePoster, EnhancedMovie, generateMovieId } from './movies-enhanced';

export interface MovieWithPoster extends EnhancedMovie {
  isLoading?: boolean;
}

/**
 * Custom hook to fetch and cache TMDB posters for movies
 */
export function useMoviePosters(movies: Omit<EnhancedMovie, 'poster' | 'backdrop'>[]) {
  const [moviesWithPosters, setMoviesWithPosters] = useState<MovieWithPoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosters = async () => {
      setIsLoading(true);
      const results: MovieWithPoster[] = [];

      // Process in batches to avoid overwhelming the API
      const batchSize = 10;
      for (let i = 0; i < movies.length; i += batchSize) {
        if (!isMounted) break;

        const batch = movies.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (movie) => {
            try {
              const { poster, backdrop, tmdbId } = await fetchMoviePoster(
                movie.title,
                movie.year
              );

              return {
                ...movie,
                id: movie.id || generateMovieId(movie.title, movie.year),
                poster: poster || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
                backdrop: backdrop || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`,
                tmdbId,
                isLoading: false
              };
            } catch (error) {
              console.error(`Error fetching poster for ${movie.title}:`, error);
              return {
                ...movie,
                id: movie.id || generateMovieId(movie.title, movie.year),
                poster: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
                backdrop: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`,
                isLoading: false
              };
            }
          })
        );

        results.push(...batchResults);
        
        // Update state progressively for better UX
        if (isMounted) {
          setMoviesWithPosters([...results]);
        }

        // Rate limiting: wait 250ms between batches
        if (i + batchSize < movies.length) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchPosters().catch(err => {
      if (isMounted) {
        setError(err.message);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount since movies list is constant

  return { moviesWithPosters, isLoading, error };
}

/**
 * Fetch single movie poster (for real-time search)
 */
export async function fetchSingleMoviePoster(
  title: string,
  year: string,
  genre: string
): Promise<MovieWithPoster> {
  try {
    const { poster, backdrop, tmdbId } = await fetchMoviePoster(title, year);

    return {
      id: generateMovieId(title, year),
      title,
      year,
      rating: 0,
      genre,
      leadActor: '',
      director: '',
      poster: poster || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
      backdrop: backdrop || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`,
      tmdbId,
      isLoading: false
    };
  } catch (error) {
    return {
      id: generateMovieId(title, year),
      title,
      year,
      rating: 0,
      genre,
      leadActor: '',
      director: '',
      poster: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
      backdrop: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`,
      isLoading: false
    };
  }
}