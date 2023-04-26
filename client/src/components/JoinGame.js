import React, { useState } from "react";

const JoinGame = () => {
    const [gameCode, setGameCode] = useState("");

    const handleInputChange = (event) => {
        setGameCode(event.target.value);
    };

    const joinGame = () => {
        // Implement the logic to join a game using the provided game code
    };

    return (
        <div>
            <h2>Join Game</h2>
            <label>
                Enter game code:
                <input type="text" value={gameCode} onChange={handleInputChange} />
            </label>
            <button onClick={joinGame}>Join</button>
        </div>
    );
};

export default JoinGame;
