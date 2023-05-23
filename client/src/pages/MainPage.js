import React, { useState, useEffect, useRef } from "react";
import HostGame from "../components/HostGame";
import JoinGame from "../components/JoinGame";
import Waiting from "../components/Waiting";
import GameRound from "../components/GameRound";
import RoundResults from "../components/RoundResults";
import FinalResults from "../components/FinalResults";
import Welcome from "../components/Welcome";
import { useSocket } from "../hooks/useSocket";

function MainPage() {
    const [page, setPage] = useState("welcome");
    const [gameCode, setGameCode] = useState(null);
    const [playerName, setPlayerName] = useState("");
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
    const [totalRounds, setTotalRounds] = useState(5);
    const [errorMessage, setErrorMessage] = useState(null);
    const timerInterval = useRef(null);
    
    // Call useSocket at the top level of your component to get the socket instance
    const socket = useSocket("createGame", (data) => {
        console.log("[client] createGame event received");
        console.log("[client] Received data:", data);
    });

    useSocket("connect", () => {
        console.log("Connected to server");
    });

    useSocket("disconnect", (reason) => {
        console.log("Disconnected from server:", reason);
    });

    useSocket("gameCreated", ({ gameCode }) => {
        console.log("[client] gameCreated event received");
        console.log("[client] Received game code:", gameCode);
        setGameCode(gameCode);
        setIsHost(true);
        setCurrentRound(1);
        setTotalRounds(5);
    });

    useSocket("startRound", ({ trait, players, timeLeft, round }) => {
        setCurrentTrait(trait);
        setPlayers(players);
        setTimeLeft(timeLeft);
        setCurrentRound(round);

        if (round === totalRounds) {
            setIsFinalRound(true);
        }

        setPage("gameRound");
    });

    useSocket("roundEnded", ({ results }) => {
        setVotingResults(results);

        if (currentRound === 5) {
            setIsFinalRound(true);
        }

        setPage("results");

        // Start a 15-second timer to automatically proceed to the next round
        setResultsCountdown(15);
        if (timerInterval.current) { // <-- Clear existing interval if it exists
            clearInterval(timerInterval.current);
        }
        timerInterval.current = setInterval(() => { // <-- Assign interval to timerInterval ref
            setResultsCountdown((prevTimeLeft) => {
                if (prevTimeLeft === 1) {
                    clearInterval(timerInterval.current);
                    timerInterval.current = null;
                    if (isFinalRound) {
                        handleFinalResults();
                    } else {
                        startNextRound();
                    }
                }
                return prevTimeLeft - 1;
            });
        }, 1000);
    });

    useEffect(() => {
        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
            }

            // Emit disconnect event if socket is available
            if (socket) {
                socket.emit("disconnect");
            }
        };
    }, [socket]); // <-- Added socket to the dependency array

    useEffect(() => {
        console.log('totalRounds state updated:', totalRounds);
    }, [totalRounds]);

    useSocket("timerUpdate", ({ timeLeft }) => {
        setTimeLeft(timeLeft);
    });

    useSocket("startNextRound", () => {
        setShowResults(false);
        if (isFinalRound && currentRound === totalRounds) {
            socket.emit("finalResults");
        }
    });

    useSocket("finalResults", ({ players }) => {
        setPage("finalResults");
        setFinalResults(players);
    });

    useSocket("navigateToFinalResults", () => {
        setPage("finalResults");
        setFinalResults(players);
    });

    useSocket("error", (error) => {
        console.log("Server error:", error.message);
        setErrorMessage(error.message);
    });

    const handleJoinGame = () => {
        setPage("join");
    };

    const handleBack = () => {
        setIsHost(false);
        setPage("welcome");

        // Emit disconnect event
        socket.emit("disconnect");
    };

    const handleHostGame = () => {
        if (playerName.trim() === "") {
            alert("Please enter your name before hosting a game.");
        } else {
            console.log("Emitting createGame event");
            socket.emit("createGame", { playerName });  // Using the socket instance from useSocket
            setPage("host");
        }
    };

    const handlePlayerNameChange = (event) => {
        setPlayerName(event.target.value);
    };

    const handleGameJoined = () => {
        setPage("waiting");
    };

    const handleStartGame = (gameCode, totalRounds) => {
        totalRounds = Number(totalRounds);
        setTotalRounds(totalRounds); // <-- Set the total rounds
        console.log('Emitting startGame event:', { gameCode, totalRounds });
        socket.emit("startGame", { gameCode, totalRounds });
    };

    const handleVote = (votedPlayerId) => {
        socket.emit("submitVote", { votedPlayerId });
    };

    const handleStartNextRound = () => {
        socket.emit("startNextRound");
        setShowResults(false);
        if (isFinalRound && currentRound === totalRounds) { // <-- Prevent calling final results if not the final round
            socket.emit("finalResults");
        }
    };

    const startNextRound = () => {
        setPage("waiting");
        socket.emit("startNextRound");
    };

    const handleFinalResults = () => {
        setPage("finalResults");
        setFinalResults(players);
        socket.emit("showFinalResults");
    };

    return (
        <div className="App">
            {page === "welcome" && (
                <Welcome
                    playerName={playerName}
                    handlePlayerNameChange={handlePlayerNameChange}
                    handleHostGame={handleHostGame}
                    handleJoinGame={handleJoinGame}
                />
            )}
            {page === "host" && gameCode && (
                <HostGame
                    gameCode={gameCode}
                    onBack={handleBack}
                    socket={socket}
                    onStartGame={handleStartGame}
                    serverError={errorMessage}
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
            {page === "results" && (
                <RoundResults
                    currentRound={currentRound}
                    resultsCountdown={resultsCountdown}
                    votingResults={votingResults}
                    isHost={isHost}
                    isFinalRound={isFinalRound}
                    handleFinalResults={handleFinalResults}
                    handleStartNextRound={handleStartNextRound}
                />
            )}
            {page === "finalResults" && (
                <FinalResults players={finalResults} />
            )}
        </div>
    );
}

export default MainPage;
