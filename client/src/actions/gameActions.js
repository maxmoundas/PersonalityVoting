export const createGame = (playerName) => ({
    type: "CREATE_GAME",
    payload: { playerName },
});

export const joinGame = (playerName, gameCode) => ({
    type: "JOIN_GAME",
    payload: { playerName, gameCode },
});

export const setGameState = (gameState) => ({
    type: "SET_GAME_STATE",
    payload: { gameState },
});

export const startGame = (traitGenerator) => ({
    type: "START_GAME",
    payload: { traitGenerator },
});

export const submitVote = (votedPlayerId) => ({
    type: "SUBMIT_VOTE",
    payload: { votedPlayerId },
});

export const gameEnded = (players) => ({
    type: "GAME_ENDED",
    payload: { players },
});

export const playerJoined = (playerId, playerName) => ({
    type: "PLAYER_JOINED",
    payload: { playerId, playerName },
});

export const roundStarted = (round, trait) => ({
    type: "ROUND_STARTED",
    payload: { round, trait },
});
