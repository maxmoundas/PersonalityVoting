import React, { useState, useEffect } from "react";
import HostGame from "./components/HostGame";
import JoinGame from "./components/JoinGame";
import socket from "./socket";
import Waiting from "./components/Waiting";
import Game from "./components/Game";
import GameRound from "./components/GameRound";

function App() {
  const [page, setPage] = useState("welcome");
  const [gameCode, setGameCode] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentTrait, setCurrentTrait] = useState("");
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [votingResults, setVotingResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isHost, setIsHost] = useState(false);

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
      setIsHost(true);
    });

    socket.on("startRound", ({ trait, players, timeLeft }) => {
      setCurrentTrait(trait);
      setPlayers(players);
      setTimeLeft(timeLeft);
      setPage("gameRound");
    });

    return () => {
      socket.off("gameCreated");
      socket.off("startRound");
    };
  }, [socket]);

  useEffect(() => {
    let timerInterval;

    socket.on("timerUpdate", ({ timeLeft }) => {
      setTimeLeft(timeLeft);
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    });

    return () => {
      socket.off("timerUpdate");
      clearInterval(timerInterval);
    };
  }, [socket]);

  useEffect(() => {
    socket.on("roundEnded", ({ results }) => {
      setVotingResults(results);
      setPage("results");
    });

    return () => {
      socket.off("roundEnded");
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

  const handleVote = (votedPlayerId) => {
    socket.emit("submitVote", { votedPlayerId });
  };

  const handleStartNextRound = () => {
    socket.emit("startNextRound");
    setShowResults(false);
  };

  useEffect(() => {
    socket.on("startNextRound", () => {
      setShowResults(false);
    });

    return () => {
      socket.off("startNextRound");
    };
  }, []);

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
      {page === "waiting" && <Waiting />}
      {page === "gameRound" && (
        <GameRound trait={currentTrait} players={players} onVote={handleVote} timeLeft={timeLeft} />
      )}
      {page === "game" && (
        <div>
          <h1>Game in progress</h1>
          <p>Time left: {timeLeft} seconds</p>
          {/* ... (rest of the game content) */}
        </div>
      )}
      {page === "results" && (
        <div>
          <h1>Round Results</h1>
          <h2>Top Players:</h2>
          <ul>
            {votingResults.map((player, index) => (
              <li key={player.id}>
                {index + 1}. {player.name} - {player.votes} votes
              </li>
            ))}
          </ul>
          {isHost && <button onClick={handleStartNextRound}>Start Next Round</button>}
        </div>
      )}
    </div>
  );
}

export default App;
