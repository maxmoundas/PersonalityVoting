/*
client/src/App.js: This is the main React component that manages the application's
state and renders different components based on the current page. It also establishes
a connection with the server using Socket.IO and handles various socket events.
*/

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

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);


  useEffect(() => {
    socket.on("gameCreated", ({ gameCode }) => {
      console.log("[client] gameCreated event received");
      console.log("[client] Received game code:", gameCode);
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
      const newSocket = io("http://localhost:3001");
      newSocket.emit("createGame", { playerName });
      newSocket.on("gameCreated", ({ gameCode }) => {
        console.log("Received game code:", gameCode);
        setGameCode(gameCode);
      });
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
