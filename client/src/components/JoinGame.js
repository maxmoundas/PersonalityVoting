/*
client/src/components/JoinGame.js: This component allows players to join an 
existing game by entering a game code. It manages the game code state, and 
when the "Join" button is clicked, it should emit a "joinGame" event to the 
server with the player's name and game code. It also receives a "Back" button 
handler as props from the App component.
*/

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
