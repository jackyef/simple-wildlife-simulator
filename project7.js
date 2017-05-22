
var container = document.getElementById("container");
var score = 0;
var scoreSpan = document.getElementById("score");
var globalWorld;
var herbivoreCount = 0, carnivoreCount = 0, omnivoreCount = 0, plantCount = 0;

/* try tweaking this to achieve a balanced ecosystem */
var maxHerbivoreCount = document.getElementById("max-herbivore").value;
var maxCarnivoreCount = document.getElementById("max-carnivore").value;
var maxOmnivoreCount = document.getElementById("max-omnivore").value;

function reset(){
    score = 0;
    hDied = false;
    cDied = false;
    oDied = false;
    document.getElementById("herbivore-died").innerHTML = "";
    document.getElementById("carnivore-died").innerHTML = "";
    document.getElementById("omnivore-died").innerHTML = "";
    document.getElementById("toggleBtn").removeAttribute("disabled");
    document.getElementById("toggleBtn").innerHTML = "Turn on auto take turn";
    auto = true;
    toggleAutoTakeTurn();


    globalWorld = new LifelikeWorld(
      ["                                                                       ",
       "          ####                 ########         ##    ******           ",
       "          #   ***                **####  #     ###     *****           ",
       "             *##**         **     *####      #            **           ",
       "              ***          ##**    *                                   ",
       "                           ##***       ***       C                     ",
       "                           ##**         **      C                      ",
       "                     #*            H    **              H              ",
       "          *   H      #**                                               ",
       "          ***        ##**         **                                   ",
       "          #****     ###***       *##    O        ###                   ",
       "          ***                     **              ##                   ",
       "          #****                                  ###                   ",
       "          ***         #**         **                                   ",
       "          #****        ***               H                             ",
       "          ***          **                            # **              ",
       "          #****     ###***                        ##  ***              ",
       "                                                                       "],
   {
     "#": MossyWall,
     "+": Wall,
     "-": Wall,
     "|": Wall,
     "*": Plant,
     "H": BetterHerbivore,
     "C": Carnivore,
     "W": WallFollower,
     "O": Omnivore,
   }
  );
  refreshWorld(globalWorld);
}

window.onload = function(){
  var world = new LifelikeWorld(
    ["                                                                       ",
     "          ####                 ########         ##    ******           ",
     "          #   ***                **####  #     ###     *****           ",
     "             *##**         **     *####      #            **           ",
     "              ***          ##**    *                             ##    ",
     "                           ##***       ***       C                     ",
     "                           ##**         **      C                      ",
     "                     #*            H    **              H        ###   ",
     "          *   H      #**                                          ##   ",
     "          ***        ##**         **               ##                  ",
     "         ##****     ###***       *##    O        #####                 ",
     "          ***                     **              #####                ",
     "          #****                                  ###                   ",
     "          ***         #**         **                                   ",
     "          #****        ***               H                             ",
     "          ***          **                            # **              ",
     "          #****     ###***                        ##  ***              ",
     "                                                                       "],
   {
     "#": MossyWall,
     "+": Wall,
     "-": Wall,
     "|": Wall,
     "*": Plant,
     "H": BetterHerbivore,
     "C": Carnivore,
     "O": Omnivore,
   }
  );
  // var world = new LifelikeWorld(
  //   ["############################",
  //    "#####                 ######",
  //    "##            *    ##  H  ##",
  //    "#    ##       *   ####### ##",
  //    "#                 ###   #  #",
  //    "#                 ##  #  # #",
  //    "#                 ## ### # #",
  //    "#     *     #     #  #   # #",
  //    "#     *     #     #  # ### #",
  //    "#           ##       # #   #",
  //    "##   *     ###       #   ###",
  //    "############################"],
  //  {
  //    "#": Wall,
  //    "*": Plant,
  //    "H": BetterHerbivore,
  //    "W": WallFollower,
  //    "O": BouncingCritter,
  //  }
  // );
  globalWorld = world;

  refreshWorld(world);
  // for(var i = 0; i < 0; i++){
  //   setTimeout(world.turn(), i*200);
  // }

  intervalInput.onpropertychange = intervalInput.oninput;
  intervalInput.oninput = function(){
    clearInterval(currentIntervalId);
    interval = intervalInput.value;
    currentIntervalId = setInterval(forceTakeTurn, interval);
  };
  // console.log(world.grid.get(new Vector(8,5)));
}


