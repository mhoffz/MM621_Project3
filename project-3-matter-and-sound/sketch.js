// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var ground;

var mConstraint;

let boxes =[];

let createSound;
let collisionSound;

let started = false;

let groundHeight = 100;

let airSpace;

let notes = ['C3', 'E3', 'G3', 'C4', 'E4', 'G4', 'B5', 'D5', 'E5', 'G5'];

// let colorArray = ['MediumSeaGreen','SpringGreen','MediumSpringGreen','LightGreen','PaleGreen','LimeGreen', 'Lime', 'LawnGreen','Chartreuse','GreenYellow'];

let colorArray = ['Gold','Yellow','DarkOrange','GreenYellow','MediumSeaGreen','MediumSpringGreen', 'Lime', 'MediumSlateBlue','BlueViolet', 'Magenta'];

let myMode = 'regular';

//let myCircle;



// let greenModArray = [-90, -80, -70, -60, -50, -40, -30, -20, -10, 0];
// let redModArray = [190, 200, 230, 240, 255, 250, 245];
// let blueModArray = [190, 170, 150, 170, 180, 185, 180];


function preload(){
  //createSound = loadSound("ShorterSamples/synth-splash.mp3");
  //collisionSound = loadSound("ShorterSamples/synth-splash.mp3")
}

function setup() {

  var canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  //create world
  world = engine.world;

  function collision (event){
    let isCollided;
    for (i = 0; i < event.source.pairs.list.length; i ++){
      isCollided = event.source.pairs.list[i];
      for (j = 0; j < boxes.length; j ++){
        if (isCollided.bodyA.id == boxes[j].body.id || isCollided.bodyB.id == boxes[j].body.id){
          if (boxes[j].hasCollided == false){
            boxes[j].hasCollided = true;
            //collisionSound.play();
            boxes[j].boxCollision();
            boxes[j].playBoxSound();
            boxes[j].changeStroke();
          }
        }         
      }
    }
  }

  Matter.Events.on(engine, 'collisionStart', collision);

  //create ground
  ground = Bodies.rectangle(width/2, height - 50, width*.8, groundHeight, { isStatic: true });
  
  //adding ground to world
  Composite.add(engine.world, ground);

  //creating and running runner
  var runner = Runner.create();
  Runner.run(runner, engine);
  
  //createSound.setVolume(.5);
  //collisionSound.setVolume(.2);

  airSpace =  height - groundHeight;

  // env = new p5.Envelope();
  // env.setADSR(.1, .1, .9, .1);
  // env.setRange(0, 1);

  //polySynth = new p5.PolySynth(p5.MonoSynth, 16);

  var canvasMouse = Mouse.create(canvas.elt);
  canvasMouse.pixelRatio = pixelDensity();

  var options = {
    mouse: canvasMouse,
    //body: myCircle
  }

   mConstraint = MouseConstraint.create(engine, options);
   Composite.add(engine.world, mConstraint);

} 

function draw() {
  background(0, 220, 220);

  rectMode(CENTER);
  
  strokeWeight(1);

  if (!started){
    background(0, 180, 180);
    fill('magenta');
    rect(width/2, height/2 - 3, 80);
    fill('WhiteSmoke');
    textAlign(CENTER);
    textFont('garamond');
    textSize(15);
    noStroke();
    text('Click to start', width/2, height/2);
  }

  

  // if (myCircle){
  //   myCircle.show();
  // }


  //drawing boxes
  for(let i = 0; i < boxes.length; i++){

    //storing temp box height
    let tempBoxHeightId = boxes[i].heightId;

    boxes[i].checkHeight();

    boxes[i].show();

    //boxes[i].boxCollision();

    boxes[i].returnStroke();

    if ((boxes[i].heightId || boxes[i].heightId == 0) && boxes[i].hasCollided){
      if (tempBoxHeightId != boxes[i].heightId){
        boxes[i].newNote();
        //console.log("new");
      }
    }

    if (boxes[i].isOffScreen()){
      boxes[i].removeFromWorld();
      boxes.splice(i, 1);
      i--;
    }

  }


  //drawing ground
  stroke(0);
  fill(140);
  rect(ground.position.x, ground.position.y, width*.8, groundHeight);

  if (started){
    textAlign(LEFT);
    fill(100);
    noStroke();
    textSize(17);
    textFont('tahoma');
    text(myMode, 10, 20);
  }


}

function keyPressed(){
  if (key == 't'){
    myMode = 'toggle';
  } else if (key == 'r'){
    myMode = 'regular';
    //myCircle = new Ball(100, 100, 20);
  } else if (key == 'e'){
    myMode = 'erase';
  }
  //console.log(myMode);
}


function mousePressed(){

  let onBox;

  for (let i = 0; i < boxes.length; i ++){
    if ((mouseX <= boxes[i].body.position.x + 25) && (mouseX >= boxes[i].body.position.x - 25) && (mouseY <= boxes[i].body.position.y +25) && (mouseY >= boxes[i].body.position.y - 25)){
        if (myMode == 'toggle'){
          boxes[i].toggle();
        } else if (myMode == 'erase'){
          boxes[i].removeFromWorld();
          boxes[i].synthNote.triggerRelease();
          boxes.splice(i, 1);
        }
      onBox = true;
      //console.log("clicked");
      break;
    } else {
      onBox = false;
    }
  }
  if (myMode !== 'erase'){
    if (!onBox){
    //check if user has clicked
    if (started == false){
      userStartAudio();
      started = true;
      } else if (started == true){
        boxes.push(new Box(mouseX, mouseY, 50, 50));
      }
    }
  }
}
// function mouseDragged(){
//   let onBox;

//   for (let i = 0; i < boxes.length; i ++){
//     if ((mouseX <= boxes[i].body.position.x + 25) && (mouseX >= boxes[i].body.position.x - 25) && (mouseY <= boxes[i].body.position.y +25) && (mouseY >= boxes[i].body.position.y - 25)){
//         if (myMode == 'toggle'){
//           boxes[i].toggle();
//         } else if (myMode == 'erase'){
//           boxes[i].removeFromWorld();
//           boxes[i].synthNote.triggerRelease();
//           boxes.splice(i, 1);
//         }
//       onBox = true;
//       //console.log("clicked");
//     } else {
//       onBox = false;
//     }
//   }
// }

