import React from "react";

function GameRound({ trait, players, onVote, timeLeft }) {
    return (
        <div>
            <h1>Game Round</h1>
            <p>Time left: {timeLeft} seconds</p>
            <h2>Trait: {trait}</h2>
            <h3>Vote for a player who best fits this trait:</h3>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name}
                        <button onClick={() => onVote(player.id)}>Vote</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameRound;
