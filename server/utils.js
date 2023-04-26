const games = {};

const traitGenerator = () => {
    // Implement your trait generator logic here
};

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

module.exports = {
    games,
    generateGameCode,
    getGameByPlayerId,
    traitGenerator
};
