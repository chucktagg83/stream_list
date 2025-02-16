import { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import list from "../data"; // Import your data
import "../homePage.css";

function StreamList() {
  const [cart, setCart] = useState([]);
  const [movie, setMovie] = useState(""); // For adding movies/shows
  const [movies, setMovies] = useState([]); // List of added movies/shows

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(savedCartItems);
  }, []);

  // Add item to cart
const addToCart = (item) => {
  let updatedCart = [...cart];

  // Allow multiple additions for item ids 5, 6, 7, 8
  if ([5, 6, 7, 8].includes(item.id)) {
    updatedCart.push(item);
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save to localStorage
  } else {
    // For item ids 1, 2, 3, 4 check if it's already in the cart
    const itemExists = updatedCart.find(cartItem => cartItem.id === item.id);

    if (!itemExists) {
      updatedCart.push(item);
      setCart(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save to localStorage
    } else {
      alert("This item is already in the cart.");
    }
  }
};

  // Delete a movie from the list
  const deleteMovie = (index) => {
    const updatedMovies = [...movies];
    updatedMovies.splice(index, 1);
    setMovies(updatedMovies);
  };

  // Add movie to the list
  const addMovie = () => {
    if (movie.trim() !== "") {
      setMovies([...movies, { text: movie, completed: false, checked: false }]);
      setMovie("");
    }
  };


  // Toggle the checked status of a movie
  const toggleChecked = (index) => {
    const updatedMovies = [...movies];
    updatedMovies[index].checked = !updatedMovies[index].checked;

    // If the movie is checked, add it to the cart
    if (updatedMovies[index].checked) {
      addToCart(updatedMovies[index]);
    }

    setMovies(updatedMovies);
  };

  // Edit a movie in the list
  const editMovie = (index) => {
    const newMovie = prompt("Edit the movie/show:", movies[index].text);
    if (newMovie !== null && newMovie.trim() !== "") {
      const updatedMovies = [...movies];
      updatedMovies[index].text = newMovie;
      setMovies(updatedMovies);
    }
  };

  return (
    <div className="container">
      <h2>StreamList</h2>
      <div className="movie-input">
        <input
          type="text"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          placeholder="Enter a movie or show" />
        <button onClick={addMovie}>Add</button>
      </div>

      {/* Movies added list */}
      <motion.ul layout>
        {movies.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            layout
            className={item.completed ? "completed" : ""}
          >
            {item.text}
            <div>
              <FaCheck 
                onClick={() => toggleChecked(index)} 
                title="Check to Add to Cart" 
                style={{ color: item.checked ? "green" : "gray" }} 
              />
              <FaEdit onClick={() => editMovie(index)} title="Edit" />
              <FaTrash onClick={() => deleteMovie(index)} title="Delete" />
            </div>
          </motion.li>
        ))}
      </motion.ul>

      {/* Display Items from data.js in a horizontal row */}
      <div className="items-row">
        {list.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="item-card"
          >
            <img src={item.img} alt={item.service} width="100" />
            <h3>{item.service}</h3> {/* Movie/show name or service */}
            <p>{item.serviceInfo}</p> {/* Description or additional info */}
            <p>Price: ${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StreamList;
