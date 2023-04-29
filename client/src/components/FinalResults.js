import React from 'react';

const FinalResults = ({ players }) => {
    const sortedPlayers = players.sort((a, b) => b.votes - a.votes);

    return (
        <div>
            <h1>Final Results</h1>
            <h2>Top Players:</h2>
            <ul>
                {sortedPlayers.map((player, index) => (
                    <li key={player.id}>
                        {index + 1}. {player.name} - {player.votes} votes
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FinalResults;
