import React from "react";

function RoundResults({ currentRound, resultsCountdown, votingResults, isHost, isFinalRound, handleFinalResults, handleStartNextRound }) {
    return (
        <div>
            <h1>Round {currentRound} Results</h1>
            <h2>Time left: {resultsCountdown} seconds</h2>
            <h2>Player with most votes:</h2>
            {votingResults[0] && (
                <p>
                    {votingResults[0].name} - {votingResults[0].votes} votes
                </p>
            )}
            <h2>Top Players:</h2>
            <ul>
                {votingResults.map((player, index) => (
                    <li key={player.id}>
                        {index + 1}. {player.name} - {player.votes} votes
                    </li>
                ))}
            </ul>
            {isHost && (
                <button
                    onClick={isFinalRound ? handleFinalResults : handleStartNextRound}>
                    {isFinalRound ? "Go to Final Results" : "Start Next Round"}
                </button>
            )}
        </div>
    );
}

export default RoundResults;
