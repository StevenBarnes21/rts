"use strict"

const house = document.getElementById('house');
const gameBuildings = [];

function Building(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
}

let currentlySelected = null;
house.addEventListener('click', (e) => {
  currentlySelected = 'house';
  console.log(currentlySelected);
});

let mouseX = 150;
let mouseY = 150;
const mainCanvas = document.getElementById('main-canvas');
mainCanvas.width = 500;
mainCanvas.height = 500;

mainCanvas.addEventListener('mousemove', (e) => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  console.log(mouseX, mouseY);
});

mainCanvas.addEventListener('click', (e)=> {
  if(currentlySelected) {
    gameBuildings.push(new Building(mouseX, mouseY, 20, 20, '#00F'));
    currentlySelected = null;
  }
});

const ctx = mainCanvas.getContext('2d');
ctx.beginPath();
ctx.fillStyle = '#00F';
ctx.fillRect(50, 50, 50, 50);
console.log(mouseX);
ctx.fill();

(function gameLoop() {

  ctx.clearRect(0,0,500,500);

  drawBuidings();

  if(currentlySelected) {
    console.log('selected');
    ctx.beginPath();
    ctx.strokeStyle = '#00F';
    ctx.strokeRect(mouseX, mouseY, 30, 30);
    ctx.stroke();
  }

  requestAnimationFrame(gameLoop);
})();

function drawBuidings() {

  for(let i = 0; i < gameBuildings.length; i++) {
    ctx.fillStyle = gameBuildings[i].color;
    ctx.beginPath();
    ctx.fillRect(gameBuildings[i].x, 
                 gameBuildings[i].y, 
                 gameBuildings[i].w, 
                 gameBuildings[i].h);
    
  }


}