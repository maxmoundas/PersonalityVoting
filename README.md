# PersonalityVoting
Personality Voting is a fun and interactive multiplayer game where players vote on what players personalities line up most closely with randomly generated traits. The game consists of 5 rounds, and at the end of each round, players will see the results and start the next round. After the final round, players will be presented with the final results. This application is still a work in progress.

# How to Play
1. Host a game: Enter your name and click the "Host Game" button. You will be provided with a unique game code to share with other players.
2. Join a game: Enter your name and click the "Join Game" button. Enter the game code provided by the host and join the game.
3. Wait for the game to start: Once all players have joined, the host can start the game by clicking the "Start Game" button.
4. Vote on each other's personalities: In each round, players will be presented with a randomly generated trait. Players must vote for the person they think best fits the given trait.
5. Round results: At the end of each round, players will be shown the round results, including the top players and the number of votes they received.
6. Start the next round: The host can start the next round by clicking the "Start Next Round" button.
7. Final results: After the final round, players will be shown the final results, displaying the overall top players.

# Application Structure
- App.js: The main React component that handles the game states, renders different game components, and communicates with the game server using Socket.IO.
- components/: Contains various React components for different game stages, such as HostGame, JoinGame, Waiting, GameRound, and FinalResults.
- server/index.js: Sets up the Socket.IO client for real-time communication with the game server.
- components/Game.js: A class-based implementation of the game logic, including player management, round handling, and voting.

# Technologies Used
- Language: JavaScript
- Frontend Framework: React.js
- State Management: React hooks (useState, useEffect)
- Real-time Communication: Socket.IO
- Backend: Node.js and Express.js
- Styling: CSS
- Package Manager: npm
- Development Server: React development server (provided by Create React App)
