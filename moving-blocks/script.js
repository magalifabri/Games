const playerBlock = document.createElement("div");
playerBlock.classList.add("player-block");
playerBlock.x = 0;
playerBlock.y = 0;
playerBlock.width = 50;
playerBlock.height = 50;
playerBlock.style.width = playerBlock.width + "px";
playerBlock.style.height = playerBlock.height + "px";
playerBlock.moveSpeed = 20;

const browserWindowWidth = window.innerWidth;
const browserWindowHeight = window.innerHeight;

const arenaDiv = document.querySelector(".arena");
arenaDiv.append(playerBlock);

window.addEventListener("keydown", move);



function moveX(block, amount) {
    if (block.x + amount < 0
    || block.x + block.width + amount > browserWindowWidth) {
        return ;
    }
    
    block.x += amount;
    block.style.left = `${block.x}px`;
}

function moveY(block, amount) {
    if (block.y + amount < 0
    || block.y + block.height + amount > browserWindowHeight) {
        return ;
    }

    block.y += amount;
    block.style.top = `${block.y}px`;
}

function move(event) {
    const pressedKey = event.key;
    
    switch (pressedKey) {
        case "w":
            moveY(playerBlock, -playerBlock.moveSpeed);
            break;
            
        case "a":
            moveX(playerBlock, -playerBlock.moveSpeed);
            break;
            
        case "s":
            moveY(playerBlock, playerBlock.moveSpeed);
            break;
            
        case "d":
            moveX(playerBlock, playerBlock.moveSpeed);
            break;
            
        default:
            break;
    }
}


const enemyBlock = document.createElement("div");
enemyBlock.classList.add("enemy-block");
enemyBlock.width = 50;
enemyBlock.height = 50;
enemyBlock.style.width = enemyBlock.width + "px";
enemyBlock.style.height = enemyBlock.height + "px";

enemyBlock.x = browserWindowWidth - enemyBlock.width;
enemyBlock.style.left = enemyBlock.x + "px";
enemyBlock.y = browserWindowHeight - enemyBlock.height;;
enemyBlock.style.top = enemyBlock.y + "px";
enemyBlock.moveSpeed = 20;

arenaDiv.append(enemyBlock);

function moveRandomly() {
    const randomNum = Math.floor(Math.random() * 4);

    switch (randomNum) {
        case 0:
            moveY(enemyBlock, -enemyBlock.moveSpeed);
            break;
        case 1:
            moveX(enemyBlock, -enemyBlock.moveSpeed);
            break;
        case 2:
            moveY(enemyBlock, enemyBlock.moveSpeed);
            break;
        case 3:
            moveX(enemyBlock, enemyBlock.moveSpeed);
            break;
    
        default:
            break;
    }
}

function chase() {
    const xDelta = enemyBlock.x - playerBlock.x;
    const yDelta = enemyBlock.y - playerBlock.y;
    
    if (Math.abs(xDelta) > Math.abs(yDelta)) {
        if (xDelta < 0) {
            moveX(enemyBlock, enemyBlock.moveSpeed)
        } else {
            moveX(enemyBlock, -enemyBlock.moveSpeed)
        }
    } else {
        if (yDelta < 0) {
            moveY(enemyBlock, enemyBlock.moveSpeed)
        } else {
            moveY(enemyBlock, -enemyBlock.moveSpeed)
        }
    }
}

function checkForContact() {
    if (Math.abs(playerBlock.x - enemyBlock.x) <= 30
    && Math.abs(playerBlock.y - enemyBlock.y) <= 30) {
        alert("contact");
    }
}

// setInterval(() => {
//     moveRandomly();
// }, 100);

setInterval(() => {
    chase();
    checkForContact();
}, 100);

// function getBrowserWindowWidth() {
//     return Math.max(
//         document.body.scrollWidth,
//         document.documentElement.scrollWidth,
//         document.body.offsetWidth,
//         document.documentElement.offsetWidth,
//         document.documentElement.clientWidth
//         );
// }

// function getBrowserWindowHeight() {
//     return Math.max(
//         document.body.scrollHeight,
//         document.documentElement.scrollHeight,
//         document.body.offsetHeight,
//         document.documentElement.offsetHeight,
//         document.documentElement.clientHeight
//         );
// }

// console.log('Width:  ' +  getWidth() );
  
// console.log('Height: ' + getHeight() );