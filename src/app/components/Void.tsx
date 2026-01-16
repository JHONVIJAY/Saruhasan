import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { PREMIUM_SLIDESHOW_MOVIES, TOTAL_FILMS_WATCHED, Movie } from "../lib/movies";
import { Film, Sparkles, Play, Shuffle, RefreshCw } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { useMoviePosters, MovieWithPoster } from '../lib/useMoviePosters';
import { discoverRandomMovies, getPosterUrl, getBackdropUrl, getGenreName, getMovieCredits, findDirector, TMDBMovie } from '../lib/tmdb';
import { getRatingDisplay, generateMovieId } from '../lib/movies-enhanced';
import { recommendationEngine, RecommendationOptions } from '../lib/recommendation-engine';
import { YouTubeDownloader } from './YouTubeDownloader';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// Movie poster card component
function MoviePoster({ movie, index, disableHoverEffect = false }: { movie: Movie; index: number; disableHoverEffect?: boolean }) {
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer ' + movie.year)}`, '_blank');
  };

  return (
    <div
      className="w-full h-full group/card"
    >
      {/* Main Card Container with CSS-only Animations for Performance */}
      <div
        onClick={handleClick}
        className={`
          relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-neutral-900
          transition-all duration-500 ease-out transform-gpu
          ${!disableHoverEffect ? 'hover:-translate-y-2 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15),0_0_32px_rgba(14,165,233,0.2)]' : ''}
          shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)]
        `}
      >
        {/* Border Gradient Overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.3) 0%, transparent 50%, rgba(59,130,246,0.3) 100%)',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />

        {/* Poster Image */}
        <div className="absolute inset-0 bg-neutral-950">
          {!hasError ? (
            <img
              src={movie.poster || ''}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex flex-col items-center justify-center gap-4">
              <Film className="w-16 h-16 text-white/10" />
              <span className="text-xs text-white/20 font-medium">{movie.title}</span>
            </div>
          )}

          {/* Image Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Mobile - Minimalist Gradient Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="relative z-10">
            <h4 className="text-white font-bold text-sm mb-1 leading-snug drop-shadow-md">
              {movie.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium drop-shadow-sm">
              <span>{movie.year}</span>
              <span className="text-sky-400">•</span>
              <span className="truncate">{movie.director}</span>
            </div>
          </div>
        </div>

        {/* Desktop - Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent hidden md:block opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        />

        {/* Desktop - Premium Content on Hover */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-end hidden md:flex opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500 ease-out delay-75"
        >
          {/* Play Button with Glow */}
          <div className="mb-4 transform translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-100">
            <div 
              className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer group/play shadow-lg shadow-white/10 hover:shadow-white/20 transition-all hover:scale-110 active:scale-95"
            >
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            </div>
          </div>

          {/* Title with Better Typography */}
          <h4 className="text-xl font-bold text-white mb-2 leading-tight line-clamp-2 tracking-tight transform translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-150">
            {movie.title}
          </h4>

          {/* Meta Info with Better Design */}
          <div className="flex items-center gap-2.5 mb-3 transform translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-200">
            <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-xs font-medium text-white">
              {movie.year}
            </span>
            <span className="w-1 h-1 rounded-full bg-sky-500/70" />
            <span className="text-xs text-white/70 font-light line-clamp-1">
              {movie.director}
            </span>
          </div>

          {/* Rating Display */}
          {movie.rating && (
            <div className="flex items-center gap-2 mb-2 transform translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-250">
              <span className="text-lg">
                {getRatingDisplay(movie.rating)}
              </span>
              <span className="text-xs text-white/50">
                {movie.rating}/5
              </span>
            </div>
          )}

          {/* Genre */}
          {movie.genre && (
            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed font-light transform translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-300">
              {movie.genre}
            </p>
          )}

          {/* Subtle Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent -z-10" />
        </div>

        {/* Desktop - Subtle Default State Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none hidden md:block group-hover/card:opacity-0 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}

// Movie Suggester Card Component
function MovieSuggesterCard({ movies }: { movies: Movie[] }) {
  const [activeTab, setActiveTab] = useState<'watched' | 'random'>('watched');
  const [suggestedMovie, setSuggestedMovie] = useState<Movie | null>(null);
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [randomMovies, setRandomMovies] = useState<TMDBMovie[]>([]);
  const [loadingRandom, setLoadingRandom] = useState(false);

  // Function to fetch fresh random high-rated movies from TMDB
  const fetchNewRandomMovies = async () => {
    setLoadingRandom(true);
    try {
      // Fetch batch of random movies
      const tmdbMovies = await discoverRandomMovies(20);
      setRandomMovies(prev => [...prev, ...tmdbMovies]);
    } catch (error) {
      console.error('Error fetching random movies:', error);
    } finally {
      setLoadingRandom(false);
    }
  };

  // Fetch random movies when switching to random tab if empty
  useEffect(() => {
    if (activeTab === 'random' && randomMovies.length === 0) {
      fetchNewRandomMovies();
    }
  }, [activeTab]);

  const suggestMovie = async () => {
    if (activeTab === 'random') {
      let pool = [...randomMovies];
      
      // If pool is running low, fetch more in background/foreground
      if (pool.length < 3) {
        if (pool.length === 0) setLoadingRandom(true);
        try {
            const newMovies = await discoverRandomMovies(20);
            pool = [...pool, ...newMovies];
            // If we were empty, we need to update state now to pick from it
            if (randomMovies.length === 0) {
                setRandomMovies(pool);
            } else {
                // Otherwise just append to state
                setRandomMovies(prev => [...prev, ...newMovies]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingRandom(false);
        }
      }

      // If we still have movies in pool (which we should unless API failed)
      if (pool.length > 0) {
        // Pick one randomly
        const randomIndex = Math.floor(Math.random() * pool.length);
        const tmdbMovie = pool[randomIndex];
        
        // Remove from pool
        const newPool = [...pool];
        newPool.splice(randomIndex, 1);
        setRandomMovies(newPool);

        // Fetch details for THIS specific movie
        try {
             const year = tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear().toString() : 'Unknown';
             const genre = getGenreName(tmdbMovie.genre_ids);
             
             let director = 'Unknown';
             try {
               const credits = await getMovieCredits(tmdbMovie.id);
               director = findDirector(credits);
             } catch (error) {
               console.error(`Error fetching director for ${tmdbMovie.title}:`, error);
             }
             
             const movie: Movie = {
               id: generateMovieId(tmdbMovie.title, year),
               title: tmdbMovie.title,
               year,
               rating: Math.round(tmdbMovie.vote_average / 2), 
               genre,
               leadActor: '',
               director,
               poster: getPosterUrl(tmdbMovie.poster_path) || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop`,
               backdrop: getBackdropUrl(tmdbMovie.backdrop_path) || `https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1280&h=720&fit=crop`,
               plot: tmdbMovie.overview,
             };
             
             setSuggestedMovie(movie);
             setRecommendationReason('Randomly selected from TMDB\'s highest-rated films');
        } catch (error) {
             console.error('Error processing movie details:', error);
        }
      }
    } else {
      // Use advanced recommendation engine for watched movies
      if (movies.length === 0) return;

      const options: RecommendationOptions = {
        strategy: 'high_rated',
        avoidRecent: true,
        diversify: true
      };

      const { movie, reason, strategy } = recommendationEngine.recommendWithReason(movies, options);
      
      if (movie) {
        setSuggestedMovie(movie);
        setRecommendationReason(reason);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 md:px-12 mt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Card Container */}
        <div className="relative p-8 md:p-12 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-sky-500/30 transition-all duration-500">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.08),transparent_60%)] md:bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.12),transparent_50%),linear-gradient(135deg,rgba(14,165,233,0.08),transparent_40%,rgba(59,130,246,0.08))] opacity-20 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700 ease-out backdrop-blur-[1px] md:backdrop-blur-[2px]" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                <Shuffle className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Movie Suggester</h3>
                <p className="text-sm text-white/50 mt-1">Discover your next favorite film</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8 p-2 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
              <button
                onClick={() => setActiveTab('watched')}
                className={`relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'watched'
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                {activeTab === 'watched' && (
                  <motion.div
                    layoutId="suggesterActiveTab"
                    className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-xl border border-sky-500/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Films I Watched
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('random')}
                className={`relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'random'
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                {activeTab === 'random' && (
                  <motion.div
                    layoutId="suggesterActiveTab"
                    className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-xl border border-sky-500/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Random Films
                </span>
              </button>
            </div>

            {/* Suggested Movie Display */}
            {suggestedMovie ? (
              <motion.div
                key={suggestedMovie.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                {/* Poster */}
                <div className="w-full md:w-48 h-72 md:h-72 rounded-xl overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={suggestedMovie.poster || ''}
                    alt={suggestedMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between gap-4 md:gap-0">
                  <div>
                    <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">
                      {suggestedMovie.title}
                    </h4>
                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-white/60 mb-3 md:mb-4">
                      <span>{suggestedMovie.year}</span>
                      <span>•</span>
                      <span className="line-clamp-1">{suggestedMovie.director}</span>
                    </div>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed line-clamp-4 md:line-clamp-none">
                      {suggestedMovie.plot}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-4 mt-4 md:mt-0">
                    <button
                      onClick={suggestMovie}
                      className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-sm md:text-base font-medium transition-all duration-300 w-full sm:w-fit group/btn"
                    >
                      <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                      Suggest Another
                    </button>
                    <button
                      onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(suggestedMovie.title + ' trailer ' + suggestedMovie.year)}`, '_blank')}
                      className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm md:text-base font-medium transition-all duration-300 w-full sm:w-fit group/btn"
                    >
                      <Play className="w-4 h-4 fill-white/50 group-hover/btn:fill-white transition-colors" />
                      Watch Trailer
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/50 mb-6">
                  Click the button below to get a random movie suggestion!
                </p>
                <button
                  onClick={suggestMovie}
                  disabled={loadingRandom}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500/20 to-blue-500/20 hover:from-sky-500/30 hover:to-blue-500/30 border border-sky-500/30 text-white font-medium transition-all duration-300 group/btn disabled:opacity-50"
                >
                   {loadingRandom ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                   ) : (
                      <Shuffle className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                   )}
                  {loadingRandom ? 'Loading...' : 'Get Suggestion'}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Void() {
  const [mounted, setMounted] = useState(false);
  // Optimization: Track mobile state to reduce DOM nodes
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  // Memoize the movies array to prevent infinite re-renders
  const moviesToFetch = useMemo(() => 
    PREMIUM_SLIDESHOW_MOVIES.map(m => ({
      id: m.id,
      title: m.title,
      year: m.year,
      rating: m.rating,
      genre: m.genre,
      leadActor: m.leadActor,
      director: m.director,
    }))
  , []); // Empty dependency array since PREMIUM_SLIDESHOW_MOVIES is constant

  // Fetch TMDB posters for all movies
  const { moviesWithPosters, isLoading: postersLoading } = useMoviePosters(moviesToFetch);

  // Show movies progressively as they load
  const displayMovies = moviesWithPosters;
  const hasEnoughSlides = displayMovies.length >= 6; // Need at least 6 slides for loop mode

  return (
    <section id="void" className="relative min-h-screen py-32 md:py-40 overflow-hidden bg-black">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
        
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-gradient-to-b from-sky-500/5 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-6 md:px-12 mb-20 md:mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* Left: Title */}
              <div className="relative">
                {/* Background Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="absolute -left-8 -top-8 lg:-left-16 lg:-top-16"
                >
                  <h2 className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black leading-none tracking-tighter text-white/[0.02] select-none pointer-events-none">
                    VOID
                  </h2>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  {/* Section Number */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-[1px] bg-gradient-to-r from-sky-500 to-transparent" />
                      <span className="font-mono text-sky-400 text-sm tracking-[0.3em] uppercase">
                        04
                      </span>
                    </div>
                    <span className="font-mono text-white/30 text-xs uppercase tracking-widest">
                      Interests
                    </span>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-[0.95] tracking-tight">
                    <span className="text-white">The</span>{" "}
                    <span className="bg-gradient-to-r from-white/40 to-white/10 bg-clip-text text-transparent">
                      Void
                    </span>
                  </h2>
                  
                  <div className="space-y-6 max-w-lg">
                    <p className="text-white/70 text-lg md:text-xl leading-relaxed font-light">
                      Beyond the code and commits lies a space for the things I love.
                    </p>
                    <p className="text-white/50 text-base leading-relaxed">
                      A personal collection of films that moved me, stories that resonated, 
                      and cinematic experiences I keep coming back to.
                    </p>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="mt-12 flex items-center gap-4">
                    <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
                    <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-sky-500/50 via-sky-500/20 to-transparent" />
                  </div>
                </motion.div>
              </div>
              
              {/* Right: Stats/Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 gap-6 lg:gap-8"
              >
                <div className="relative p-6 lg:p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5 overflow-hidden group hover:border-sky-500/30 transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <Film className="w-8 h-8 text-sky-400 mb-4" />
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{TOTAL_FILMS_WATCHED}</div>
                    <div className="text-white/50 text-sm uppercase tracking-wider font-mono">Films</div>
                  </div>
                </div>
                
                <div className="relative p-6 lg:p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5 overflow-hidden group hover:border-sky-500/30 transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-sky-400 mb-4" />
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">∞</div>
                    <div className="text-white/50 text-sm uppercase tracking-wider font-mono">Inspiration</div>
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </div>

        {/* Cinema Poster Gallery */}
        <div className="relative">
          {/* Section Header */}
          <div className="container mx-auto px-6 md:px-12 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    films that i loved
                  </h3>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent hidden md:block" />
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
                  <Play className="w-3 h-3 text-sky-400" />
                  <span className="font-mono text-xs text-sky-400/70 uppercase tracking-[0.25em]">
                    Cinema
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Poster Slideshow - Full Width with Premium Container */}
          <div className="relative w-full">
            {/* Ambient Glow Behind Slideshow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-transparent blur-3xl" />
            

            
            {/* Slideshow Container */}
            <div className="md:px-12 py-4 min-h-[400px]">
              {!mounted ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                   <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Mobile Poster Slider (Standard Slide for Performance) */}
                  {isMobile && (
                <div className="md:hidden w-full">
                  <Swiper
                    key={`mobile-swiper-${postersLoading ? 'loading' : 'loaded'}`}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    spaceBetween={16}
                    loop={hasEnoughSlides}
                    speed={400}
                    freeMode={{
                      enabled: true,
                      momentum: true,
                      momentumRatio: 0.5,
                      momentumVelocityRatio: 0.5,
                      sticky: false,
                    }}
                    resistance={true}
                    resistanceRatio={0.85}
                    threshold={5}
                    touchRatio={1.2}
                    touchAngle={45}
                    longSwipesRatio={0.3}
                    slideToClickedSlide={true}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: true,
                      pauseOnMouseEnter: true,
                    }}
                    modules={[Autoplay, FreeMode]}
                    className="w-full !pb-8 mobile-poster-swiper"
                  >
                    {displayMovies.map((movie, index) => (
                      <SwiperSlide key={`mobile-${movie.id}-${index}`} style={{ width: '260px' }}>
                        <div className="px-2 transition-transform duration-300 ease-out">
                          <MoviePoster movie={movie} index={index} disableHoverEffect={true} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {/* Desktop Slider */}
              {!isMobile && (
                <div className="hidden md:block">
                  <Swiper
                    key={`desktop-swiper-${postersLoading ? 'loading' : 'loaded'}`}
                    spaceBetween={24}
                    slidesPerView={4}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    breakpoints={{
                      768: { slidesPerView: 3, spaceBetween: 20 },
                      1024: { slidesPerView: 4, spaceBetween: 24 },
                      1280: { slidesPerView: 5, spaceBetween: 30 },
                      1536: { slidesPerView: 6, spaceBetween: 32 },
                    }}
                    loop={hasEnoughSlides}
                    speed={600}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    touchRatio={1.5}
                    touchAngle={45}
                    grabCursor={true}
                    resistance={true}
                    resistanceRatio={0.85}
                    threshold={10}
                    modules={[Autoplay, Pagination]}
                    className="!pb-16 !px-4 desktop-poster-swiper"
                  >
                    {displayMovies.map((movie, index) => (
                      <SwiperSlide key={`desktop-${movie.id}-${index}`}>
                        <MoviePoster movie={movie} index={index} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
                </>
              )}
            </div>
            
            {/* Bottom Reflection Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
          </div>
        </div>
        
        {/* Movie Suggester Card */}
        <MovieSuggesterCard movies={displayMovies} />

        {/* YouTube Downloader */}
        <YouTubeDownloader />
        
        {/* Bottom Decoration */}
        <div className="container mx-auto px-6 md:px-12 mt-24">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent mb-6" />
            <div className="text-center">
              <p className="text-white/30 text-xs font-mono uppercase tracking-[0.3em]">
                {TOTAL_FILMS_WATCHED} Stories, Infinite Impact
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}