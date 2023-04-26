/*
client/src/reducers/gameReducer.js: This file contains the Redux reducer function 
that updates the game state in the Redux store based on the actions dispatched.
*/

const initialState = {
    gameState: "create_or_join",
    gameCode: "",
    round: 0,
    trait: "",
    players: {},
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_GAME_STATE":
            return { ...state, gameState: action.payload.gameState };
        case "SET_GAME_CODE":
            return { ...state, gameCode: action.payload.gameCode };
        // ... Add other game-related state changes
        default:
            return state;
    }
};

export default gameReducer;
