// goal: higher than dealer, <= 21

// 2-10 face value
// jack, queen, king, 10
// ace is 1 or 11 (player's choice)

// round:
// everyone places bet

// const userBet = +prompt("Place your bet") || 10;
// clubs (♣), diamonds (♦), hearts (♥) and spades (♠)

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

function getCard() {
    const alreadyUsedNums = [];
    let randNum = Math.floor(Math.random() * 52);
    while (alreadyUsedNums.includes(randNum)) {
        randNum = Math.floor(Math.random() * 52);
    }
    alreadyUsedNums.push(randNum);
    
    const cardType = cardTypes[randNum % 4];
    const cardRank = (randNum % 13) + 1;
    
    return [cardType, cardRank];
}

function getNewCardLi(newCard, face) {
    const newCardLi = document.createElement("li");
    newCardLi.classList.add(face);
    // console.log("newCard[1]: " + newCard[1]);
    // console.log("cardRanks[newCard[1]]: " + cardRanks[newCard[1]]);
    newCardLi.textContent = cardRanks[newCard[1]] + " of " + newCard[0];

    return (newCardLi);
}

function dealCard(hand, cardsUl, face) {
    const newCard = getCard();
    hand.push(newCard);
    cardsUl.append(getNewCardLi(newCard, face));
}

function setTotal(hand, totalP) {
    let total = 0;
    hand.numAces = 0;

    for (card of hand) {
        if (card[1] > 10) {
            total += 10;
        } else {
            total += card[1];
        }

        // take note of aces
        if (card[1] === 1) {
            hand.numAces++;
        }
    }
    // dynamically value the ace
    for (let i = 0; i < hand.numAces; i++) {
        if (total <= 11) {
            total += 10;
        }
    }

    totalP.textContent = "total: " + total;

    return (total);
}

function hit() {
    dealCard(handPlayer, playerCardsUl, FACE_UP);

    const total = setTotal(handPlayer, playerTotalP);

    if (total > 21) {
        alert(`BUST! (Your total is ${total})`);
        balance = -bet;
        endRound();
    }
}

function stay() {
    proposeHit = false;
    // end of round: dealer flips face down card
    dealerCardsUl.children[1].classList.remove(FACE_DOWN);
    let dealerTotal = setTotal(handDealer, dealerTotalP);

    // if total <= 16: take another card ("hit")
    // if total >= 17: stay with hand ("stay")
    while (dealerTotal <= 16) {
        dealCard(handDealer, dealerCardsUl, FACE_UP);
        dealerTotal = setTotal(handDealer, dealerTotalP);
        
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
    const playerTotal = setTotal(handPlayer, playerTotalP);
    if (playerTotal > dealerTotal) {
        alert(`YOU WIN! (You have ${playerTotal}; Dealer has ${dealerTotal})`);
        balance = bet * 2;
    } else {
        alert(`You Lose. (You have ${playerTotal}; Dealer has ${dealerTotal})`);
        balance = -bet;
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

const playButton = document.querySelector("button.play");
playButton.addEventListener("click", play);

let bet;
let balance = 0;
let totalBalance = 0;
const handPlayer = [];
const handDealer = [];
const playerCardsUl = document.querySelector(".player .cards");
const dealerCardsUl = document.querySelector(".dealer .cards");
const playerTotalP = document.querySelector(".player .total");
const dealerTotalP = document.querySelector(".dealer .total");

let proposeHit = true;
const hitButton = document.querySelector("button.hit");
hitButton.addEventListener("click", hit);

const stayButton = document.querySelector("button.stay");
stayButton.addEventListener("click", stay)

function endRound() {
    dealerCardsUl.children[1].classList.remove(FACE_DOWN);
    updateLog();
    document.querySelector(".loader").classList.add("active");
    setTimeout(() => {
        reset();
        document.querySelector(".loader").classList.remove("active");
        playButton.classList.toggle("active");
    }, 3000);
}

function setUp() {
    // player places bets
    bet = +prompt("Place your bet", 10) || 10;

    const playersBetSpan = document.querySelector(".players-bet span");
    playersBetSpan.textContent += bet;

    // dealer deals 1 card face up to everyone, inc self
    dealCard(handPlayer, playerCardsUl, FACE_UP);
    dealCard(handDealer, dealerCardsUl, FACE_UP);

    // dealer deals 1 card face up to everyone, ex self
    dealCard(handPlayer, playerCardsUl, FACE_UP);
    // console.log(handPlayer);

    // dealer deals 1 card face down to self
    dealCard(handDealer, dealerCardsUl, FACE_DOWN);
    // console.log(handDealer);

    // if a player's 2 face up cards total 21, auto win: 1.5x bet from dealer; done for the round
    const playerTotal = setTotal(handPlayer, playerTotalP);
    if (playerTotal >= 21) {
        balance = bet * 1.5;
        alert(`YOU WIN! (You have ${playerTotal})`);
        endRound();
    }
}

function reset() {
    while (handPlayer.pop());
    while (handDealer.pop());
    
    // handPlayer.numAces = 0;
    // handDealer.numAces = 0;

    handPlayer.increasedBy10 = false;
    handDealer.increasedBy10 = false;
    
    playerCardsUl.innerHTML = "";
    dealerCardsUl.innerHTML = "";

    playerTotalP.innerHTML = "";
    dealerTotalP.innerHTML = "";

    hitButton.classList.remove("active");
    stayButton.classList.remove("active");
}

function play() {
    // reset();
    playButton.classList.toggle("active");

    setUp();
    
    hitButton.classList.toggle("active");
    stayButton.classList.toggle("active");
}

// else: want another card?
//     while yes ("hit")
//         if new total is > 21, "bust": dealer gets your bet
//     no: "stay"


