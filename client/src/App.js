import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import HostGame from "./components/HostGame";
import JoinGame from "./components/JoinGame";

const socket = io("http://localhost:3001");

function App() {
  const [page, setPage] = useState("welcome");
  const [gameCode, setGameCode] = useState(null);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    socket.on("gameCreated", ({ gameCode }) => {
      console.log("Received game code:", gameCode); // for debugging
      setGameCode(gameCode);
    });

    return () => {
      socket.off("gameCreated");
    };
  }, []);

  const handleJoinGame = () => {
    setPage("join");
  };

  const handleBack = () => {
    setPage("welcome");
  };

  const handleHostGame = () => {
    if (playerName.trim() === "") {
      alert("Please enter your name before hosting a game.");
    } else {
      console.log("Emitting createGame event");
      socket.emit("createGame", { playerName });
      setPage("host");
    }
  };

  const handlePlayerNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  return (
    <div className="App">
      {page === "welcome" && (
        <>
          <h1>Welcome to Personality Voting</h1>
          <label>
            Enter your name:
            <input type="text" value={playerName} onChange={handlePlayerNameChange} />
          </label>
          <button onClick={handleHostGame}>Host Game</button>
          <button onClick={handleJoinGame}>Join Game</button>
        </>
      )}
      {page === "host" && <HostGame gameCode={gameCode} onBack={handleBack} />}
      {page === "join" && <JoinGame socket={socket} onBack={handleBack} />}
    </div>
  );
}

export default App;
