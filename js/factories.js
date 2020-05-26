"use strict"


const gameBuildings = [];
const gameUnits = [];

function Building(name, x, y, w, h, color) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
  this.wayPointX = this.x + this.w + 5;
  this.wayPointY = this.y + this.h/2;
  this.selected = false;
}

function Unit(name, x, y, radius, color) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.speed = 0;
}

let currentlySelected = null;

// House button clicked
const house = document.getElementById('house');
house.addEventListener('click', (e) => {
  currentlySelected = new Building('house', null, null, 30, 30, '#00F');
});

// Barracks button clicked
const barracks = document.getElementById('barracks');
barracks.addEventListener('click', (e) => {
  currentlySelected = new Building('barracks', null, null, 40, 40, '#F22');
});

let mouseX = 0;
let mouseY = 0;
const mainCanvas = document.getElementById('main-canvas');
mainCanvas.width = 500;
mainCanvas.height = 500;

// Updates the mouse position when the mouse is moved which is needed
// to be able to show a building outline before the building is placed
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

// Selects a building when the building is clicked on
mainCanvas.addEventListener('mousedown', (e) => {
  if(!currentlySelected) {
    let selectedBuilding = findSelectedBuilding(e);

    if(selectedBuilding) {
      deselectAllBuildings();
      selectedBuilding.selected = true;
    }
  }
});

function deselectAllBuildings() {
  for(let i = 0; i < gameBuildings.length; i++) {
    gameBuildings[i].selected = false;
  }
}

function findSelectedBuilding(e) {
  // Loop through every building and see if the mouse coordinates intercept the building
  for(let i = 0; i < gameBuildings.length; i++) {
    if(pointIntercepts(e.offsetX, e.offsetY, gameBuildings[i])) {
      return gameBuildings[i];
    }
  }
}

// Find out if a point intercepts inside a building
function pointIntercepts(x,y, building) {
  if(x < building.x) return false;
  if(x > (building.x + building.w)) return false;
  if(y < building.y) return false;
  if(y > (building.y + building.h)) return false;

  return true;
}


const ctx = mainCanvas.getContext('2d');
(function gameLoop() {

  ctx.clearRect(0,0,500,500);
  drawBuidings();
  drawUnits();

  // Show the outline of the building before it is placed
  if(currentlySelected) {
    ctx.beginPath();
    ctx.strokeStyle = '#00F';
    ctx.strokeRect(mouseX, mouseY, currentlySelected.w, currentlySelected.h);
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
    
    if(gameBuildings[i].selected) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.strokeRect(gameBuildings[i].x - 1,
                     gameBuildings[i].y - 1,
                     gameBuildings[i].w + 2,
                     gameBuildings[i].h + 2);
      ctx.stroke();
    }
  }
}

function drawUnits() {
  for(let i = 0; i < gameUnits.length; i++) {
    ctx.fillStyle = gameUnits[i].color;
    ctx.beginPath();
    ctx.arc(gameUnits[i].x,
            gameUnits[i].y,
            gameUnits[i].radius,
            0, 
            Math.PI * 2, 
            true);
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
      return false;    
    }
  }

  // If the code reaches this part then no collisions have occurred so the building
  // can be added to the array
  gameBuildings.push(building);
  return true;
}

function collides(objA, objB) {

  // If objA clears both the left and right sides of objB then y does not matter
  if( (objA.x + objA.w) < objB.x || objA.x > (objB.x + objB.w) ){
    return false;
  } 

  // If objA clears both the top and bottom sides of objB then x does not matter 
  if( (objA.y + objA.h) < objB.y || objA.y > (objB.y + objB.h) ) {
    return false;
  } 

  return true;
}




















