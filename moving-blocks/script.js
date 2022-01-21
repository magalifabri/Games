const arenaDiv = document.querySelector(".arena");
const playerBlock = document.createElement("div");
const enemyBlock1 = document.createElement("div");
const enemyBlock2 = document.createElement("div");
const enemyBlock3 = document.createElement("div");

const browserWindowWidth = window.innerWidth;
const browserWindowHeight = window.innerHeight;

window.addEventListener("keydown", move);


// PLAYER MOVEMENT

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


// ENEMY MOVEMENT

function moveInRandomDirection(block) {
    checkForContact(block);
    
    const randomNum = Math.floor(Math.random() * 4);
    switch (randomNum) {
        case 0:
            moveY(block, -block.moveSpeed);
            break;
        case 1:
            moveX(block, -block.moveSpeed);
            break;
        case 2:
            moveY(block, block.moveSpeed);
            break;
        case 3:
            moveX(block, block.moveSpeed);
            break;
    
        default:
            break;
    }
    checkForContact(block);
}

function moveCloser(block) {
    const xDelta = block.x - playerBlock.x;
    const yDelta = block.y - playerBlock.y;
    
    if (Math.abs(xDelta) > Math.abs(yDelta)) {
        if (xDelta < 0) {
            moveX(block, block.moveSpeed)
        } else {
            moveX(block, -block.moveSpeed)
        }
    } else {
        if (yDelta < 0) {
            moveY(block, block.moveSpeed)
        } else {
            moveY(block, -block.moveSpeed)
        }
    }
}

function checkForContact(block) {
    if (Math.abs(playerBlock.x - block.x) <= 30
    && Math.abs(playerBlock.y - block.y) <= 30) {
        alert("contact");
    }
}

function wander(block) {
    setInterval(() => {
        moveInRandomDirection(block);
        checkForContact(block);
    }, 100);
}

function chase(block) {
    setInterval(() => {
        moveCloser(block);
        checkForContact(block);
    }, 100);
}


// BLOCK CREATION

function createEnemyBlock(block, size, speed, movement) {
    block.classList.add("enemy-block");
    block.width = size;
    block.height = size;
    block.style.width = block.width + "px";
    block.style.height = block.height + "px";
    block.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    
    block.x = browserWindowWidth - block.width;
    block.style.left = block.x + "px";
    block.y = browserWindowHeight - block.height;;
    block.style.top = block.y + "px";

    block.moveSpeed = speed;

    arenaDiv.append(block);

    movement(block);
}

function createPlayerBlock() {
    playerBlock.classList.add("player-block");
    playerBlock.x = 0;
    playerBlock.y = 0;
    playerBlock.width = 50;
    playerBlock.height = 50;
    playerBlock.style.width = playerBlock.width + "px";
    playerBlock.style.height = playerBlock.height + "px";
    playerBlock.moveSpeed = 20;

    arenaDiv.append(playerBlock);
}

function game() {
    createPlayerBlock();
    createEnemyBlock(enemyBlock1, 50, 20, chase);
    createEnemyBlock(enemyBlock2, 50, 30, wander);
    createEnemyBlock(enemyBlock3, 50, 30, wander);
}

game();
