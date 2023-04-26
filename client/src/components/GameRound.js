import React from "react";

const GameRound = ({ trait, players, onVote }) => {
    return (
        <div>
            <h2>Current Trait: {trait}</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        <button onClick={() => onVote(player.id)}>{player.name}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameRound;