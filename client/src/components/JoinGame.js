import React, { useState, useEffect } from "react";

const JoinGame = ({ socket, onBack, onGameJoined }) => {
    const [gameCode, setGameCode] = useState("");
    const [playerName, setPlayerName] = useState("");

    useEffect(() => {
        socket.on("gameJoined", (data) => {
            onGameJoined(data);
        });

        socket.on("error", (error) => {
            alert(error.message);
        });

        return () => {
            socket.off("gameJoined");
            socket.off("error");
        };
    }, [socket, onGameJoined]);

    const handleGameCodeChange = (e) => {
        setGameCode(e.target.value);
    };

    const handlePlayerNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const handleJoinGame = () => {
        if (playerName.trim() === "" || gameCode.trim() === "") {
            alert("Please enter your name and a valid game code before joining.");
        } else {
            socket.emit("joinGame", { playerName, gameCode });
        }
    };

    return (
        <div>
            <h2>Join Game</h2>
            <label>
                Enter your name:
                <input type="text" value={playerName} onChange={handlePlayerNameChange} />
            </label>
            <label>
                Enter game code:
                <input type="text" value={gameCode} onChange={handleGameCodeChange} />
            </label>
            <button onClick={handleJoinGame}>Join Game</button>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default JoinGame;
