const http = require("http");
const socketIo = require("socket.io");
const { Game, Player } = require("../client/src/components/Game");
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
            game.addPlayer(socket.id, playerName);
            socket.join(gameCode);

            io.to(socket.id).emit("gameJoined", { gameCode });
            io.to(game.hostId).emit("playerJoined", { playerId: socket.id, playerName });
        } else {
            io.to(socket.id).emit("error", { message: "Game not found" });
        }

        // After emitting the "gameJoined" event
        console.log("[server] gameJoined event emitted to joining player");
    });

    // Start the game
    socket.on("startGame", () => {
        const game = getGameByPlayerId(socket.id);
        if (game) {
            game.startRound(traitGenerator);
            const players = game.playersArray().map(player => ({
                id: player.id,
                name: player.name,
                score: player.score
            }));
            io.to(game.code).emit("startRound", { trait: game.currentTrait, players });
        }
    });

    // Vote for a player
    socket.on("submitVote", ({ votedPlayerId }) => {
        const game = getGameByPlayerId(socket.id);
        if (game) {
            game.voteForPlayer(socket.id, votedPlayerId);

            if (game.allPlayersVoted()) {
                if (!game.isGameOver()) {
                    game.startRound(traitGenerator);
                    const players = game.playersArray().map(player => ({
                        id: player.id,
                        name: player.name,
                        score: player.score
                    }));
                    io.to(game.code).emit("startRound", { trait: game.currentTrait, players });
                } else {
                    io.to(game.code).emit("gameEnded", { players: game.players });
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

