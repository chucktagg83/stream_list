import React, { useState, useEffect } from "react";

function Movies() {
    const [query, setQuery] = useState("");  // Stores user input
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(""); // Store error messages

    const API_KEY = "c5300c6fd9c566164dc4538732d0295f"; // Add your TMDB API key

    // Check for stored movie data in localStorage when the component mounts
    useEffect(() => {
        const storedMovie = JSON.parse(localStorage.getItem("movie"));
        if (storedMovie) {
            setMovie(storedMovie); // Load movie from localStorage if it exists
        }
    }, []);

    const searchMovie = async (searchTerm) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=en-US`
            );

            if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);

            const data = await response.json();
            console.log(data); // Debugging: Log API response

            if (data.results.length > 0) {
                setMovie(data.results[0]); // Get the first search result
                setError(""); // Clear previous errors
                localStorage.setItem("movie", JSON.stringify(data.results[0])); // Save the movie to localStorage
            } else {
                setMovie(null);
                setError("No movies found. Try another search.");
                localStorage.removeItem("movie"); // Remove stored movie if no results
            }
        } catch (error) {
            console.error("Error fetching movie:", error);
            setError("An error occurred while fetching data.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() !== "") {
            setMovie(null); // Reset movie data before searching again
            searchMovie(query);
        } else {
            setError("Please enter a movie title.");
            setMovie(null); // Clear any previous movie data if input is empty
            localStorage.removeItem("movie"); // Remove stored movie if input is empty
        }
    };

    return (
        <div>
            <h2>Search for a Movie</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter movie title..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error messages */}

            {movie ? (
                <div>
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                    {movie.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: "200px", height: "auto" }}
                        />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
            ) : (
                <p>Search for a movie to see details.</p>
            )}
        </div>
    );
}

export default Movies;
