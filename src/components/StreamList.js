import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { CartContext } from "../CartContext";
import list from "../data";
import "../homePage.css";

function StreamList() {
    const { cart, addToCart } = useContext(CartContext);
    const [movie, setMovie] = useState("");
    const [movies, setMovies] = useState([]);
    const [restricted, setRestricted] = useState(false);

    // Load saved data on mount
    useEffect(() => {
        const savedMovies = JSON.parse(localStorage.getItem("moviesList")) || [];
        setMovies(savedMovies);
    }, []);

    // Save movies changes to localStorage
    useEffect(() => {
        localStorage.setItem("moviesList", JSON.stringify(movies));
    }, [movies]);

    const handleAddMovie = (e) => {
        e.preventDefault();
        if (movie.trim()) {
            const newMovie = {
                id: Date.now(),
                text: movie.trim(),
                completed: false,
                checked: false,
            };
            setMovies([...movies, newMovie]);
            setMovie("");
        }
    };

    const handleDeleteMovie = (id) => {
        setMovies(movies.filter((movie) => movie.id !== id));
    };

    const handleEditMovie = (id) => {
        const movieToEdit = movies.find((movie) => movie.id === id);
        const newText = prompt("Edit the movie/show:", movieToEdit.text);
        
        if (newText?.trim()) {
            setMovies(
                movies.map((movie) =>
                    movie.id === id ? { ...movie, text: newText.trim() } : movie
                )
            );
        }
    };

    const handleToggleCheck = (id) => {
        setMovies(
            movies.map((movie) =>
                movie.id === id ? { ...movie, checked: !movie.checked } : movie
            )
        );
    };

    const handleAddToCart = (item) => {
        if (item.id >= 1 && item.id <= 4) {
            const alreadyAdded = cart.some((cartItem) => cartItem.id >= 1 && cartItem.id <= 4);
            if (alreadyAdded) {
                alert("A subscription has already been added to your cart!");
                return;
            } 
        }

        addToCart(item);

        if (item.id >= 1 && item.id <= 4) {
            setRestricted(true);
        }
    };

    return (
        <div className="stream-list-container">
            <h2>StreamList</h2>
            
            <form onSubmit={handleAddMovie} className="add-movie-form">
                <input
                    type="text"
                    value={movie}
                    onChange={(e) => setMovie(e.target.value)}
                    placeholder="Enter a movie or show"
                    className="movie-input"
                />
                <button type="submit" className="add-button">
                    Add
                </button>
            </form>

            <AnimatePresence>
                <motion.ul className="movies-list">
                    {movies.map((item) => (
                        <motion.li
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`movie-item ${item.checked ? "checked" : ""}`}
                        >
                            <span className="movie-text">{item.text}</span>
                            <div className="movie-actions">
                                <FaCheck
                                    onClick={() => handleToggleCheck(item.id)}
                                    className={`action-icon ${item.checked ? "checked" : ""}`}
                                />
                                <FaEdit
                                    onClick={() => handleEditMovie(item.id)}
                                    className="action-icon"
                                />
                                <FaTrash
                                    onClick={() => handleDeleteMovie(item.id)}
                                    className="action-icon delete"
                                />
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            </AnimatePresence>

            <div className="services-grid">
                {list.map((item) => (
                    <motion.div
                        key={item.id}
                        className="service-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src={item.img} alt={item.service} className="service-image" />
                        <h3>{item.service}</h3>
                        <p>{item.serviceInfo}</p>
                        <p className="price">${item.price}</p>
                        <button
                            onClick={() => handleAddToCart(item)} 
                            className="add-to-cart-button"
                            disabled={restricted && item.id >= 1 && item.id <= 4} 
                        >
                            Add to Cart
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default StreamList;
