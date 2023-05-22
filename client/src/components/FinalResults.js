import React from 'react';
import PropTypes from 'prop-types';

const FinalResults = ({ players }) => {
    const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes);
    const highestVotes = sortedPlayers[0]?.votes || 0;  // default to 0 if no players

    return (
        <div>
            <h1>Final Results</h1>
            <h2>Top Players:</h2>
            <ul>
                {sortedPlayers.map((player, index) => {
                    const isWinner = player.votes === highestVotes;
                    return (
                        <li key={player.id}>
                            {index + 1}. {player.name} - {player.votes} votes
                            {isWinner && <span> 🏆</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

FinalResults.propTypes = {
    players: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            votes: PropTypes.number.isRequired
        })
    ).isRequired
};

export default FinalResults;
