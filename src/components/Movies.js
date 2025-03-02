// MoviesPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlay, FaInfoCircle, FaChevronLeft, FaChevronRight, FaStar, FaPlus } from 'react-icons/fa';
import './Movies.css';

const MoviesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  
  const moviesScrollRef = useRef(null);
  const showsScrollRef = useRef(null);
  
  const API_KEY = 'c5300c6fd9c566164dc4538732d0295f';
  
  // Fetch popular movies and shows on component mount
  useEffect(() => {
    const fetchPopularContent = async () => {
      try {
        // Fetch popular movies
        const moviesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        
        if (!moviesResponse.ok) {
          throw new Error('Failed to fetch popular movies');
        }
        
        const moviesData = await moviesResponse.json();
        setPopularMovies(moviesData.results);
        
        // Fetch popular TV shows
        const showsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        
        if (!showsResponse.ok) {
          throw new Error('Failed to fetch popular shows');
        }
        
        const showsData = await showsResponse.json();
        setPopularShows(showsData.results);
        
      } catch (err) {
        console.error('Error fetching popular content:', err);
        setError(err.message);
      }
    };
    
    fetchPopularContent();
  }, []);
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchResults(null);
    
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchTerm)}&page=1&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error('Search failed. Please try again.');
      }
      
      const data = await response.json();
      
      // Get the first valid result (movie or TV show)
      const validResult = data.results.find(item => 
        (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
      );
      
      if (validResult) {
        // If it's a movie, fetch additional details
        if (validResult.media_type === 'movie') {
          const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${validResult.id}?api_key=${API_KEY}&language=en-US`
          );
          
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            setSearchResults({
              ...validResult,
              ...detailsData,
              type: 'movie'
            });
          } else {
            setSearchResults(validResult);
          }
        } 
        // If it's a TV show, fetch additional details
        else if (validResult.media_type === 'tv') {
          const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${validResult.id}?api_key=${API_KEY}&language=en-US`
          );
          
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            setSearchResults({
              ...validResult,
              ...detailsData,
              type: 'tv'
            });
          } else {
            setSearchResults(validResult);
          }
        }
      } else {
        setError('No results found. Try a different search term.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Scroll handlers for horizontal scrolling
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Format date to year
  const formatYear = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };
  
  // Get title based on media type
  const getTitle = (item) => {
    return item.title || item.name || 'Untitled';
  };
  
  // Get release date based on media type
  const getReleaseDate = (item) => {
    return item.release_date || item.first_air_date;
  };

  return (
    <div className="movies-page">
      <div className="movies-container">
        {/* Hero Search Section */}
        <div className="hero-search-section">
          <div className="hero-content">
            <h1>Discover Movies & TV Shows</h1>
            <p>Search for your favorite movies and TV shows</p>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for a movie or TV show..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </div>
        
        {/* Search Results Section */}
        {(loading || error || searchResults) && (
          <div className="search-results-section">
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching...</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
            {searchResults && !loading && !error && (
              <div className="search-result-details">
                <div className="result-poster">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${searchResults.poster_path}`} 
                    alt={getTitle(searchResults)} 
                  />
                </div>
                <div className="result-info">
                  <h2>{getTitle(searchResults)} <span className="year">({formatYear(getReleaseDate(searchResults))})</span></h2>
                  
                  <div className="result-meta">
                    {searchResults.vote_average && (
                      <div className="rating">
                        <FaStar className="star-icon" />
                        <span>{searchResults.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {searchResults.runtime && (
                      <div className="runtime">
                        {formatRuntime(searchResults.runtime)}
                      </div>
                    )}
                    
                    {searchResults.number_of_seasons && (
                      <div className="seasons">
                        {searchResults.number_of_seasons} Season{searchResults.number_of_seasons !== 1 ? 's' : ''}
                      </div>
                    )}
                    
                    {searchResults.genres && searchResults.genres.length > 0 && (
                      <div className="genres">
                        {searchResults.genres.map(genre => genre.name).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="result-overview">
                    <h3>Overview</h3>
                    <p>{searchResults.overview || 'No overview available.'}</p>
                  </div>
                  
                  <div className="result-actions">
                    <button className="action-button watch-button">
                      <FaPlay /> Watch Now
                    </button>
                    <button className="action-button info-button">
                      <FaInfoCircle /> More Details
                    </button>
                    <button className="action-button add-button">
                      <FaPlus /> Add to Watchlist
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Popular Movies Section */}
        <div className="content-section">
          <div className="section-header">
            <h2>Popular Movies This Month</h2>
            <div className="scroll-controls">
              <button 
                className="scroll-button" 
                onClick={() => scroll(moviesScrollRef, 'left')}
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="scroll-button" 
                onClick={() => scroll(moviesScrollRef, 'right')}
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          
          <div className="horizontal-scroll" ref={moviesScrollRef}>
            <div className="scroll-content">
              {popularMovies.map(movie => (
                <div key={movie.id} className="content-card">
                  <div className="card-poster">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title} 
                    />
                    <div className="card-overlay">
                      <Link to={`/movies/${movie.id}`} className="card-button primary-button">
                        <FaPlay /> Watch
                      </Link>
                      <Link to={`/movies/${movie.id}`} className="card-button secondary-button">
                        <FaInfoCircle /> Details
                      </Link>
                    </div>
                  </div>
                  <div className="card-info">
                    <h3>{movie.title}</h3>
                    <div className="card-meta">
                      <span className="card-year">{formatYear(movie.release_date)}</span>
                      <span className="card-rating">
                        <FaStar className="star-icon" /> {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Popular TV Shows Section */}
        <div className="content-section">
          <div className="section-header">
            <h2>Popular TV Shows This Month</h2>
            <div className="scroll-controls">
              <button 
                className="scroll-button" 
                onClick={() => scroll(showsScrollRef, 'left')}
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="scroll-button" 
                onClick={() => scroll(showsScrollRef, 'right')}
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          
          <div className="horizontal-scroll" ref={showsScrollRef}>
            <div className="scroll-content">
              {popularShows.map(show => (
                <div key={show.id} className="content-card">
                  <div className="card-poster">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                      alt={show.name} 
                    />
                    <div className="card-overlay">
                      <Link to={`/tv/${show.id}`} className="card-button primary-button">
                        <FaPlay /> Watch
                      </Link>
                      <Link to={`/tv/${show.id}`} className="card-button secondary-button">
                        <FaInfoCircle /> Details
                      </Link>
                    </div>
                  </div>
                  <div className="card-info">
                    <h3>{show.name}</h3>
                    <div className="card-meta">
                      <span className="card-year">{formatYear(show.first_air_date)}</span>
                      <span className="card-rating">
                        <FaStar className="star-icon" /> {show.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
