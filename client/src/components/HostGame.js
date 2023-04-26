/*
client/src/components/HostGame.js: This component displays the game code for the 
host player to share with other players. It receives the game code and a "Back" 
button handler as props from the App component.
*/

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
