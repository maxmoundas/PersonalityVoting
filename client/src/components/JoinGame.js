import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const JoinGame = ({ socket, onBack, onGameJoined }) => {
    const [gameCode, setGameCode] = useState("");
    const [playerName, setPlayerName] = useState("");

    useEffect(() => {
        socket.on("gameJoined", (data) => {
            onGameJoined(data);
        });

        socket.on("error", (error) => {
            alert(error.message);
        });

        socket.on("connect_error", (error) => {
            console.error("Connect error:", error);
        });

        socket.on("connect_timeout", () => {
            console.error("Connect timeout");
        });

        return () => {
            socket.off("gameJoined");
            socket.off("error");
            socket.off("connect_error");
            socket.off("connect_timeout");
        };
    }, [socket, onGameJoined]);

    const handleGameCodeChange = (e) => {
        setGameCode(e.target.value);
    };

    const handlePlayerNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const handleJoinGame = () => {
        if (playerName.trim() === "" || gameCode.trim() === "") {
            alert("Please enter your name and a valid game code before joining.");
        } else {
            socket.emit("joinGame", { playerName, gameCode });
        }
    };

    return (
        <div>
            <h2>Join Game</h2>
            <label>
                Enter your name:
                <input type="text" value={playerName} onChange={handlePlayerNameChange} />
            </label>
            <label>
                Enter game code:
                <input type="text" value={gameCode} onChange={handleGameCodeChange} />
            </label>
            <button onClick={handleJoinGame}>Join Game</button>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

JoinGame.propTypes = {
    socket: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onGameJoined: PropTypes.func.isRequired
};

export default JoinGame;
