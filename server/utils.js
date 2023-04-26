/*
server/utils.js: This file contains utility functions such as generateGameCode 
to generate unique game codes and getGameByPlayerId to find a game by a player's 
ID. It also maintains the games object, which stores active games in the server memory.
*/

const games = {};

function generateGameCode() {
    let gameCode = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;

    for (let i = 0; i < 4; i++) {
        gameCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    // Ensure the generated game code is unique
    while (games.hasOwnProperty(gameCode)) {
        gameCode = generateGameCode();
    }

    return gameCode;
}

function getGameByPlayerId(playerId) {
    return Object.values(games).find((game) => game.players.hasOwnProperty(playerId));
}

module.exports = { generateGameCode, getGameByPlayerId, games };
