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

// ... Add other game-related action creators
