const http = require("http");
const socketIo = require("socket.io");
const { Game, Player } = require("./game");
const { generateGameCode, getGameByPlayerId, traitGenerator } = require("./utils");

const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: function (origin, callback) {
        // Allow any origin that matches the localhost pattern
        const localhostPattern = /^http:\/\/localhost:\d+$/;
        if (!origin || localhostPattern.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
}));

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: function (origin, callback) {
            // Allow any origin that matches the localhost pattern
            const localhostPattern = /^http:\/\/localhost:\d+$/;
            if (!origin || localhostPattern.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
});

const { games } = require("./utils");

function endRound(game) {
    if (game) {
        clearInterval(game.timerInterval);
        const results = game.getVotingResults();
        io.to(game.code).emit("roundEnded", { results });
    }
}

function roundTimer(game, io, seconds) {
    let timeLeft = seconds;
    io.to(game.code).emit("timerUpdate", { timeLeft });

    // Clear the previous interval if it exists
    if (game.timerInterval) {
        clearInterval(game.timerInterval);
    }

    const timerInterval = setInterval(() => {
        timeLeft -= 1;
        io.to(game.code).emit("timerUpdate", { timeLeft });

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            game.setTimerEnded(true);
            endRound(game, io);
        }
    }, 1000);

    game.timerInterval = timerInterval;
}

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Disconnecting event handler
    socket.on("disconnecting", () => {
        console.log("Client disconnecting:", socket.id);
        const game = getGameByPlayerId(socket.id);

        if (game) {
            game.removePlayer(socket.id);
        }
    });

    // Disconnect event handler
    socket.on("disconnect", (reason) => {
        console.log("Client disconnected:", socket.id, "Reason:", reason);
    });

    // Create a new game and join as the host
    socket.on("createGame", ({ playerName }) => {
        console.log("createGame event received");
        const gameCode = generateGameCode();
        console.log("Generated game code:", gameCode); // for debugging
        const game = new Game(socket.id, gameCode);
        game.addPlayer(socket.id, playerName);

        games[gameCode] = game;
        socket.join(gameCode);

        // Emit the game code to the host player
        io.to(socket.id).emit("gameCreated", { gameCode });

        // After emitting the "gameCreated" event
        console.log("[server] gameCreated event emitted to host");
    });

    // Join an existing game
    socket.on("joinGame", ({ playerName, gameCode }) => {
        console.log("[server] joinGame event received");
        const game = games[gameCode];

        if (game) {
            // Check if the player's chosen name already exists among the current players
            const playerNameExists = game.playersArray().some((player) => player.name === playerName);

            // If the name exists, emit an error event to the joining player's socket
            if (playerNameExists) {
                socket.emit("error", { message: "This name is already taken. Please choose a different name." });
            } else {
                game.addPlayer(socket.id, playerName);
                socket.join(gameCode);

                io.to(socket.id).emit("gameJoined", { gameCode });
                io.to(game.hostId).emit("playerJoined", { playerId: socket.id, playerName });
            }
        } else {
            io.to(socket.id).emit("error", { message: "Game not found" });
        }

        // After emitting the "gameJoined" event
        console.log("[server] gameJoined event emitted to joining player");
    });

    // Start the game
    socket.on("startGame", (data) => {
        console.log('startGame event received:', data);
        const game = getGameByPlayerId(socket.id);
        if (game) {
            // Validate the number of rounds.
            if (data.numRounds && data.numRounds < 3) {
                socket.emit('error', { message: 'Minimum number of rounds is 3.' });
                return;
            }

            game.numRounds = data.numRounds || game.numRounds;
            game.startRound(traitGenerator);
            const players = game.playersArray().map(player => ({
                id: player.id,
                name: player.name,
                score: player.score
            }));
            io.to(game.code).emit("startRound", {
                trait: game.currentTrait,
                players,
                timeLeft: 30,
                round: game.currentRound,
            });
            io.to(game.code).emit("gameUpdated", { numRounds: game.numRounds });
            roundTimer(game, io, 30);
        }
    });

    // Vote for a player
    socket.on("submitVote", ({ votedPlayerId }) => {
        const game = getGameByPlayerId(socket.id);
        if (game) {
            game.voteForPlayer(socket.id, votedPlayerId);

            if (game.allPlayersVoted()) {
                clearTimeout(game.timer);
                endRound(game);
            }
        }
    });

    // Start the next round
    socket.on("startNextRound", () => {
        const game = getGameByPlayerId(socket.id);
        if (game) {
            if (!game.isGameOver()) {
                const newRoundData = game.startRound();
                const players = newRoundData.players.map((player) => ({
                    id: player.id,
                    name: player.name,
                    score: player.score,
                }));
                io.to(game.code).emit("startRound", {
                    trait: newRoundData.trait,
                    players,
                    timeLeft: 30,
                    round: game.currentRound,
                });
                roundTimer(game, io, 30);
            } else {
                let playerList = Object.values(game.players);
                io.to(game.code).emit("gameEnded", { players: playerList });
            }
        }
    });

    socket.on("showFinalResults", () => {
        socket.broadcast.emit("navigateToFinalResults");
    });

    socket.on("endGame", () => {
        const game = getGameByPlayerId(socket.id);
        if (game) {
            io.to(game.code).emit('finalResults', { players: game.players });
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