var auto = false;
var intervalInput = document.getElementById("interval");
var interval = intervalInput.value;
var toggleBtn = document.getElementById("toggleBtn");
var currentIntervalId = null;

var hCountSpan = document.getElementById("herbivore-count");
var cCountSpan = document.getElementById("carnivore-count");
var oCountSpan = document.getElementById("omnivore-count");
var pCountSpan = document.getElementById("plant-count");
var hDied = false;
var cDied = false;
var oDied = false;

function forceTakeTurn(){
  globalWorld.turn();

  maxHerbivoreCount = document.getElementById("max-herbivore").value;
  maxCarnivoreCount = document.getElementById("max-carnivore").value;
  maxOmnivoreCount = document.getElementById("max-omnivore").value;

  score++;
  scoreSpan.innerHTML = score;
  hCountSpan.innerHTML = herbivoreCount;
  oCountSpan.innerHTML = omnivoreCount;
  cCountSpan.innerHTML = carnivoreCount;
  pCountSpan.innerHTML = plantCount;

  if(!herbivoreCount && !hDied){
    document.getElementById("herbivore-died").innerHTML = "died out after " + score + " turns."
    hDied = true;
  }
  if(!carnivoreCount && !cDied){
    document.getElementById("carnivore-died").innerHTML = "died out after " + score + " turns."
    cDied = true;
  }
  if(!omnivoreCount && !oDied){
    document.getElementById("omnivore-died").innerHTML = "died out after " + score + " turns."
    oDied = true;
  }

  if(hDied && cDied && oDied){
    clearInterval(currentIntervalId);
    document.getElementById("toggleBtn").setAttribute("disabled", true);
  }

}

function toggleAutoTakeTurn(){
  interval = document.getElementById("interval").value;
  auto = !auto;
  if(auto){
    // intervalInput.setAttribute("disabled", true);
    currentIntervalId = setInterval(forceTakeTurn, interval);
    toggleBtn.innerHTML = "Turn off auto take turn";
  } else {
    // intervalInput.removeAttribute("disabled");
    clearInterval(currentIntervalId);
    toggleBtn.innerHTML = "Turn on auto take turn";
  }
}
/*
 * Class: World
 */
