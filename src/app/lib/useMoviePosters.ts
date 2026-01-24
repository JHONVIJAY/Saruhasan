import { useState, useEffect } from 'react';
import { fetchMoviePoster, getCachedMoviePoster, EnhancedMovie, generateMovieId } from './movies-enhanced';

export interface MovieWithPoster extends EnhancedMovie {
  isLoading?: boolean;
}

/**
 * Custom hook to fetch and cache TMDB posters for movies
 */
export function useMoviePosters(movies: Omit<EnhancedMovie, 'poster' | 'backdrop'>[]) {
  // Initialize with cached data if available, otherwise placeholders
  const [moviesWithPosters, setMoviesWithPosters] = useState<MovieWithPoster[]>(() => 
    movies.map(m => {
      const cached = getCachedMoviePoster(m.title, m.year);
      if (cached) {
        return {
          ...m,
          id: m.id || generateMovieId(m.title, m.year),
          poster: cached.poster || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
          backdrop: cached.backdrop || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`,
          tmdbId: cached.tmdbId,
          isLoading: false
        };
      }
      return {
        ...m,
        id: m.id || generateMovieId(m.title, m.year),
        poster: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
        backdrop: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`,
        isLoading: true
      };
    })
  );
  
  const [isLoading, setIsLoading] = useState(() => moviesWithPosters.some(m => m.isLoading));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosters = async () => {
      // Create a local mutable copy of the current state
      const currentMovies = [...moviesWithPosters];
      let hasUpdates = false;

      // Process in batches to avoid overwhelming the API
      const batchSize = 5; // Reduced batch size for better reliability
      for (let i = 0; i < movies.length; i += batchSize) {
        if (!isMounted) break;

        const batch = movies.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(
          batch.map(async (movie, index) => {
            const globalIndex = i + index;
            // Skip if already loaded (from cache)
            if (!currentMovies[globalIndex].isLoading) {
              return currentMovies[globalIndex];
            }

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

        // Update the local copy with new results
        batchResults.forEach((result, index) => {
          const globalIndex = i + index;
          if (globalIndex < currentMovies.length && result.status === 'fulfilled') {
            const movieResult = result.value;
            // Only mark as update if something actually changed (loading -> loaded)
            if (currentMovies[globalIndex].isLoading !== movieResult.isLoading) {
              currentMovies[globalIndex] = movieResult;
              hasUpdates = true;
            }
          }
        });
        
        // Update state progressively only if we had updates
        if (isMounted && hasUpdates) {
          setMoviesWithPosters([...currentMovies]);
          hasUpdates = false; // Reset for next batch
        }

        // Shorter delay between batches - only 100ms
        if (i + batchSize < movies.length) {
           await new Promise(resolve => setTimeout(resolve, 100));
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