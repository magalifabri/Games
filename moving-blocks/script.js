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



function moveX(amount) {
    if (playerBlock.x + amount < 0
    || playerBlock.x + playerBlock.width + amount > browserWindowWidth) {
        return ;
    }
    
    playerBlock.x += amount;
    playerBlock.style.left = `${playerBlock.x}px`;
}

function moveY(amount) {
    if (playerBlock.y + amount < 0
    || playerBlock.y + playerBlock.height + amount > browserWindowHeight) {
        return ;
    }

    playerBlock.y += amount;
    playerBlock.style.top = `${playerBlock.y}px`;
}

function move(event) {
    const pressedKey = event.key;
    
    switch (pressedKey) {
        case "w":
            moveY(-playerBlock.moveSpeed);
            break;
            
        case "a":
            moveX(-playerBlock.moveSpeed);
            break;
            
        case "s":
            moveY(playerBlock.moveSpeed);
            break;
            
        case "d":
            moveX(playerBlock.moveSpeed);
            break;
            
        default:
            break;
    }

}

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