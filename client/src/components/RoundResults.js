import React from 'react';

function RoundResults({ currentRound, resultsCountdown, votingResults, isHost, isFinalRound, handleFinalResults, handleStartNextRound }) {
    // Sort the voting results in descending order of votes.
    const sortedVotingResults = [...votingResults].sort((a, b) => b.votes - a.votes);

    // Find the maximum number of votes.
    const maxVotes = sortedVotingResults[0]?.votes || 0;

    // Filter the array to get only the players who have the max number of votes.
    const topPlayers = sortedVotingResults.filter(player => player.votes === maxVotes);

    let rank = 0;
    let lastVotes = null;

    return (
        <div>
            <h1>Round {currentRound} Results</h1>
            <h2>Time left: {resultsCountdown} seconds</h2>
            <h2>Player with most votes:</h2>
            {topPlayers.map((player, index) => (
                <p key={player.id}>
                    {index > 0 && " and "}
                    {player.name} - {player.votes} votes
                </p>
            ))}
            <h2>Top Players:</h2>
            <ul>
                {sortedVotingResults.map((player) => {
                    // Increase rank if this player has fewer votes than the last player
                    if (player.votes !== lastVotes) {
                        rank++;
                    }

                    lastVotes = player.votes;

                    return (
                        <li key={player.id}>
                            {player.votes === maxVotes && sortedVotingResults.filter(({ votes }) => votes === maxVotes).length > 1 && "Tied-"}
                            {rank}. {player.name} - {player.votes} votes
                        </li>
                    );
                })}
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
