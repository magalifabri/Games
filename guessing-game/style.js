const randomNumber = Math.ceil(Math.random() * 21);

let userInput;
const inputField = document.querySelector("#guess");
inputField.addEventListener("change", event => {
    userInput = event.target.valueAsNumber;
});

const playButton = document.querySelector("#play");
playButton.addEventListener("click", () => {
    if (randomNumber === userInput) {
        alert(`Awesome! You number ${userInput} was correct. You can be named many things, hungry not being one of them.`);
    } else if (randomNumber + 1 === userInput
    || randomNumber - 1 === userInput) {
        alert(`So close, but you just missed it! Are you in a class that started on the thirteenth or what?`)
    } else {
        alert(`Bummer... You guessed ${userInput} and the secret number was ${randomNumber}.`);
    }
});
