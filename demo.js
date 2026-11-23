import { DemoGame } from "./quiz.mjs";

const get = (id) => document.getElementById(id);
const form = get("chat");
let game;
let refreshId;
let renderedRound;

function listItem(text) {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
}

function render() {
    const state = game.view(performance.now());
    const guessing = state.phase === "guess";
    const finished = state.phase === "finished";
    if (renderedRound !== state.round) get("notice").textContent = "";
    renderedRound = state.round;
    get("round").textContent = "Round " + state.round + " / " + state.rounds;
    get("clock").textContent = guessing ? state.seconds + "s" : finished ? "Final scores" : "Answer revealed";
    get("progress").value = state.seconds;
    get("progress").hidden = !guessing;
    get("word").textContent = state.label;
    get("clues").replaceChildren(...state.clues.map(listItem));
    get("leaderboard").hidden = state.scores.length === 0;
    get("scores").replaceChildren(...state.scores.map(([name, points]) => {
        const item = listItem(name);
        const total = document.createElement("strong");
        total.textContent = points + " pts";
        item.append(total);
        return item;
    }));
    get("guess").disabled = form.querySelector("button").disabled = !guessing;
    get("rose").hidden = !game.roseMode;
    get("rose").disabled = !guessing || state.clues.length === 3;
    if (finished) { clearInterval(refreshId); get("rose-mode").disabled = false; }
}

get("theme").onchange = (event) => { get("board").dataset.theme = event.target.value; };
get("start").onclick = () => {
    clearInterval(refreshId);
    game = new DemoGame(performance.now(), get("rose-mode").checked);
    get("rose-mode").disabled = true;
    get("start").textContent = "Restart demo";
    renderedRound = undefined;
    render();
    get("guess").focus();
    refreshId = setInterval(render, 1000);
};
get("rose").onclick = () => {
    game.tick(performance.now());
    if (game.rose()) get("notice").textContent = "Rose simulated. A new clue is on the board.";
    render();
};
form.onsubmit = (event) => {
    event.preventDefault();
    get("notice").textContent = game.guess(get("guess").value, performance.now());
    get("guess").value = "";
    render();
};
