// Advanced Movie Recommendation Engine
// Uses multiple algorithms: content-based filtering, collaborative filtering simulation,
// mood-based recommendations, and intelligent randomization

import { Movie } from './movies';

export interface UserPreferences {
  favoriteGenres: Record<string, number>; // genre -> weight (0-1)
  favoriteDirectors: Record<string, number>; // director -> weight (0-1)
  preferredRatings: number[]; // preferred rating levels
  recentlyWatched: string[]; // movie IDs
  recentlySuggested: string[]; // movie IDs to avoid immediate repeats
  moodPreferences: Record<string, number>; // mood -> weight
  decadePreferences: Record<string, number>; // decade -> weight
  viewHistory: Array<{
    movieId: string;
    timestamp: number;
    liked?: boolean;
  }>;
}

export type RecommendationStrategy = 
  | 'smart_random' 
  | 'mood_based' 
  | 'genre_focused' 
  | 'director_focused' 
  | 'high_rated' 
  | 'hidden_gems'
  | 'time_period'
  | 'similar_to_liked';

export interface RecommendationOptions {
  strategy?: RecommendationStrategy;
  mood?: string;
  genreFilter?: string;
  minRating?: number;
  maxRating?: number;
  decade?: string;
  avoidRecent?: boolean;
  diversify?: boolean;
}

// Mood to genre mapping
const MOOD_GENRE_MAP: Record<string, string[]> = {
  happy: ['Comedy', 'Romance', 'Animation', 'Family', 'Musical'],
  sad: ['Drama', 'Romance', 'Biography'],
  exciting: ['Action', 'Adventure', 'Thriller', 'Sci-Fi'],
  thoughtful: ['Drama', 'Mystery', 'Biography', 'History', 'Documentary'],
  scared: ['Horror', 'Thriller', 'Mystery'],
  romantic: ['Romance', 'Drama', 'Comedy'],
  adventurous: ['Adventure', 'Action', 'Fantasy', 'Sci-Fi'],
  nostalgic: ['Drama', 'Biography', 'History', 'Classic'],
  relaxed: ['Comedy', 'Animation', 'Family', 'Romance'],
  intense: ['Thriller', 'Crime', 'War', 'Horror', 'Action']
};

// Genre similarity matrix for content-based filtering
const GENRE_SIMILARITY: Record<string, Record<string, number>> = {
  'Action': { 'Adventure': 0.8, 'Thriller': 0.7, 'Sci-Fi': 0.6, 'Crime': 0.5 },
  'Adventure': { 'Action': 0.8, 'Fantasy': 0.7, 'Sci-Fi': 0.6 },
  'Comedy': { 'Romance': 0.6, 'Family': 0.5, 'Animation': 0.4 },
  'Drama': { 'Romance': 0.6, 'Biography': 0.7, 'History': 0.6, 'Crime': 0.5 },
  'Thriller': { 'Action': 0.7, 'Horror': 0.6, 'Mystery': 0.8, 'Crime': 0.7 },
  'Horror': { 'Thriller': 0.6, 'Mystery': 0.5 },
  'Romance': { 'Drama': 0.6, 'Comedy': 0.6 },
  'Sci-Fi': { 'Action': 0.6, 'Adventure': 0.6, 'Thriller': 0.5, 'Fantasy': 0.7 },
  'Fantasy': { 'Adventure': 0.7, 'Sci-Fi': 0.7, 'Animation': 0.5 },
  'Crime': { 'Thriller': 0.7, 'Drama': 0.5, 'Action': 0.5, 'Mystery': 0.6 },
  'Mystery': { 'Thriller': 0.8, 'Crime': 0.6, 'Horror': 0.5 },
  'Biography': { 'Drama': 0.7, 'History': 0.6 },
  'History': { 'Biography': 0.6, 'Drama': 0.6, 'War': 0.5 },
  'War': { 'History': 0.5, 'Drama': 0.5, 'Action': 0.4 },
  'Animation': { 'Family': 0.7, 'Comedy': 0.4, 'Fantasy': 0.5 },
  'Family': { 'Animation': 0.7, 'Comedy': 0.5 },
  'Musical': { 'Drama': 0.4, 'Romance': 0.4, 'Comedy': 0.3 },
  'Documentary': { 'Biography': 0.5, 'History': 0.5 }
};

