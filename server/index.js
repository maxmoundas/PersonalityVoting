const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Game, Player } = require("./game");
const { generateGameCode, getGameByPlayerId } = require("./utils");

const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3001", // Set the origin to your client's address
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
});

// ... (Socket.IO connection and event handling code) ...
const { games } = require("./utils");

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    console.log("New client connected");

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
    });


    // Join an existing game
    socket.on("joinGame", ({ playerName, gameCode }) => {
        const game = games[gameCode];

        if (game) {
            game.addPlayer(socket.id, playerName);
            socket.join(gameCode);

            io.to(socket.id).emit("gameJoined", { gameCode });
            io.to(game.hostId).emit("playerJoined", { playerId: socket.id, playerName });
        } else {
            io.to(socket.id).emit("error", { message: "Game not found" });
        }
    });

    // Start the game
    socket.on("startGame", (traitGenerator) => {
        const game = getGameByPlayerId(socket.id);
        if (game) {
            game.startRound(traitGenerator);
            io.to(game.code).emit("roundStarted", { round: game.currentRound, trait: game.currentTrait });
        }
    });

    // Vote for a player
    socket.on("submitVote", ({ votedPlayerId }) => {
        const game = getGameByPlayerId(socket.id);
        if (game) {
            game.voteForPlayer(socket.id, votedPlayerId);

            if (game.allPlayersVoted()) {
                if (!game.isGameOver()) {
                    game.startRound(); // Add a traitGenerator function here
                    io.to(game.code).emit("roundStarted", { round: game.currentRound, trait: game.currentTrait });
                } else {
                    io.to(game.code).emit("gameEnded", { players: game.players });
                }
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
