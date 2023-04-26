class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.votes = 0;
    }
}

function traitGenerator() {
    const traits = ["Trait1", "Trait2", "Trait3", "Trait4", "Trait5"];
    const randomIndex = Math.floor(Math.random() * traits.length);
    return traits[randomIndex];
}

class Game {
    constructor(hostId, code) {
        this.hostId = hostId;
        this.code = code;
        this.players = [];
        this.currentRound = 0;
        this.currentTrait = "";
    }

    playersArray() {
        return Object.values(this.players);
    }

    addPlayer(playerId, playerName) {
        this.players[playerId] = new Player(playerId, playerName);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }

    startRound() {
        this.currentRound += 1;
        this.currentTrait = traitGenerator();
        this.resetPlayerVotes();
        return { trait: this.currentTrait, players: Object.values(this.players) };
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
