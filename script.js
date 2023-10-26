let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let endDialog = document.querySelector('.end');
let hero = new Image();
hero.src = "img/hero.png";
hero.height = 32;
hero.width = 32;
let HERO_SPEED = -10;

let score = 0;
let record = localStorage.getItem('maxScore');
score = `Ваши очки: ${score}`;
record = `Лучший результат: ${record}`
let scoredSpiral = {
  firstSpiral: false,
  secondSpiral: false
}

let gameStarted = false;

let spiral = new Image();
spiral.src = "img/spiral.png";
let SPIRAL_HEIGHT = 250;
let SPIRAL_WIDTH = 64;
let SPIRAL_GAP = 192;
let firstSpiralX = 200;
let firstSpiralY = canvas.height - 200;
let secondSpiralX = 384;
let secondSpiralY = canvas.height - 100;

let heroX = 50;
let heroY = 50;
let heroSpeed = 0;
let heroAcceleration = 0.5;



document.body.addEventListener("keydown", (event) => {
  event.stopPropagation();
  if(event.code === "Space") {
heroSpeed = HERO_SPEED
  }
});

document.querySelector('.restart').addEventListener('click', () => {
  endDialog.classList.remove('end1')
restart()
});

function startGame() {
    gameStarted = true;
    interval = setInterval(move, 500);
}
window.addEventListener('keydown', function(e){
    if(!gameStarted){
        startGame()
    }
  });

function increase(heroX, heroY, spiralX, spiralY, scored) {
  if(
    heroX > spiralX + SPIRAL_WIDTH && 
    (heroY < spiralY + SPIRAL_GAP || heroY + hero.height > spiralY + SPIRAL_GAP) &&
    !scoredSpiral[scored]
    ) {
    score++;
  scoredSpiral[scored] = true
  }
if(heroX < spiralX + SPIRAL_WIDTH) {
scoredSpiral[scored] = false
}
}

function restart() {
heroX = 50;
heroY = 50;
heroSpeed = 0;
firstSpiralX = 200;
firstSpiralY = canvas.height - 200;
secondSpiralX = 384;
secondSpiralY = canvas.height - 100;
score = 0;
loop();
}

function drawSpiral() {

ctx.fillRect(firstSpiralX, -100, 64, firstSpiralY);
ctx.fillRect(firstSpiralX, firstSpiralY + SPIRAL_GAP, 64, canvas.height - firstSpiralY);

ctx.fillRect(secondSpiralX, -100, 64, secondSpiralY);
ctx.fillRect(secondSpiralX, secondSpiralY + SPIRAL_GAP, 64, canvas.height - secondSpiralY);

firstSpiralX -= 1.5;
secondSpiralX -= 1.5;

if(firstSpiralX < -50) {
firstSpiralX = 400;
firstSpiralY = Math.random() * (canvas.height - SPIRAL_GAP) + 64;
}
  if(secondSpiralX < -50) {
secondSpiralX = 400;
secondSpiralY = Math.random() * (canvas.height - SPIRAL_GAP) + 64;
  }
}



function isCrash() {
  let heroBox = {
    x: heroX,
    y: heroY,
    width: hero.width,
    height: hero.height
  }

  let firstTopSpiral = {
    x: firstSpiralX,
    y: firstSpiralY - SPIRAL_GAP + hero.height,
    width: SPIRAL_WIDTH,
    height: firstSpiralX
};
let firstBottonSpiral = {
    x: firstSpiralX,
    y: firstSpiralY + SPIRAL_GAP + hero.height,
    width: SPIRAL_WIDTH,
    height: canvas.height - firstSpiralY - SPIRAL_GAP
}
 let secondTopSpiral = {
    x: secondSpiralX,
    y: secondSpiralY - SPIRAL_GAP + hero.height,
    width: SPIRAL_WIDTH,
    height: secondSpiralX
};
let secondBottonSpiral = {
    x: secondSpiralX,
    y: secondSpiralY + SPIRAL_GAP + hero.height,
    width: SPIRAL_WIDTH,
    height: canvas.height - secondSpiralY - SPIRAL_GAP
  };

if(
  heroBox.x + hero.width > firstTopSpiral.x &&
  heroBox.x < firstTopSpiral.x + firstTopSpiral.width &&
  heroBox.y + heroBox.height / 2 < firstTopSpiral.y 
  ) {
  return true
}
if(
  heroBox.x + hero.width > secondTopSpiral.x &&
  heroBox.x < secondTopSpiral.x + secondTopSpiral.width &&
  heroBox.y + heroBox.height * 2 < secondTopSpiral.y 
  ) {
  return true
}
if(
  heroBox.x + hero.width > firstBottonSpiral.x &&
  heroBox.x < firstBottonSpiral.x + firstBottonSpiral.width &&
  heroBox.y + heroBox.height * 2 > firstBottonSpiral.y
) {
  return true
}
if(
  heroBox.x + hero.width > secondBottonSpiral.x &&
  heroBox.x < secondBottonSpiral.x + secondBottonSpiral.width &&
  heroBox.y + heroBox.height / 2 > secondBottonSpiral.y
) {
  return true
}

if(heroY < 0 || heroY + hero.height > canvas.height) return true
return false
}

function end() {
endDialog.classList.add('end1');
document.querySelector('.score').innerHTML = score;
}



function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(hero, heroX, heroY);

drawSpiral();

if(isCrash()) {
  end()
  return
}


  heroSpeed += heroAcceleration
  heroY += heroSpeed;
  increase({heroX, heroY, spiralY: firstSpiralY, spiralX: firstSpiralX, scored: 'firstSpiral'})
  increase({heroX, heroY, spiralY: secondSpiralY, spiralX: secondSpiralX, scored: 'secondSpiral'})
  requestAnimationFrame(loop);
};

loop()