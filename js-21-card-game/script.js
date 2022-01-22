const cardTypes = [
    "Clubs",
    "Diamonds",
    "Hearts",
    "Spades"
];
const cardRanks = [
    "",
    "Ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King"
];

const FACE_UP = "face-up";
const FACE_DOWN = "face-down";

let bet;
let balance = 0;
let totalBalance = 0;
const alreadyUsedNums = [];
const playerHand = [];
const dealerHand = [];

const playButton = document.querySelector("button.play");
const hitButton = document.querySelector("button.hit");
const stayButton = document.querySelector("button.stay");

const playersBetP = document.querySelector(".players-bet");
const playerCardsDiv = document.querySelector(".player .cards");
const dealerCardsDiv = document.querySelector(".dealer .cards");
const playerTotalP = document.querySelector(".player .total");
const dealerTotalP = document.querySelector(".dealer .total");
const suitIcons = document.querySelector(".suit-icons");
const h1 = document.querySelector("h1");
const wrapperCardsTotal = document.querySelectorAll(".wrapper-cards-total");

playButton.addEventListener("click", startRound);
hitButton.addEventListener("click", hit);
stayButton.addEventListener("click", stay);
window.addEventListener("keydown", checkKeyPress);


function checkKeyPress(event) {
    if (event.key === "Enter"
    && playButton.classList.contains("visible")) {
        startRound();
    } else if (event.key === "Enter"
    && hitButton.classList.contains("visible")) {
        hit();
    } else if (event.key === "s"
    && stayButton.classList.contains("visible")) {
        stay();
    }
}

function getFormattedCardName(card) {
    const name = `${cardRanks[card[1]]} of ${card[0]}`;
    return (name);
}

function getCardImageName(card) {
    const name = `./images/${cardRanks[card[1]]}_of_${card[0]}.svg`.toLowerCase();
    return (name);
}

function getCard() {
    let randNum = Math.floor(Math.random() * 52);
    while (alreadyUsedNums.includes(randNum)) {
        randNum = Math.floor(Math.random() * 52);
    }
    alreadyUsedNums.push(randNum);
    
    const cardType = cardTypes[randNum % 4];
    const cardRank = (randNum % 13) + 1;
    
    return [cardType, cardRank];
}

function getNewCardImg(newCard, face) {
    const newImg = document.createElement("img");

    if (face === FACE_UP) {
        newImg.setAttribute("src", getCardImageName(newCard));
    } else {
        newImg.setAttribute("src", "./images/card_back.svg");
    }
    newImg.classList.add("card-image");

    return (newImg);
}

function dealCard(hand, cardsUl, face) {
    const newCard = getCard();
    hand.push(newCard);
    cardsUl.append(getNewCardImg(newCard, face));
}

function getAndPrintTotal(hand, totalP) {
    let total = 0;
    hand.numAces = 0;

    for (card of hand) {
        if (card[1] > 10) {
            total += 10;
        } else {
            total += card[1];
        }

        // count aces
        if (card[1] === 1) {
            hand.numAces++;
        }
    }
    // dynamically value aces
    for (let i = 0; i < hand.numAces; i++) {
        if (total <= 11) {
            total += 10;
        }
    }

    totalP.innerHTML = `<b>Total: ${total}</b>`;

    return (total);
}

function hit() {
    dealCard(playerHand, playerCardsDiv, FACE_UP);

    const total = getAndPrintTotal(playerHand, playerTotalP);

    if (total > 21) {
        alert(`BUST! (Your total is ${total})`);
        balance = -bet;
        endRound();
    } else if (playerHand.length === 5) {
        alert(`5-CARD-CHARLIE! (You have 5 cards without busting)`);
        balance = bet * 2;
        endRound();
    }
}

