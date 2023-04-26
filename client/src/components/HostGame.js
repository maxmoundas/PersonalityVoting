import React from "react";

const HostGame = ({ gameCode, onBack }) => {
    return (
        <div>
            <h2>Host Game</h2>
            <p>Share this code with your friends to join the game: {gameCode}</p>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default HostGame;
