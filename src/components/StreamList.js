import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import { FaPlay, FaInfoCircle, FaShoppingCart, FaSearch, FaFilter, FaStar, FaTag, 
         FaEdit, FaTrashAlt, FaCheckCircle, FaPlusCircle, FaListUl, FaTimes } from 'react-icons/fa';
import list from '../data'; // Import the default export
import './StreamList.css';

const StreamList = () => {
  const { addToCart } = useContext(CartContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    genre: 'all',
    sortBy: 'popularity'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Watchlist state
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('movieWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [showMobileWatchlist, setShowMobileWatchlist] = useState(false);

  // Genres for filter dropdown
  const genres = [
    'all', 'action', 'adventure', 'comedy', 'drama', 
    'horror', 'sci-fi', 'thriller', 'romance', 'documentary'
  ];

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=c5300c6fd9c566164dc4538732d0295f'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        
        // Transform the movie data to include price and other needed properties
        const transformedMovies = data.results.map(movie => ({
          ...movie,
          price: (9.99 + (movie.vote_average / 2)).toFixed(2), // Generate a price based on rating
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          genre: movie.genre_ids && movie.genre_ids.length > 0 
            ? genres[Math.min(movie.genre_ids[0] % genres.length, genres.length - 1)] 
            : 'drama'
        }));
        
        setMovies(transformedMovies);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchMovies();
  }, []);
  
  // Filter and sort movies
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filters.genre === 'all' || movie.genre.toLowerCase() === filters.genre;
    return matchesSearch && matchesGenre;
  }).sort((a, b) => {
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'releaseDate') {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    } else {
      // Default sort by popularity
      return b.popularity - a.popularity;
    }
  });

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      title: item.title || item.name || item.service,
      price: item.price,
      image: item.poster || item.image || item.img,
      quantity: 1
    });
  };

  // Watchlist functions
  const addToWatchlist = (movie) => {
    if (!watchlist.some(item => item.id === movie.id)) {
      setWatchlist([...watchlist, {
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        addedAt: new Date().toISOString(),
        completed: false,
        note: ''
      }]);
    }
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const toggleCompleted = (id) => {
    setWatchlist(watchlist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditNote(item.note || '');
  };

  const saveEdit = () => {
    setWatchlist(watchlist.map(item => 
      item.id === editingId ? { ...item, note: editNote } : item
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNote('');
  };

  // Get all products (all 8)
  const allProducts = list || [];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="stream-list-page">
      <div className="stream-list-container">
        <div className="stream-list-header">
          <h1>Movies & TV Shows</h1>
          <p>Discover and stream your favorite content</p>
          
          {/* Mobile watchlist toggle button */}
          <button 
            className="mobile-watchlist-toggle"
            onClick={() => setShowMobileWatchlist(!showMobileWatchlist)}
          >
            {showMobileWatchlist ? <FaTimes /> : <FaListUl />} 
            {showMobileWatchlist ? 'Close Watchlist' : 'My Watchlist'}
          </button>
        </div>

        <div className="search-filter-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search movies and shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Genre:</label>
              <select 
                value={filters.genre} 
                onChange={(e) => setFilters({...filters, genre: e.target.value})}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="popularity">Popularity</option>
                <option value="releaseDate">Release Date</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        )}

        <div className="three-column-layout">
          {/* Watchlist Sidebar */}
          <div className={`watchlist-sidebar ${showMobileWatchlist ? 'mobile-show' : ''}`}>
            <div className="sidebar-header">
              <h2>My Watchlist</h2>
              <span className="watchlist-count">{watchlist.length} items</span>
            </div>
            
            {watchlist.length === 0 ? (
              <div className="empty-watchlist">
                <p>Your watchlist is empty</p>
                <p className="empty-subtitle">Search for movies and add them to your watchlist</p>
              </div>
            ) : (
              <div className="watchlist-items">
                {watchlist.map(item => (
                  <div key={item.id} className={`watchlist-item ${item.completed ? 'completed' : ''}`}>
                    {editingId === item.id ? (
                      <div className="edit-mode">
                        <textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="Add a note..."
                          rows="3"
                        />
                        <div className="edit-actions">
                          <button onClick={saveEdit} className="save-btn">Save</button>
                          <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="watchlist-item-content">
                          <div className="watchlist-item-image">
                            <img src={item.poster} alt={item.title} />
                            {item.completed && (
                              <div className="completed-overlay">
                                <FaCheckCircle />
                              </div>
                            )}
                          </div>
                          <div className="watchlist-item-details">
                            <h3>{item.title}</h3>
                            {item.note && <p className="item-note">{item.note}</p>}
                            <div className="item-date">Added: {new Date(item.addedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="watchlist-item-actions">
                          <button 
                            onClick={() => toggleCompleted(item.id)} 
                            className={`action-btn ${item.completed ? 'uncomplete-btn' : 'complete-btn'}`}
                            title={item.completed ? "Mark as not watched" : "Mark as watched"}
                          >
                            <FaCheckCircle />
                          </button>
                          <button 
                            onClick={() => startEditing(item)} 
                            className="action-btn edit-btn"
                            title="Add/edit note"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => removeFromWatchlist(item.id)} 
                            className="action-btn delete-btn"
                            title="Remove from watchlist"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="main-content">
            {filteredMovies.length === 0 ? (
              <div className="no-results">
                <h3>No movies found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="movie-grid">
                {filteredMovies.map(movie => (
                  <div key={movie.id} className="movie-card">
                    <div className="movie-poster">
                      <img src={movie.poster} alt={movie.title} />
                      <div className="movie-overlay">
                        <Link to={`/movies/${movie.id}`} className="overlay-btn watch-btn">
                          <FaPlay /> Watch Now
                        </Link>
                        <Link to={`/movies/${movie.id}`} className="overlay-btn info-btn">
                          <FaInfoCircle /> Details
                        </Link>
                        <div className="overlay-actions">
                          <button 
                            className="overlay-btn cart-btn"
                            onClick={() => handleAddToCart(movie)}
                          >
                            <FaShoppingCart /> ${movie.price}
                          </button>
                          <button 
                            className="overlay-btn watchlist-btn"
                            onClick={() => addToWatchlist(movie)}
                            disabled={watchlist.some(item => item.id === movie.id)}
                          >
                            <FaPlusCircle /> {watchlist.some(item => item.id === movie.id) ? 'Added' : 'Watchlist'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-year">
                          {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                        </span>
                        <span className="movie-rating">
                          <FaStar className="star-icon" /> {movie.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="movie-genre">{movie.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="featured-section">
              <h2>Featured Collections</h2>
              <div className="collection-cards">
                <div className="collection-card">
                  <img src="https://via.placeholder.com/300x180?text=New+Releases" alt="New Releases" />
                  <h3>New Releases</h3>
                </div>
                <div className="collection-card">
                  <img src="https://via.placeholder.com/300x180?text=Trending+Now" alt="Trending Now" />
                  <h3>Trending Now</h3>
                </div>
                <div className="collection-card">
                  <img src="https://via.placeholder.com/300x180?text=Classics" alt="Classics" />
                  <h3>Classics</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Product Sidebar */}
          <div className="product-sidebar">
            <div className="sidebar-header">
              <h2>Shop Products</h2>
              <Link to="/products" className="view-all-link">View All</Link>
            </div>
            
            <div className="product-list">
              {allProducts.map(product => (
                <div key={product.id} className="sidebar-product">
                  <div className="product-image">
                    <img src={product.img} alt={product.service} />
                  </div>
                  <div className="product-details">
                    <h3>{product.service}</h3>
                    <p className="product-info">{product.serviceInfo}</p>
                    <div className="product-price">
                      <FaTag className="price-icon" /> ${product.price.toFixed(2)}
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="promo-banner">
              <h3>Special Offer</h3>
              <p>Get 20% off on all subscriptions with code: <strong>EZTECH20</strong></p>
              <Link to="/products" className="promo-btn">Shop Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamList;
