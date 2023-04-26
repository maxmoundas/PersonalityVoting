class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.votes = 0;
    }
}

class Game {
    constructor(hostId, code) {
        this.hostId = hostId;
        this.code = code;
        this.players = {};
        this.currentRound = 0;
        this.currentTrait = "";
    }

    addPlayer(playerId, playerName) {
        this.players[playerId] = new Player(playerId, playerName);
    }

    startRound(traitGenerator) {
        this.currentRound += 1;
        this.currentTrait = traitGenerator();
        this.resetPlayerVotes();
    }

    resetPlayerVotes() {
        for (const player of Object.values(this.players)) {
            player.votes = 0;
        }
    }

    voteForPlayer(voterId, votedPlayerId) {
        if (this.players[voterId] && this.players[votedPlayerId]) {
            this.players[votedPlayerId].votes += 1;
            return true;
        }
        return false;
    }

    allPlayersVoted() {
        const totalVotes = Object.values(this.players).reduce(
            (sum, player) => sum + player.votes,
            0
        );
        return totalVotes >= Object.keys(this.players).length * this.currentRound;
    }

    isGameOver() {
        return this.currentRound >= 5;
    }
}

module.exports = { Player, Game };
