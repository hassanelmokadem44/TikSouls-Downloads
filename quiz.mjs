const puzzles = [
    ["Firefly", ["I usually come out after sunset.", "My glow is a signal.", "I am a beetle that lights up the night."]],
    ["Telescope", ["I make distant things look closer.", "I use carefully arranged lenses.", "I help you see planets and stars."]],
    ["Hourglass", ["I measure something you cannot hold.", "You turn me over to start again.", "Sand falls through my narrow middle."]],
];
const bots = ["Nova", "Wren", "Kai"];

export class DemoGame {
    constructor(now, roseMode) {
        this.deck = [...puzzles].sort(() => Math.random() - 0.5);
        this.roseMode = roseMode;
        this.index = 0;
        this.since = now;
        this.phase = "guess";
        this.nClues = 1;
        this.scores = new Map();
        this.correct = new Set();
    }

    addPoint(name) {
        if (this.correct.has(name)) return;
        const points = this.correct.size === 0 ? 3 : 1;
        this.correct.add(name);
        this.scores.set(name, (this.scores.get(name) || 0) + points);
        return points;
    }

    tick(now) {
        const elapsed = (now - this.since) / 1000;
        if (this.phase === "guess") {
            if (!this.roseMode) this.nClues = Math.min(3, 1 + Math.floor(elapsed / 20));
            for (const [index, bot] of bots.entries()) {
                if (elapsed >= 22 + index * 9) this.addPoint(bot);
            }
            if (elapsed >= 60) {
                this.phase = "reveal";
                this.since = now;
            }
        } else if (this.phase === "reveal" && elapsed >= 4) {
            if (this.index === this.deck.length - 1) this.phase = "finished";
            else {
                this.index++;
                this.since = now;
                this.phase = "guess";
                this.nClues = 1;
                this.correct.clear();
            }
        }
    }

    rose() {
        if (!this.roseMode || this.phase !== "guess" || this.nClues >= 3) return false;
        this.nClues++;
        return true;
    }

    guess(value, now) {
        this.tick(now);
        if (this.phase !== "guess") return "Wait for the next round.";
        if (this.correct.has("You")) return "You already scored this round.";
        if (value.trim().toLowerCase() !== this.deck[this.index][0].toLowerCase()) return "Try another word.";
        return "Correct! +" + this.addPoint("You") + " points.";
    }

    view(now) {
        this.tick(now);
        const [answer, clues] = this.deck[this.index];
        const guessing = this.phase === "guess";
        return {
            phase: this.phase, round: this.index + 1, rounds: this.deck.length,
            seconds: guessing ? Math.max(0, Math.ceil(60 - (now - this.since) / 1000)) : 0,
            label: guessing ? answer.length + " letters" : answer,
            clues: clues.slice(0, guessing ? this.nClues : 3),
            scores: [...this.scores].sort((left, right) => right[1] - left[1]),
        };
    }
}
