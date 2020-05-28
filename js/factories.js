"use strict"

const gameBuildings = [];
const gameUnits = [];
const gameResources = [];
const resources = [100, 0, 0]; //wood, stone, metal
let population = 1;

(function setup() {
  addResources();
})();

function Building(name, x, y, w, h, color) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
  this.wayPointX = null;
  this.wayPointY = null;
  this.selected = false;

  this.setWaypoint = () => {
    this.wayPointX = this.x - 10;
    this.wayPointY = this.y;
  }
}

function Unit(name, x, y, radius, color) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.speed = 0;
  this.selected = false;
  this.setSpeed = (speed) => {
    this.speed = speed;
  }
}

function Resource(name, x, y, w, h, color, health, amount) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
  this.health = health;
  this.amount = amount;

  this.decreaseAmount = () => {
    if(this.amount > 0) {
      this.amount--;
    }
  }

  this.takeDamage = (amount) => {
    if(this.health - amount >= 0) {
      this.health -= amount;
    } else {
      this.health = 0;
    }
  }
}

let currentlySelectedMenuItem = null;
let currentlySelectedBuilding = null;

// House button clicked
const house = document.getElementById('house');
house.addEventListener('click', (e) => {
  currentlySelectedMenuItem = new Building('house', null, null, 30, 30, '#00F');
});

// Barracks button clicked
const barracks = document.getElementById('barracks');
barracks.addEventListener('click', (e) => {
  currentlySelectedMenuItem = new Building('barracks', null, null, 40, 40, '#F22');
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
  if(currentlySelectedMenuItem) {
    currentlySelectedMenuItem.x = mouseX;
    currentlySelectedMenuItem.y = mouseY;
    let added = addBuilding(currentlySelectedMenuItem);

    if(added) 
      currentlySelectedMenuItem = null;
  }
});

// Event handler for selecting units
mainCanvas.addEventListener('click', (e) => {
  let x = e.offsetX;
  let y = e.offsetY;

  for(let i = 0; i < gameUnits.length; i++) {
    if(pointInterceptsUnit(x,y,gameUnits[i])){
      gameUnits[i].selected = true;
    }
  }
});

