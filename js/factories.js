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
  currentlySelected = new Building(null, null, 30, 30, '#00F');
  console.log('line 17',currentlySelected);
});

let mouseX = 150;
let mouseY = 150;
const mainCanvas = document.getElementById('main-canvas');
mainCanvas.width = 500;
mainCanvas.height = 500;

// Updates the mouse position
mainCanvas.addEventListener('mousemove', (e) => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});

// Adds a building if one has already been selected
mainCanvas.addEventListener('click', (e)=> {
  if(currentlySelected) {
    currentlySelected.x = mouseX;
    currentlySelected.y = mouseY;
    let added = addBuilding(currentlySelected);

    if(added) 
      currentlySelected = null;
  }
});

const ctx = mainCanvas.getContext('2d');

(function gameLoop() {

  ctx.clearRect(0,0,500,500);

  drawBuidings();

  // Show the outline of the building before it is placed
  if(currentlySelected) {
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

function addBuilding(building) {
 
  // Edge case: There are no buildings added yet 
  if(gameBuildings.length === 0) {
    gameBuildings.push(building);
    return true;
  }

  // Loop over every building and check no buildings collide with this one
  for(let i = 0; i < gameBuildings.length; i++) {
    if(collides(building, gameBuildings[i])) {
      console.log('collides');
      return false;    
    }
  }

  // If the code reaches this part then no collisions have occurred.
  gameBuildings.push(building);
  return true;
}

function collides(objA, objB) {

  // If objA clears both the left and right sides of objB then y does not matter
  if( (objA.x + objA.w) < objB.x || objA.x > (objB.x + objB.w) ){
    console.log('clears x');
    return false;
  } 

  // If objA clears both the top and bottom sides of objB then x does not matter 
  if( (objA.y + objA.h) < objB.y || objA.y > (objB.y + objB.h) ) {
    console.log('clears y');
    return false;
  } 

  return true;
}




















