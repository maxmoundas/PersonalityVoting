import React from "react";

const HostGame = () => {
    // Replace "YOUR_GAME_CODE" with the actual game code from your application state
    const gameCode = "YOUR_GAME_CODE";

    return (
        <div>
            <h2>Host Game</h2>
            <p>Share this code with your friends to join the game: {gameCode}</p>
        </div>
    );
};

export default HostGame;