function stay() {
    // end of round: dealer flips face down card
    dealerCardsDiv.children[1].classList.remove(FACE_DOWN);
    let dealerTotal = getAndPrintTotal(dealerHand, dealerTotalP);
    alert(`Dealer flipped face-down card: ${getFormattedCardName(dealerHand[1])}.\nDealer's total is ${dealerTotal}.`);

    // if total <= 16: take another card ("hit")
    // if total >= 17: stay with hand ("stay")
    while (dealerTotal <= 16) {
        dealCard(dealerHand, dealerCardsDiv, FACE_UP);
        dealerTotal = getAndPrintTotal(dealerHand, dealerTotalP);
        alert(`Dealer hit: ${getFormattedCardName(dealerHand[dealerHand.length - 1])}.\nDealer's total is ${dealerTotal}.`)
        
        // if new total > 21, "bust": everybody still in round wins 2x bet
        if (dealerTotal > 21) {
            alert(`YOU WIN! (Dealer busted with ${dealerTotal})`);
            balance = bet * 2;
            endRound();
            return ;
        }
    }

    // everybody with a higher total than the dealer wins 2x their bet
    // others lose their bet
    const playerTotal = getAndPrintTotal(playerHand, playerTotalP);
    if (playerTotal > dealerTotal) {
        alert(`YOU WIN! (You have ${playerTotal}; Dealer has ${dealerTotal})`);
        balance = bet * 2;
    } else if (playerTotal < dealerTotal) {
        alert(`You Lose. (You have ${playerTotal}; Dealer has ${dealerTotal})`);
        balance = -bet;
    } else {
        alert(`Tie. (You and Dealer both have ${playerTotal})`);
        balance = 0;
    }
    endRound();
}

function updateLog() {
    totalBalance += balance;
    const balanceP = document.querySelector(".balance span");
    balanceP.textContent = totalBalance;
    
    const logUl = document.querySelector(".log");
    const newLi = document.createElement("li");
    newLi.textContent = balance;
    logUl.append(newLi);
}

function resetVars() {
    while (alreadyUsedNums.pop());

    while (playerHand.pop());
    while (dealerHand.pop());
    
    playerHand.increasedBy10 = false;
    dealerHand.increasedBy10 = false;

    playersBetP.textContent = "";
    
    playerCardsDiv.innerHTML = "";
    dealerCardsDiv.innerHTML = "";

    playerTotalP.innerHTML = "";
    dealerTotalP.innerHTML = "";
}

function endRound() {
    hitButton.classList.remove("visible");
    stayButton.classList.remove("visible");

    // reveal dealer's face-down card
    dealerCardsDiv.children[1].setAttribute("src", getCardImageName(dealerHand[1]));

    updateLog();
    h1.classList.add("highlight-animation");
    suitIcons.classList.add("wait-animation");
    wrapperCardsTotal.forEach(wrapper => wrapper.classList.add("fade-out"));
    setTimeout(() => {
        resetVars();
        h1.classList.remove("highlight-animation");
        suitIcons.classList.remove("wait-animation");
        wrapperCardsTotal.forEach(wrapper => wrapper.classList.remove("fade-out"));
        playButton.classList.add("visible");
    }, 3000);
}

function initialDeal() {
    // dealer deals 1 card face up to everyone, inc self
    dealCard(playerHand, playerCardsDiv, FACE_UP);
    dealCard(dealerHand, dealerCardsDiv, FACE_UP);

    // dealer deals 1 card face up to everyone, ex self
    dealCard(playerHand, playerCardsDiv, FACE_UP);

    // dealer deals 1 card face down to self
    dealCard(dealerHand, dealerCardsDiv, FACE_DOWN);
}

function getValidBet() {
    let validBetGiven = false;

    while (validBetGiven === false) {
        bet = +prompt("Place your bet (min. 1)", 10);
        if (bet >= 1)
            validBetGiven = true;
    }
}

function startRound() {
    playButton.classList.remove("visible");

    // player places bets
    getValidBet();

    playersBetP.innerHTML = `<b>Your bet: ${bet}</b>`;

    initialDeal();

    dealerTotalP.innerHTML = `<b>Total: ?</b>`;
    
    // if a player's 2 face up cards total 21, auto win: 1.5x bet from dealer; done for the round
    const playerTotal = getAndPrintTotal(playerHand, playerTotalP);
    if (playerTotal === 21) {
        balance = bet * 1.5;
        alert(`BLACKJACK!`);
        endRound();
        return ;
    }

    hitButton.classList.add("visible");
    stayButton.classList.add("visible");
}
