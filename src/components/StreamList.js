import { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

const StreamList = () => {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);

  const addMovie = () => {
    if (movie.trim() !== "") {
      setMovies([...movies, { text: movie, completed: false }]);
      setMovie(""); 
    }
  };

  const toggleComplete = (index) => {
    const updatedMovies = movies.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setMovies(updatedMovies);
  };

  const editMovie = (index) => {
    const newMovie = prompt("Edit your movie:", movies[index].text);
    if (newMovie !== null) {
      const updatedMovies = movies.map((item, i) =>
        i === index ? { ...item, text: newMovie } : item
      );
      setMovies(updatedMovies);
    }
  };

  const deleteMovie = (index) => {
    setMovies(movies.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h2>StreamList</h2>
      <input
        type="text"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="Enter a movie or show"
      />
      <button onClick={addMovie}>Add</button>
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
              <FaCheck onClick={() => toggleComplete(index)} title="Complete" />
              <FaEdit onClick={() => editMovie(index)} title="Edit" />
              <FaTrash onClick={() => deleteMovie(index)} title="Delete" />
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default StreamList;
