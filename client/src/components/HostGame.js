import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const HostGame = ({ gameCode, onBack, socket, onStartGame, serverError }) => {
    const [players, setPlayers] = useState([]);
    const [totalRounds, setTotalRounds] = useState(3);  // Changed default to 3
    const [error, setError] = useState(null);  // NEW

    useEffect(() => {
        const handlePlayerJoined = ({ playerId, playerName }) => {
            setPlayers((prevPlayers) => [...prevPlayers, { id: playerId, name: playerName }]);
        };

        socket.on("playerJoined", handlePlayerJoined);

        return () => {
            socket.off("playerJoined", handlePlayerJoined);
        };
    }, [socket]);

    const handleStartGame = () => {
        if (totalRounds < 3) {
            setError('Minimum number of rounds is 3.');
            return;
        }
        onStartGame(gameCode, totalRounds);
    };

    const handleTotalRoundsChange = (event) => {
        const value = event.target.value;
        if (value < 3) {
            setError('Minimum number of rounds is 3.');
        } else {
            setError(null);
        }
        setTotalRounds(value);
    };

    return (
        <div>
            <h2>Host Game</h2>
            <p>Share this code with your friends to join the game: {gameCode}</p>
            <button onClick={onBack}>Back</button>
            <div>
                <h3>Players in the game:</h3>
                <ul>
                    {players.map((player) => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </ul>
            </div>
            <label>
                Total Rounds:
                <input type="number" value={totalRounds} onChange={handleTotalRoundsChange} min="3" />
            </label>
            {error && <p>{error}</p>}
            {serverError && <p>Error: {serverError}</p>}
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};

HostGame.propTypes = {
    gameCode: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    onStartGame: PropTypes.func.isRequired,
    serverError: PropTypes.string,
};

export default HostGame;
