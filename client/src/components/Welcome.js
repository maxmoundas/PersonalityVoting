import React from "react";

function Welcome({ playerName, handlePlayerNameChange, handleHostGame, handleJoinGame }) {
    return (
        <>
            <h1>Welcome to Personality Voting</h1>
            <label>
                Enter your name:
                <input type="text" value={playerName} onChange={handlePlayerNameChange} />
            </label>
            <button onClick={handleHostGame}>Host Game</button>
            <button onClick={handleJoinGame}>Join Game</button>
        </>
    );
}

export default Welcome;
