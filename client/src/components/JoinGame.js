import React, { useState } from "react";

const JoinGame = ({ socket, onBack }) => {
    const [gameCode, setGameCode] = useState("");
    const [playerName, setPlayerName] = useState("");

    const handleGameCodeChange = (event) => {
        setGameCode(event.target.value);
    };

    const handlePlayerNameChange = (event) => {
        setPlayerName(event.target.value);
    };

    const joinGame = () => {
        if (playerName.trim() === "") {
            alert("Please enter your name before joining a game.");
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
            <button onClick={joinGame}>Join</button>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default JoinGame;
