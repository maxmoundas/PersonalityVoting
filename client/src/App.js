import React, { useState, useEffect } from "react";
import HostGame from "./components/HostGame";
import JoinGame from "./components/JoinGame";
import socket from "./socket";
import Waiting from "./components/Waiting";
import Game from "./components/Game";
import GameRound from "./components/GameRound";
import FinalResults from "./components/FinalResults";

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
  const [isFinalRound, setIsFinalRound] = useState(false);
  const [finalResults, setFinalResults] = useState([]);
  const [resultsTimeLeft, setResultsTimeLeft] = useState(15);
  const [currentRound, setCurrentRound] = useState(1);
  const [resultsCountdown, setResultsCountdown] = useState(0);

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
      setCurrentRound(1);
    });

    socket.on("startRound", ({ trait, players, timeLeft, round }) => {
      setCurrentTrait(trait);
      setPlayers(players);
      setTimeLeft(timeLeft);

      if (isHost && page === "waiting") {
        setCurrentRound((prevRound) => {
          if (prevRound === 5) {
            setIsFinalRound(true);
          }
          return prevRound + 1;
        });
      } else {
        setCurrentRound(round);
      }

      setPage("gameRound");
    });

    return () => {
      socket.off("gameCreated");
      socket.off("startRound");
    };
  }, [socket, page]);

  useEffect(() => {
    let timerInterval;

    const roundEndedHandler = ({ results }) => {
      setVotingResults(results);

      if (currentRound === 5) {
        setIsFinalRound(true);
        setPage("finalResults");
        setFinalResults(players);
      } else {
        setPage("results");
      }

      clearInterval(timerInterval);

      // Start a 15-second timer to automatically proceed to the next round
      setResultsCountdown(15);
      timerInterval = setInterval(() => {
        setResultsCountdown((prevTimeLeft) => {
          if (prevTimeLeft === 1) {
            clearInterval(timerInterval);
            startNextRound();
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    };

    const timerUpdateHandler = ({ timeLeft }) => {
      setTimeLeft(timeLeft);
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    };

    socket.on("roundEnded", roundEndedHandler);
    socket.on("timerUpdate", timerUpdateHandler);

    return () => {
      socket.off("roundEnded", roundEndedHandler);
      socket.off("timerUpdate", timerUpdateHandler);
      clearInterval(timerInterval);
    };
  }, [currentRound]);

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

  const startNextRound = () => {
    setPage("waiting");
    socket.emit("startNextRound");
  };

  const handleFinalResults = () => {
    setPage("finalResults");
    setFinalResults(players);
  };

  useEffect(() => {
    socket.on("startNextRound", () => {
      setShowResults(false);
      if (isFinalRound) {
        socket.emit("finalResults");
      }
    });

    return () => {
      socket.off("startNextRound");
    };
  }, [isFinalRound]);

  useEffect(() => {
    socket.on("finalResults", () => {
      setPage("finalResults");
      setFinalResults(players);
    });

    return () => {
      socket.off("finalResults");
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
        <GameRound
          trait={currentTrait}
          players={players}
          onVote={handleVote}
          timeLeft={timeLeft}
          roundNumber={currentRound}
        />
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
          <h1>Round {currentRound} Results</h1>
          <h2>Time left: {resultsCountdown} seconds</h2>
          <h2>Player with most votes:</h2>
          {votingResults[0] && (
            <p>
              {votingResults[0].name} - {votingResults[0].votes} votes
            </p>
          )}
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
      {page === "finalResults" && (
        <FinalResults players={finalResults} />
      )}
    </div>
  );
}

export default App;
