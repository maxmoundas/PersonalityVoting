import React, { useState } from "react";
import HostGame from "./components/HostGame";
import JoinGame from "./components/JoinGame";

function App() {
  const [page, setPage] = useState("welcome");

  const handleHostGame = () => {
    setPage("host");
  };

  const handleJoinGame = () => {
    setPage("join");
  };

  return (
    <div className="App">
      {page === "welcome" && (
        <>
          <h1>Welcome to Personality Voting</h1>
          <button onClick={handleHostGame}>Host Game</button>
          <button onClick={handleJoinGame}>Join Game</button>
        </>
      )}
      {page === "host" && <HostGame />}
      {page === "join" && <JoinGame />}
    </div>
  );
}

export default App;
