import React from "react";
import PropTypes from 'prop-types';

function GameRound({ trait, players, onVote, timeLeft, roundNumber }) {
    return (
        <div>
            <h1>Round {roundNumber}</h1>
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

GameRound.propTypes = {
    trait: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    onVote: PropTypes.func.isRequired,
    timeLeft: PropTypes.number.isRequired,
    roundNumber: PropTypes.number.isRequired
};

export default GameRound;
