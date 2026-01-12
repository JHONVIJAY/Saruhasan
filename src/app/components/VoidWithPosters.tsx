// Enhanced Void component that fetches TMDB posters dynamically
import { useState, useEffect } from 'react';
import { Void } from './Void';
import { PREMIUM_SLIDESHOW_MOVIES } from '../lib/movies';
import { searchMovie, getPosterUrl, getBackdropUrl } from '../lib/tmdb';

interface MovieWithPoster {
  id: string;
  title: string;
  year: string;
  rating: number;
  genre: string;
  leadActor: string;
  director: string;
  poster: string;
  backdrop: string;
}

/**
 * Component wrapper that fetches TMDB posters for all movies
 * This runs once on mount and caches results
 */
export function VoidWithPosters() {
  const [moviesWithPosters, setMoviesWithPosters] = useState<MovieWithPoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchProgress, setFetchProgress] = useState(0);

  useEffect(() => {
    const fetchAllPosters = async () => {
      const results: MovieWithPoster[] = [];
      const total = PREMIUM_SLIDESHOW_MOVIES.length;

      for (let i = 0; i < PREMIUM_SLIDESHOW_MOVIES.length; i++) {
        const movie = PREMIUM_SLIDESHOW_MOVIES[i];
        
        try {
          // Fetch TMDB data
          const tmdbMovie = await searchMovie(movie.title, movie.year);
          
          const posterUrl = tmdbMovie?.poster_path 
            ? getPosterUrl(tmdbMovie.poster_path, 'w500') 
            : `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`;
            
          const backdropUrl = tmdbMovie?.backdrop_path
            ? getBackdropUrl(tmdbMovie.backdrop_path, 'w1280')
            : `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`;

          results.push({
            ...movie,
            poster: posterUrl || movie.poster || '',
            backdrop: backdropUrl || movie.backdrop || ''
          });

          // Update progress
          setFetchProgress(Math.round(((i + 1) / total) * 100));
        } catch (error) {
          console.error(`Error fetching poster for ${movie.title}:`, error);
          
          // Use fallback
          results.push({
            ...movie,
            poster: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
            backdrop: `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`
          });
        }

        // Rate limiting: wait 250ms between requests
        if (i < PREMIUM_SLIDESHOW_MOVIES.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }

      setMoviesWithPosters(results);
      setIsLoading(false);
    };

    fetchAllPosters();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className=\"fixed inset-0 bg-black flex items-center justify-center z-50\">\n        <div className=\"text-center\">\n          <div className=\"inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10\">\n            <div className=\"w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin\" />\n            <div>\n              <p className=\"text-white font-medium text-lg\">Loading Cinema Collection</p>\n              <p className=\"text-white/50 text-sm mt-1\">Fetching movie posters... {fetchProgress}%</p>\n            </div>\n          </div>\n        </div>\n      </div>
    );
  }

  // Render Void component with loaded posters
  return <Void />;
}
