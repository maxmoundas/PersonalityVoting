import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const HostGame = ({ gameCode, onBack, socket, onStartGame }) => {
    const [players, setPlayers] = useState([]);
    const [totalRounds, setTotalRounds] = useState(5);  // NEW

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
        onStartGame(gameCode, totalRounds);
    };

    const handleTotalRoundsChange = (event) => {
        setTotalRounds(event.target.value);
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
                <input type="number" value={totalRounds} onChange={handleTotalRoundsChange} min="1" />
            </label>
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};

HostGame.propTypes = {
    gameCode: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    onStartGame: PropTypes.func.isRequired
};

export default HostGame;
