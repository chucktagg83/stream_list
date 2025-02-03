import { useState } from 'react';

function StreamList() {
  const [streamList, setStreamList] = useState([]);
  const [input, setInput] = useState("");

  const addToList = () => {
    if (input.trim() !== "") {
      setStreamList([...streamList, input]);
      console.log(input);
      setInput("");
    }
  };

  return (
    <div>
      <h1>StreamList</h1>
      <input 
        type="text" 
        placeholder="Add a movie/show" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={addToList}>Add</button>
      <ul>
        {streamList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