// Selects a building when the building is clicked on
mainCanvas.addEventListener('mousedown', (e) => {
  if(!currentlySelectedMenuItem) {
    let selectedBuilding = findSelectedBuilding(e);

    deselectAllBuildings();
    clearContextMenu();
    currentlySelectedBuilding = null;
    if(selectedBuilding) {  
      selectedBuilding.selected = true;
      displayContextMenu(selectedBuilding);
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

function pointInterceptsUnit(x,y,unit) {
  let circleX = unit.x;
  let circleY = unit.y;
  let circleRadius = unit.radius;
  
  let dx = Math.abs(circleX - x);
  let dy = Math.abs(circleY - y);
  let r = Math.hypot(dx, dy);
  if(r <= circleRadius) return true;

  return false;
}

const resourcesCanvas = document.getElementById('resources-canvas');
resourcesCanvas.width = 500;
resourcesCanvas.height = 25;
const resourcesCtx = resourcesCanvas.getContext('2d');

function drawCurrentResourcesUI() {
  const ONE_QUARTER = 125;
  
  // Wood
  resourcesCtx.fillStyle = '#0A0';
  resourcesCtx.fillRect(0, 0, ONE_QUARTER, 25);
  
  // Stone
  resourcesCtx.fillStyle = '#BBB';
  resourcesCtx.fillRect(ONE_QUARTER, 0, ONE_QUARTER, 25);
  
  // Metal
  resourcesCtx.fillStyle = '#F93';
  resourcesCtx.fillRect(ONE_QUARTER * 2, 0, ONE_QUARTER, 25);

  // Population
  resourcesCtx.fillStyle = '#00D';
  resourcesCtx.fillRect(ONE_QUARTER * 3, 0, ONE_QUARTER, 25);

  // Data
  resourcesCtx.fillStyle = '#000';
  resourcesCtx.font = "bold 18px Arial";
  let woodData = resources[0];
  resourcesCtx.fillText('WOOD: ' + woodData, 5, 19);
  
  let stoneData = resources[1];
  resourcesCtx.fillText('STONE: ' + stoneData, ONE_QUARTER + 5, 19);

  let metalData = resources[2];
  resourcesCtx.fillText('METAL: ' + metalData, ONE_QUARTER * 2 + 5, 19);
  
  let populationData = gameUnits.length;
  resourcesCtx.fillText('POP: ' + populationData, ONE_QUARTER * 3 + 5, 19);
}

// GAME LOOP *************************
const ctx = mainCanvas.getContext('2d');

(function gameLoop() {

  ctx.clearRect(0,0,500,500);
  drawBuidings();
  drawUnits();
  drawResources();
  drawCurrentResourcesUI();

  // Show the outline of the building before it is placed
  if(currentlySelectedMenuItem) {
    ctx.beginPath();
    ctx.strokeStyle = '#00F';
    ctx.strokeRect(mouseX, mouseY, currentlySelectedMenuItem.w, currentlySelectedMenuItem.h);
    ctx.stroke();
  }

  requestAnimationFrame(gameLoop);
})();

// Display the context menu for the currently selected building
function displayContextMenu(building) {
  if(building) {
    currentlySelectedBuilding = building;
    switch(building.name) {
      case 'house':
        displayHouseContextMenu();
        break;
      case 'barracks':
        displayBarracksContextMenu();
        break;
      default:
        currentlySelectedBuilding = null;
    }
  }
}

const uiCanvas = document.getElementById('ui-canvas');
uiCanvas.width = 500;
uiCanvas.height = 50;
const uiCtx = uiCanvas.getContext('2d');
uiCtx.font = "bold 16px Arial";

// TODO: WORKING ON THIS
uiCanvas.addEventListener('click', (e) => {
  build(currentlySelectedBuilding, e.offsetX, e.offsetY);
});

// TODO: AND THIS
function build(whatBuildingIsSelected, mouseClickedX, mouseClickedY) {
  if(whatBuildingIsSelected) {
    console.log(whatBuildingIsSelected, mouseClickedX, mouseClickedY);
    switch(whatBuildingIsSelected.name) {
      case 'house':
        if(mouseClickedX < 61) {
          buildWorker(whatBuildingIsSelected);
        }
      break;
    }

  }
}

function buildWorker(selectedBuilding) {
  console.log('building worker');

  if(!selectedBuilding.wayPointX || !selectedBuilding.wayPointY) {
    selectedBuilding.setWaypoint();
  }
  gameUnits.push(new Unit('worker', 
                          selectedBuilding.wayPointX,
                          selectedBuilding.wayPointY, 
                          5, '#000'));
}

function clearContextMenu() {
  uiCtx.clearRect(0,0,500,50);
}

function displayHouseContextMenu() {
  clearContextMenu();
  let worker = 'Worker';
  let startingX = buildContextButton(worker, 0, 0, 50, '#00F', '#FFF') + 2;
}

function displayBarracksContextMenu() {
  clearContextMenu();

  let swordsman = 'Swordsman';
  let archer = 'Archer';
  let spearman = "Spearman";
  let startingX = buildContextButton(swordsman, 0, 0, 50, '#F00', '#000') + 3;
  startingX = buildContextButton(archer, startingX, 0, 50, '#0F0', '#000') + startingX + 3;
  buildContextButton(spearman, startingX, 0,  50, '#00F', '#000') + 3;
}

function clearContextMenu() {
  uiCtx.fillStyle = '#AAA';
  uiCtx.fillRect(0,0,500,50);
}

function buildContextButton(text, x, y, height, bgColor, textColor) {
  let textWidth = uiCtx.measureText(text).width + 8;
  uiCtx.fillStyle = bgColor;
  uiCtx.fillRect(x, y, textWidth, height);
  uiCtx.fillStyle = textColor;
  uiCtx.fillText(text, x+4, 32);
  
  // Return value so you know where to start with the next button
  return textWidth;
}

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
    ctx.fill();

    if(gameUnits[i].selected) {
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(gameUnits[i].x,
              gameUnits[i].y,
              gameUnits[i].radius+2,
              0,
              Math.PI * 2,
              true);
      ctx.stroke();
    }
  }
}

function drawResources() {
  for(let i = 0; i < gameResources.length; i++) {
    ctx.fillStyle = gameResources[i].color;
    ctx.beginPath();
    ctx.fillRect(gameResources[i].x,
                 gameResources[i].y,
                 gameResources[i].w,
                 gameResources[i].h);
  }
}

function addBuilding(building) {
 
  // Edge case: There are no buildings added yet 
  if(gameBuildings.length === 0) {
   
    // Check if the building collides with any resource
    for(let i = 0; i < gameResources.length; i++) {
      if(collides(building, gameResources[i])) {
        return false;
      }
    }
    gameBuildings.push(building);
    return true;
  }

  // Loop over every building and check no buildings collide with this one
  for(let i = 0; i < gameBuildings.length; i++) {
    if(collides(building, gameBuildings[i])) {
      return false;    
    }
  }

  // Check if the building collides with any resource
  for(let i = 0; i < gameResources.length; i++) {
    if(collides(building, gameResources[i])) {
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

function addResources() {

  // Wood
  for(let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * 480);
    let y = Math.floor(Math.random() * 480);

    let wood = new Resource('wood', x, y, 20, 20, '#0A0', 100, 1000);
    
    gameResources.push(wood);
  }

  // Stone
  for(let i = 0; i < 5; i++) {

    let x = Math.floor(Math.random() * 470);
    let y = Math.floor(Math.random() * 470);

    let stone = new Resource('stone', x, y, 30, 30, '#777', 100, 5000);

    gameResources.push(stone);
  }
}


















