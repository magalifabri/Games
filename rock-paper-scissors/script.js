const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

const playerChoiceP = document.querySelector(".player-choice");
const pcChoiceP = document.querySelector(".pc-choice");
const resultP = document.querySelector(".result");
let playerChoice;

const playerButtons = document.querySelectorAll(".player-button");
playerButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerChoice = button.classList[1];
        playerChoiceP.textContent = `your choice: ${playerChoice}`;
    })
})

const playButton = document.querySelector(".play");
playButton.addEventListener("click", () => {
    const randomNumber = Math.floor(Math.random() * 3);
    let pcChoice = ROCK;
    if (randomNumber === 1) {
        pcChoice = PAPER
    } else if (randomNumber === 2) {
        pcChoice = SCISSORS
    }
    pcChoiceP.textContent = `pc's choice: ${pcChoice}`;

    let msg;
    if (playerChoice === pcChoice) {
        msg = `tie`;
    } else if ((playerChoice === ROCK && pcChoice === SCISSORS)
    || (playerChoice === PAPER && pcChoice === SCISSORS)
    || (playerChoice === SCISSORS && pcChoice === ROCK)) {
            msg = "you win";
    } else {
        msg = "you lose";
    }

    resultP.textContent = msg;

    playButton.textContent = "play again";
});
