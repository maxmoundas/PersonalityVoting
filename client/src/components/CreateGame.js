import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame } from '../actions/gameActions';

const CreateGame = ({ onBack }) => {
    const [playerName, setPlayerName] = useState('');
    const dispatch = useDispatch();

    const handleCreateGame = () => {
        if (playerName.trim() === '') {
            alert('Please enter your name before creating a game.');
        } else {
            dispatch(createGame(playerName));
        }
    };

    const handleNameChange = (event) => {
        setPlayerName(event.target.value);
    };

    return (
        <div className="CreateGame">
            <h2>Create Game</h2>
            <label>
                Enter your name:
                <input
                    type="text"
                    value={playerName}
                    onChange={handleNameChange}
                />
            </label>
            <button onClick={handleCreateGame}>Create Game</button>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default CreateGame;