export class RecommendationEngine {
  private preferences: UserPreferences;
  private readonly STORAGE_KEY = 'movie_preferences';
  private readonly MAX_RECENT_HISTORY = 50;
  private readonly RECENT_SUGGESTION_WINDOW = 10;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  /**
   * Load user preferences from localStorage
   */
  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }

    return {
      favoriteGenres: {},
      favoriteDirectors: {},
      preferredRatings: [],
      recentlyWatched: [],
      recentlySuggested: [],
      moodPreferences: {},
      decadePreferences: {},
      viewHistory: []
    };
  }

  /**
   * Save user preferences to localStorage
   */
  private savePreferences(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  /**
   * Update preferences based on user interactions
   */
  updatePreferences(movie: Movie, liked: boolean = true): void {
    // Update genre preferences
    const genres = movie.genre.split(',').map(g => g.trim());
    genres.forEach(genre => {
      const current = this.preferences.favoriteGenres[genre] || 0;
      this.preferences.favoriteGenres[genre] = Math.min(1, current + (liked ? 0.1 : -0.05));
    });

    // Update director preferences
    if (movie.director) {
      const current = this.preferences.favoriteDirectors[movie.director] || 0;
      this.preferences.favoriteDirectors[movie.director] = Math.min(1, current + (liked ? 0.15 : -0.05));
    }

    // Update rating preferences
    if (liked && movie.rating) {
      this.preferences.preferredRatings.push(movie.rating);
      if (this.preferences.preferredRatings.length > 20) {
        this.preferences.preferredRatings.shift();
      }
    }

    // Update decade preferences
    const decade = this.getDecade(movie.year);
    const currentDecade = this.preferences.decadePreferences[decade] || 0;
    this.preferences.decadePreferences[decade] = Math.min(1, currentDecade + (liked ? 0.1 : -0.05));

    // Update view history
    this.preferences.viewHistory.push({
      movieId: movie.id,
      timestamp: Date.now(),
      liked
    });

    // Keep only recent history
    if (this.preferences.viewHistory.length > this.MAX_RECENT_HISTORY) {
      this.preferences.viewHistory = this.preferences.viewHistory.slice(-this.MAX_RECENT_HISTORY);
    }

    this.savePreferences();
  }

  /**
   * Mark a movie as suggested to avoid immediate repeats
   */
  markAsSuggested(movieId: string): void {
    this.preferences.recentlySuggested.unshift(movieId);
    if (this.preferences.recentlySuggested.length > this.RECENT_SUGGESTION_WINDOW) {
      this.preferences.recentlySuggested.pop();
    }
    this.savePreferences();
  }

  /**
   * Get decade from year
   */
  private getDecade(year: string): string {
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return 'Unknown';
    return `${Math.floor(yearNum / 10) * 10}s`;
  }

  /**
   * Calculate content-based similarity score between two movies
   */
  private calculateSimilarity(movie1: Movie, movie2: Movie): number {
    let score = 0;
    let weights = 0;

    // Genre similarity
    const genres1 = movie1.genre.split(',').map(g => g.trim());
    const genres2 = movie2.genre.split(',').map(g => g.trim());
    
    genres1.forEach(g1 => {
      genres2.forEach(g2 => {
        if (g1 === g2) {
          score += 1.0;
          weights += 1;
        } else if (GENRE_SIMILARITY[g1]?.[g2]) {
          score += GENRE_SIMILARITY[g1][g2];
          weights += 1;
        }
      });
    });

    // Director match
    if (movie1.director === movie2.director && movie1.director !== 'Unknown') {
      score += 0.8;
      weights += 1;
    }

    // Rating similarity (closer ratings = higher similarity)
    if (movie1.rating && movie2.rating) {
      const ratingDiff = Math.abs(movie1.rating - movie2.rating);
      score += (5 - ratingDiff) / 5;
      weights += 1;
    }

    // Decade similarity
    const decade1 = this.getDecade(movie1.year);
    const decade2 = this.getDecade(movie2.year);
    if (decade1 === decade2) {
      score += 0.3;
      weights += 1;
    }

    return weights > 0 ? score / weights : 0;
  }

  /**
   * Calculate movie score based on user preferences
   */
  private calculatePreferenceScore(movie: Movie): number {
    let score = 0;
    let weights = 0;

    // Genre preference score
    const genres = movie.genre.split(',').map(g => g.trim());
    genres.forEach(genre => {
      if (this.preferences.favoriteGenres[genre]) {
        score += this.preferences.favoriteGenres[genre];
        weights += 1;
      }
    });

    // Director preference score
    if (movie.director && this.preferences.favoriteDirectors[movie.director]) {
      score += this.preferences.favoriteDirectors[movie.director] * 1.5; // Higher weight
      weights += 1.5;
    }

    // Rating preference score
    if (movie.rating && this.preferences.preferredRatings.length > 0) {
      const avgPreferredRating = this.preferences.preferredRatings.reduce((a, b) => a + b, 0) / 
                                  this.preferences.preferredRatings.length;
      const ratingDiff = Math.abs(movie.rating - avgPreferredRating);
      score += (5 - ratingDiff) / 5;
      weights += 1;
    }

    // Decade preference score
    const decade = this.getDecade(movie.year);
    if (this.preferences.decadePreferences[decade]) {
      score += this.preferences.decadePreferences[decade];
      weights += 1;
    }

    return weights > 0 ? score / weights : 0.5; // Default to neutral
  }

  /**
   * Smart Random: Weighted randomization based on preferences
   */
  private smartRandom(movies: Movie[], options: RecommendationOptions): Movie | null {
    const candidates = movies.filter(m => 
      (!options.avoidRecent || !this.preferences.recentlySuggested.includes(m.id)) &&
      (!options.minRating || m.rating >= options.minRating) &&
      (!options.maxRating || m.rating <= options.maxRating) &&
      (!options.genreFilter || m.genre.includes(options.genreFilter)) &&
      (!options.decade || this.getDecade(m.year) === options.decade)
    );

    if (candidates.length === 0) return null;

    // Calculate weighted scores
    const scored = candidates.map(movie => ({
      movie,
      score: this.calculatePreferenceScore(movie) * (Math.random() * 0.3 + 0.85) // Add randomness
    }));

    // Sort by score and pick from top 20%
    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, Math.max(1, Math.floor(scored.length * 0.2)));
    
    return topCandidates[Math.floor(Math.random() * topCandidates.length)].movie;
  }

  /**
   * Mood-Based: Recommend based on current mood
   */
  private moodBased(movies: Movie[], mood: string): Movie | null {
    const relevantGenres = MOOD_GENRE_MAP[mood.toLowerCase()] || [];
    if (relevantGenres.length === 0) return this.smartRandom(movies, {});

    const candidates = movies.filter(movie => {
      const movieGenres = movie.genre.split(',').map(g => g.trim());
      return relevantGenres.some(mg => movieGenres.some(g => g.includes(mg) || mg.includes(g)));
    });

    if (candidates.length === 0) return null;

    // Weighted selection based on genre match strength
    const scored = candidates.map(movie => {
      const movieGenres = movie.genre.split(',').map(g => g.trim());
      const matchScore = relevantGenres.reduce((score, mg) => {
        const matches = movieGenres.filter(g => g.includes(mg) || mg.includes(g)).length;
        return score + matches;
      }, 0);
      
      return {
        movie,
        score: matchScore * (movie.rating || 3) * (Math.random() * 0.4 + 0.8)
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const topPick = scored.slice(0, Math.max(1, Math.floor(scored.length * 0.15)));
    
    return topPick[Math.floor(Math.random() * topPick.length)].movie;
  }

  /**
   * Genre-Focused: Deep dive into a specific genre
   */
  private genreFocused(movies: Movie[], genre: string): Movie | null {
    const candidates = movies.filter(m => 
      m.genre.toLowerCase().includes(genre.toLowerCase()) &&
      !this.preferences.recentlySuggested.includes(m.id)
    );

    if (candidates.length === 0) return null;

    // Prefer higher rated within the genre
    const scored = candidates.map(movie => ({
      movie,
      score: (movie.rating || 3) * (Math.random() * 0.5 + 0.75)
    }));

    scored.sort((a, b) => b.score - a.score);
    const topPick = scored.slice(0, Math.max(1, Math.floor(scored.length * 0.2)));
    
    return topPick[Math.floor(Math.random() * topPick.length)].movie;
  }

  /**
   * Director-Focused: Explore a director's filmography
   */
  private directorFocused(movies: Movie[]): Movie | null {
    // Find directors with multiple films
    const directorCounts: Record<string, number> = {};
    movies.forEach(m => {
      if (m.director && m.director !== 'Unknown') {
        directorCounts[m.director] = (directorCounts[m.director] || 0) + 1;
      }
    });

    // Weight by preference and film count
    const directors = Object.entries(directorCounts)
      .filter(([_, count]) => count >= 2)
      .map(([director, count]) => ({
        director,
        score: count * (this.preferences.favoriteDirectors[director] || 0.5) * Math.random()
      }))
      .sort((a, b) => b.score - a.score);

    if (directors.length === 0) return this.smartRandom(movies, {});

    const selectedDirector = directors[0].director;
    const directorMovies = movies.filter(m => 
      m.director === selectedDirector &&
      !this.preferences.recentlySuggested.includes(m.id)
    );

    return directorMovies[Math.floor(Math.random() * directorMovies.length)] || null;
  }

  /**
   * High-Rated: Focus on critically acclaimed films
   */
  private highRated(movies: Movie[]): Movie | null {
    const candidates = movies.filter(m => 
      m.rating >= 4 &&
      !this.preferences.recentlySuggested.includes(m.id)
    );

    if (candidates.length === 0) {
      return this.smartRandom(movies, { minRating: 4 });
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /**
   * Hidden Gems: Lower-rated but potentially interesting films
   */
  private hiddenGems(movies: Movie[]): Movie | null {
    const candidates = movies.filter(m => 
      m.rating >= 3 && m.rating < 4.5 &&
      !this.preferences.recentlySuggested.includes(m.id)
    );

    // Prefer those matching user preferences
    const scored = candidates.map(movie => ({
      movie,
      score: this.calculatePreferenceScore(movie) * Math.random()
    }));

    scored.sort((a, b) => b.score - a.score);
    const topPick = scored.slice(0, Math.max(1, Math.floor(scored.length * 0.3)));
    
    return topPick[Math.floor(Math.random() * topPick.length)]?.movie || null;
  }

  /**
   * Time Period: Focus on a specific decade
   */
  private timePeriod(movies: Movie[], decade?: string): Movie | null {
    const targetDecade = decade || this.getMostPreferredDecade();
    
    const candidates = movies.filter(m => 
      this.getDecade(m.year) === targetDecade &&
      !this.preferences.recentlySuggested.includes(m.id)
    );

    if (candidates.length === 0) return null;

    const scored = candidates.map(movie => ({
      movie,
      score: (movie.rating || 3) * (Math.random() * 0.6 + 0.7)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[Math.floor(Math.random() * Math.min(5, scored.length))].movie;
  }

  /**
   * Similar to Liked: Find movies similar to previously liked ones
   */
  private similarToLiked(movies: Movie[]): Movie | null {
    const likedMovies = this.preferences.viewHistory
      .filter(v => v.liked)
      .slice(-10)
      .map(v => movies.find(m => m.id === v.movieId))
      .filter(Boolean) as Movie[];

    if (likedMovies.length === 0) {
      return this.smartRandom(movies, {});
    }

    // Calculate similarity to all liked movies
    const candidates = movies.filter(m => 
      !this.preferences.recentlySuggested.includes(m.id) &&
      !likedMovies.find(liked => liked.id === m.id)
    );

    const scored = candidates.map(movie => {
      const similarityScores = likedMovies.map(liked => 
        this.calculateSimilarity(movie, liked)
      );
      const avgSimilarity = similarityScores.reduce((a, b) => a + b, 0) / similarityScores.length;
      
      return {
        movie,
        score: avgSimilarity * (movie.rating || 3) * (Math.random() * 0.3 + 0.85)
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const topPick = scored.slice(0, Math.max(1, Math.floor(scored.length * 0.15)));
    
    return topPick[Math.floor(Math.random() * topPick.length)]?.movie || null;
  }

  /**
   * Get most preferred decade
   */
  private getMostPreferredDecade(): string {
    const entries = Object.entries(this.preferences.decadePreferences);
    if (entries.length === 0) return '2010s';
    
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }

  /**
   * Main recommendation function
   */
  recommend(movies: Movie[], options: RecommendationOptions = {}): Movie | null {
    if (movies.length === 0) return null;

    // Default to smart random if no strategy specified
    const strategy = options.strategy || 'smart_random';

    let recommended: Movie | null = null;

    switch (strategy) {
      case 'smart_random':
        recommended = this.smartRandom(movies, options);
        break;
      case 'mood_based':
        recommended = options.mood 
          ? this.moodBased(movies, options.mood)
          : this.smartRandom(movies, options);
        break;
      case 'genre_focused':
        recommended = options.genreFilter
          ? this.genreFocused(movies, options.genreFilter)
          : this.smartRandom(movies, options);
        break;
      case 'director_focused':
        recommended = this.directorFocused(movies);
        break;
      case 'high_rated':
        recommended = this.highRated(movies);
        break;
      case 'hidden_gems':
        recommended = this.hiddenGems(movies);
        break;
      case 'time_period':
        recommended = this.timePeriod(movies, options.decade);
        break;
      case 'similar_to_liked':
        recommended = this.similarToLiked(movies);
        break;
    }

    // Fallback to pure random if strategy fails
    if (!recommended && movies.length > 0) {
      const available = movies.filter(m => 
        !this.preferences.recentlySuggested.includes(m.id)
      );
      recommended = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : movies[Math.floor(Math.random() * movies.length)];
    }

    // Mark as suggested
    if (recommended) {
      this.markAsSuggested(recommended.id);
    }

    return recommended;
  }

  /**
   * Get recommendation with explanation
   */
  recommendWithReason(movies: Movie[], options: RecommendationOptions = {}): {
    movie: Movie | null;
    reason: string;
    strategy: RecommendationStrategy;
  } {
    const strategy = options.strategy || 'smart_random';
    const movie = this.recommend(movies, options);

    let reason = 'A random selection';

    if (movie) {
      switch (strategy) {
        case 'smart_random':
          reason = 'Picked based on your viewing preferences';
          break;
        case 'mood_based':
          reason = `Perfect for a ${options.mood || 'good'} mood`;
          break;
        case 'genre_focused':
          reason = `Great ${options.genreFilter || 'genre'} film`;
          break;
        case 'director_focused':
          reason = `From director ${movie.director}`;
          break;
        case 'high_rated':
          reason = 'A critically acclaimed masterpiece';
          break;
        case 'hidden_gems':
          reason = 'An underrated gem you might enjoy';
          break;
        case 'time_period':
          reason = `A classic from the ${options.decade || this.getDecade(movie.year)}`;
          break;
        case 'similar_to_liked':
          reason = 'Similar to films you\'ve enjoyed before';
          break;
      }
    }

    return { movie, reason, strategy };
  }

  /**
   * Get user statistics
   */
  getStats() {
    return {
      totalViewed: this.preferences.viewHistory.length,
      favoriteGenres: Object.entries(this.preferences.favoriteGenres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([genre]) => genre),
      favoriteDirectors: Object.entries(this.preferences.favoriteDirectors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([director]) => director),
      preferredDecades: Object.entries(this.preferences.decadePreferences)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([decade]) => decade)
    };
  }

  /**
   * Reset preferences
   */
  resetPreferences(): void {
    this.preferences = {
      favoriteGenres: {},
      favoriteDirectors: {},
      preferredRatings: [],
      recentlyWatched: [],
      recentlySuggested: [],
      moodPreferences: {},
      decadePreferences: {},
      viewHistory: []
    };
    this.savePreferences();
  }
}

// Singleton instance
export const recommendationEngine = new RecommendationEngine();
