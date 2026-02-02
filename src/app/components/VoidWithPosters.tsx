// Enhanced Void component that fetches TMDB posters dynamically
import { useState, useEffect } from 'react';
import { Void } from './Void';
import { PREMIUM_SLIDESHOW_MOVIES } from '../lib/movies';
import { searchMovie } from '../lib/tmdb';


/**
 * Component wrapper that fetches TMDB posters for all movies
 * This runs once on mount and caches results
 */
export function VoidWithPosters() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchProgress, setFetchProgress] = useState(0);

  useEffect(() => {
    const fetchAllPosters = async () => {
      const total = PREMIUM_SLIDESHOW_MOVIES.length;

      for (let i = 0; i < PREMIUM_SLIDESHOW_MOVIES.length; i++) {
        const movie = PREMIUM_SLIDESHOW_MOVIES[i];
        
        try {
          // Fetch TMDB data (pre-warm cache)
          await searchMovie(movie.title, movie.year);

          // Update progress
          setFetchProgress(Math.round(((i + 1) / total) * 100));
        } catch (error) {
          console.error(`Error fetching poster for ${movie.title}:`, error);
        }

        // Rate limiting: wait 250ms between requests
        if (i < PREMIUM_SLIDESHOW_MOVIES.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }

      setIsLoading(false);
    };

    fetchAllPosters();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-white font-medium text-lg">Loading Cinema Collection</p>
              <p className="text-white/50 text-sm mt-1">Fetching movie posters... {fetchProgress}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Void component with loaded posters
  return <Void />;
}
