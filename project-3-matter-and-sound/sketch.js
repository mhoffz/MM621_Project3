// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies;
    Composite = Matter.Composite;

var engine;
var world;
var ground;

let boxes =[];

let createSound;
let collisionSound;

let started = false;

let groundHeight = 100;

let airSpace;

//let env;

//let polySynth;

let notes = ['C3', 'E3', 'G3', 'C4', 'E4', 'G4', 'B5', 'D5', 'E5', 'G5'];

function preload(){
  //createSound = loadSound("ShorterSamples/synth-splash.mp3");
  collisionSound = loadSound("ShorterSamples/synth-splash.mp3")
}

function setup() {

  createCanvas(800, 600);

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
  collisionSound.setVolume(.2);

  airSpace =  height - groundHeight;

  // env = new p5.Envelope();
  // env.setADSR(.1, .1, .9, .1);
  // env.setRange(0, 1);

  //polySynth = new p5.PolySynth(p5.MonoSynth, 16);
} 

function draw() {
  background(0, 220, 220);

  rectMode(CENTER);
  
  strokeWeight(1);

  //drawing boxes
  for(let i = 0; i < boxes.length; i++){

    //storing temp box height
    let tempBoxHeightId = boxes[i].heightId;

    boxes[i].show();
    //boxes[i].boxCollision();
    boxes[i].checkHeight();

    boxes[i].returnStroke();

    if (boxes[i].heightId && boxes[i].hasCollided){
      if (tempBoxHeightId != boxes[i].heightId){
        boxes[i].newNote();
      }
    }

  }


  //drawing ground
  stroke(0);
  fill(140);
  rect(ground.position.x, ground.position.y, width*.8, groundHeight);

}


function mousePressed(){

  let onBox;

  for (let i = 0; i < boxes.length; i ++){
    if ((mouseX <= boxes[i].body.position.x + 25) && (mouseX >= boxes[i].body.position.x - 25) && (mouseY <= boxes[i].body.position.y +25) && (mouseY >= boxes[i].body.position.y - 25)){
      boxes[i].toggle();
      onBox = true;
      console.log("clicked");
      break;
    } else {
      onBox = false;
    }
  }

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
