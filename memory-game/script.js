const images = [
    "./images/apple.png",
    // "./images/carrot.png",
    // "./images/grapes.png",
    // "./images/orange.png",
    // "./images/salad.png",
    // "./images/broccoli.png",
    // "./images/cheese.png",
    // "./images/groceries.png",
    // "./images/salad-bowl.png",
    // "./images/tomato.png"
];
const flippedImageNodes = [];
const permaFlippedImageNodes = [];
const players = [
    "player-1",
    "player-2"
];
let playerNum = 0;

function shuffleImages() {
    for (child of imageWrapper.children) {
        const randNum = Math.floor(Math.random() * images.length);
        imageWrapper.insertBefore(child, imageWrapper.children[randNum]);
    }
}

function switchPlayer() {
    playerNum++;
    if (playerNum === players.length) {
        playerNum = 0;
    }

    // change background color of body
    for (const player of players) {
        document.body.classList.remove(player);
    }
    document.body.classList.add(players[playerNum]);

    const playerTurnTndication = document.querySelector(".player-turn-indication");
    playerTurnTndication.textContent = `Turn: ${players[playerNum]}`
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function turnBackAround() {
    await sleep(1000);
    for (image of flippedImageNodes) {
        image.classList.toggle("upside-down");
    }
    flippedImageNodes.pop();
    flippedImageNodes.pop();
}

function win() {
    const winDiv = document.querySelector(".win");
    winDiv.classList.add("active");
    
    const player1Score = document.querySelectorAll("img.player-1").length;
    const player2Score = document.querySelectorAll("img.player-2").length;
    const winDivP = document.querySelector(".score");
    winDivP.innerHTML = `<b>Score</b>:<br>- player-1: ${player1Score}<br>- player-2: ${player2Score}`;

}

function compareImages() {
    if (flippedImageNodes[0] === flippedImageNodes[1]) {
        console.log("yes");
    }
    return (flippedImageNodes[0].getAttribute("data-images-array-index")
    === flippedImageNodes[1].getAttribute("data-images-array-index"));
}

function check(event) {
    // don't allow the checking of already upside up images, more than 2 at a time, or the same square
    if (permaFlippedImageNodes.includes(event.target)
    || flippedImageNodes.length === 2
    || event.target === flippedImageNodes[0]) {
        return ;
    }
    
    // remove upside-side down class to show the image
    event.target.classList.toggle("upside-down");
    // keep track of showed images, to know how many are showed
    flippedImageNodes.push(event.target);
    // if only one image is being showed, do nothing until another turned
    // if two images are being shown, compare them
    if (flippedImageNodes.length === 2) {
        if (compareImages() === true) {
            // if they are the same, keep them flipped and allow more images to be flipped
            // assign 
            flippedImageNodes[0].classList.add(players[playerNum]);
            flippedImageNodes[1].classList.add(players[playerNum]);
            permaFlippedImageNodes.push(flippedImageNodes.pop());
            permaFlippedImageNodes.push(flippedImageNodes.pop());
            // check if all images have been turned
            if (permaFlippedImageNodes.length === images.length * 2) {
                win();
            }
        } else {
            turnBackAround();
            switchPlayer();
        }
    }
}

const imageWrapper = document.querySelector(".image-wrapper");
function insertImages() {
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const newImgElem = document.createElement("img");
        newImgElem.classList.add("upside-down");
        newImgElem.setAttribute("src", image);
        newImgElem.setAttribute("data-images-array-index", i);
        newImgElem.addEventListener("click", check);
        imageWrapper.append(newImgElem);
    }
}

function addDescriptionToPage() {
    const descriptionP = document.querySelector(".description");
    descriptionP.textContent = `${images.length} pairs of cards are placed face down and in a random order. Can you find all the matching pairs? Turn around 2 cards at a time. If they match, they stay face-up. Otherwise they turn back around. So you have to use your memory to select matching pairs as quickly as possible.`;
}

addDescriptionToPage();
insertImages();
insertImages();
shuffleImages();

// To keep track of which player turned around which pairs of cards, the cards are given a class corresponding to the player who turned them over.

// When a non-matching pair of cards is turned over, they are automatically turned around again after a specified duration of time. See function sleep().