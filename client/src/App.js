import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import HostGame from "./components/HostGame";
import JoinGame from "./components/JoinGame";
import socket from "./socket";
import Waiting from "./components/Waiting";
import Game from "../server/game";

function App() {
  const [page, setPage] = useState("welcome");
  const [gameCode, setGameCode] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

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

    socket.on("gameStarted", () => {
      setIsGameStarted(true);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("gameStarted");
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

  const handleGameJoined = () => {
    setPage("waiting");
  };

  const handleStartGame = (gameCode) => {
    socket.emit("startGame", gameCode);
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
      {page === "host" && (
        <HostGame
          gameCode={gameCode}
          onBack={handleBack}
          socket={socket}
          onStartGame={handleStartGame}
        />
      )}
      {page === "join" && <JoinGame socket={socket} onBack={handleBack} onGameJoined={handleGameJoined} />}
      {page === "waiting" && !isGameStarted && <Waiting />}
      {page === "waiting" && isGameStarted && <Game />}
    </div>
  );
}

export default App;