function World(planArray, legend){
  this.currentState = planArray;

  this.grid = new Grid(planArray[0].length, planArray.length);
  for(var i = 0; i < this.grid.width; i++){
    for(var j = 0; j < this.grid.height; j++){
      this.grid.set(new Vector(i,j), elementFromChar(legend, planArray[j][i]));
    }
  }
  this.legend = legend;
}
World.prototype.letAct = function(critter ,vector){
  var action = critter.act(new View(this, vector));
  if(action && action.type == "move"){
    var dest = this.checkDestination(action, vector);
    if(dest && this.grid.get(dest) == null){
      this.grid.set(vector, null); //put current critter position as null
      this.grid.set(dest, critter); //put critter at destination
    }
  }
};
World.prototype.turn = function(){
  //force all critters to make a move
  console.log("turn taken, world refreshed");
  //then refreshWorld()
  var acted = [];
  var tempH = 0, tempO = 0, tempC = 0, tempP = 0;
  this.grid.forEach(function(critter, vector){
    if(critter.act && acted.indexOf(critter) === -1){
      acted.push(critter);
      this.letAct(critter, vector);
      switch(critter.char){
        case "H": tempH++; break;
        case "C": tempC++; break;
        case "O": tempO++; break;
        case "*": tempP++; break;
        default: break;
      }
    }
  }, this);
  herbivoreCount = tempH;
  carnivoreCount = tempC;
  omnivoreCount = tempO;
  plantCount = tempP;
  // console.log("herbivore:", herbivoreCount);
  // console.log("carnivore:", carnivoreCount);
  // console.log("omnivore:", omnivoreCount);
  // console.log("plant:", plantCount);
  // console.log(this.toString()); //print world into console
  refreshWorld(this); //print into html web page
};
World.prototype.checkDestination = function(action, vector){
  if(directions.hasOwnProperty(action.direction)){
    var dest = vector.plus(directions[action.direction]);
    if(this.grid.isInside(dest)){
      return dest;
    }
  }
};
World.prototype.toString = function(){
  var output = "";
  for(var y = 0; y < this.grid.height; y++){
    for(var x = 0; x < this.grid.width; x++){
      var element = this.grid.get(new Vector(x,y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
}
// end of Class: World

// World Helper methods
function elementFromChar(legend, char){
  if(char == " ") return null;
  var element = new legend[char](); // "#": Wall will evaluates to new Wall();
  element.originChar = char;
  return element;
}
function charFromElement(element){
  if(element == null) return " ";
  return element.originChar;
}
// End of World Helper methods

/*
 * Class: LifelikeWorld
 */
function LifelikeWorld(planArray, legend){
  World.call(this, planArray, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype); // create a copy of the prototype
var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector){
  var action = critter.act(new View(this, vector));
  var handled = action && action.type in actionTypes &&
                actionTypes[action.type].call(this, critter, vector, action);
  if(!handled){
    critter.energy -= 0.2;
    if(critter.energy <= 0){
      this.grid.set(vector, null);
    }
  }
}

// actionTypes
actionTypes.grow = function(critter){
  critter.energy += 0.5;
  return true;
}
actionTypes.move = function(critter, vector, action){
  var dest = this.checkDestination(action, vector); //the method checkDestination is avaiable because 'this' refers to the LifelikeWorld
  // because we used 'call' and passed the reference
  if(dest == null || critter.energy <= 1 || this.grid.get(dest) != null){
    return false;
  }
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
}
actionTypes.eat = function(critter, vector, action){
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if(!atDest || atDest.energy == null){
    return false;
  }
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
}
actionTypes.reproduce = function(critter, vector, action){
  var baby = elementFromChar(this.legend, critter.originChar);
  var dest = this.checkDestination(action, vector);
  if(dest == null || critter.energy <= 2 * baby.energy || this.grid.get(dest) != null){
    return false;
  }
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
}
actionTypes.createPlant = function(critter, vector, action){
  var newPlant = elementFromChar(this.legend, "*");
  var dest = this.checkDestination(action, vector);
  this.grid.set(dest, newPlant);
  return true;
}
/*
 * Class: View
 */
function View(world, vector){
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function(dir){
  var target = this.vector.plus(directions[dir]);
  if(this.world.grid.isInside(target)){
    return charFromElement(this.world.grid.get(target));
  } else {
    return "#";
  }
}
View.prototype.findAll = function(ch){
  var found = [];
  for(var dir in directions){
    if(this.look(dir) == ch){
      found.push(dir);
    }
  }
  return found;
}
View.prototype.find = function(ch){
  var found = this.findAll(ch);
  if(found.length == 0) return null;
  return randomElement(found);
}
View.prototype.findNearest = function(ch){
  var nearestDistance = this.world.grid.width * this.world.grid.height;
  var nearestVector = null;
  var critterVector = this.vector;
  // console.log("Trying to find nearest '"+ch+"' from point: "+ critterVector.x +", "+ critterVector.y);
  this.world.grid.forEach(function(critter, vector){
    if(critter.originChar == ch){
      var distance = Vector.distanceBetween(critterVector, vector);
      if(nearestDistance > distance){
        nearestDistance = distance;
        nearestVector = vector;
      }
    }
  }, this.world);
  if(nearestVector == null) return null;
  // else determine which way to go
  // console.log("Nearest '"+ch+"' is at point: "+nearestVector.x+", "+nearestVector.y );
  // console.log("Critter should go to: " + Vector.directionFromTo(critterVector, nearestVector));
  return Vector.directionFromTo(critterVector, nearestVector);

}
// End of Class: View
/*
 * Class: Vector
 */
function Vector(x, y){
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other){
  return new Vector(this.x+other.x, this.y+other.y);
}
Vector.distanceBetween = function(p1, p2){
  return Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y - p2.y, 2));
}
Vector.directionFromTo = function(p1, p2){
  if(p1.x < p2.x && p1.y < p2.y){
    return "se";
  }
  if(p1.x < p2.x && p1.y == p2.y){
    return "e";
  }
  if(p1.x < p2.x && p1.y > p2.y){
    return "ne";
  }
  if(p1.x == p2.x && p1.y > p2.y){
    return "n";
  }
  if(p1.x > p2.x && p1.y > p2.y){
    return "nw";
  }
  if(p1.x > p2.x && p1.y == p2.y){
    return "w";
  }
  if(p1.x > p2.x && p1.y < p2.y){
    return "sw";
  }
  if(p1.x == p2.x && p1.y < p2.y){
    return "s";
  }
}
// end of Class: Vector

/*
 * Class: Grid
 */
function Grid(width, height){
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function(vector){
  return vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height;
}
Grid.prototype.get = function(vector){
  return this.space[vector.x + this.width * vector.y];
}
Grid.prototype.set = function(vector, value){
  this.space[vector.x + this.width * vector.y] = value;
}
Grid.prototype.forEach = function(f, context){
  for(var y = 0; y<this.height; y++){
    for(var x = 0; x<this.width; x++){
      var value = this.space[x + y * this.width];
      if(value !== null){
        f.call(context, value, new Vector(x,y));
      }
    }
  }
}
// end of Class: Grid

function Plant(){
  this.energy = 3 + Math.random() * 4;
  this.char = "*";
}
Plant.prototype.act = function(view){
  if(this.energy > 15){
    var space = view.find(" ");
    if(space) return {type: "reproduce", direction: space};
  }
  if(this.energy < 20){
    return {type: "grow"};
  }
}

function Herbivore(){
  this.energy = 20;
}
Herbivore.prototype.act = function(view){
  var space = view.find(" ");
  if(this.energy > 60 && space){
    return {type: "reproduce", direction: space};
  }
  var plant = view.find("*");
  if(plant){
    return {type: "eat", direction: plant};
  }
  if(space){
    return {type: "move", direction: space};
  }
}

function BetterHerbivore(){
  this.energy = 20;
  this.char = "H";
}
BetterHerbivore.prototype.act = function(view){
  var plant = view.find("*");
  if(plant && this.energy < 60){
    return {type: "eat", direction: plant};
  }
  var nearestPlant = view.findNearest("*");
  if(this.energy <= 20 && nearestPlant && view.look(nearestPlant) == " "){
    return {type: "move", direction: nearestPlant};
  }
  var space = view.find(" ");
  if(this.energy > 60 && space && herbivoreCount < maxHerbivoreCount){
    var rollDice = (Math.random() * 100) < 10; //10% chance to reproduce
    if(rollDice)
      return {type: "reproduce", direction: space};
  }
  // else move randomly
  if(space){
    return {type: "move", direction: space};
  }
}

function Carnivore(){
  this.energy = 70;
  this.char ="C";
}
Carnivore.prototype.act = function(view){
  var herbivore = view.find("H") || view.find("O");
  if(herbivore && this.energy < 100){
    return {type: "eat", direction: herbivore};
  }
  var nearestHerbivore = view.findNearest("H") || view.findNearest("O");
  if(this.energy <= 80 && nearestHerbivore && view.look(nearestHerbivore) == " "){
    return {type: "move", direction: nearestHerbivore};
  }
  var space = view.find(" ");
  if(this.energy > 140 && space && carnivoreCount < maxCarnivoreCount){
    var rollDice = (Math.random() * 100) < 10; //10% chance to reproduce
    if(rollDice)
      return {type: "reproduce", direction: space};
  }
  // else move randomly
  if(space){
    return {type: "move", direction: space};
  }
}

function Omnivore(){
  this.energy = 60;
  this.char = "O";
}
Omnivore.prototype.act = function(view){
  var plant = view.find("*");
  if(plant && this.energy < 150){
    return {type: "eat", direction: plant};
  }
  var nearestPlant = view.findNearest("*");
  if(this.energy <= 150 && nearestPlant && view.look(nearestPlant) == " "){
    return {type: "move", direction: nearestPlant};
  }

  var herbivore = view.find("H") || view.find("C");
  if(herbivore && this.energy < 100){
    return {type: "eat", direction: herbivore};
  }
  var nearestHerbivore = view.findNearest("H") || view.findNearest("C");
  if(this.energy <= 100 && nearestHerbivore && view.look(nearestHerbivore) == " "){
    return {type: "move", direction: nearestHerbivore};
  }
  var space = view.find(" ");
  if(this.energy > 120 && space && omnivoreCount < maxOmnivoreCount){
    var rollDice = (Math.random() * 100) < 10; //10% chance to reproduce
    if(rollDice)
      return {type: "reproduce", direction: space};
  }
  // else move randomly
  if(space){
    return {type: "move", direction: space};
  }
}


/*
 * Class: BouncingCritter
 */
function BouncingCritter(){
  this.direction = randomElement(directionNames);
}
BouncingCritter.prototype.act = function (view) {
  if(view.look(this.direction) != " "){
    this.direction = view.find(" ") || "s";
  }
  return {type: "move", direction: this.direction};
}
// end of Class: BouncingCritter

/*
 * Class: WallFollower
 */
function WallFollower(){
  this.dir = "s";
}
WallFollower.prototype.act = function (view) {
  var start = this.dir;
  if(view.look(dirPlus(this.dir, -3)) != " "){
    start = this.dir = dirPlus(this.dir, -2);
  }
  while(view.look(this.dir) != " "){
    this.dir = dirPlus(this.dir, 1);
    if(start == this.dir) break;
  }
  return {type: "move", direction: this.dir};
}
// end of Class: WallFollower

/*
 * Class: Wall
 */
function Wall(){ }
function MossyWall() { }
MossyWall.prototype.act = function (view){
  var space = view.find(" ");
  var rollDice = (Math.random() * 100) < .5;
  if(space && rollDice){
    return {type: "createPlant", direction: space};
  }

}
// End of Class: Wall

// Critter Helper functions
function randomElement(array){
  return array[Math.floor(Math.random() * array.length)];
}
var directionNames = "n ne e se s sw w nw".split(" ");
var directions = {
  "n":  new Vector(0,-1),
  "ne": new Vector(1,-1),
  "e":  new Vector(1,0),
  "se": new Vector(1,1),
  "s":  new Vector(0,1),
  "sw": new Vector(-1,1),
  "w":  new Vector(-1,0),
  "nw": new Vector(-1,-1)
}

function dirPlus(dir, n){
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}
// end of Critter Helper functions
function refreshWorld(world){
  var out = "<pre>";
  out += world.toString();
  // world = world.currentState;
  // world.forEach( (v,i) =>{
  //   out += world[i] + "<br/>";
  // });
  out += "</pre>";
  container.innerHTML = out;
}
