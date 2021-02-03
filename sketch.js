var grounds, ground, keys, door;
var deaths = 0;
var wall1, wall2, wall3;
var block1, climberObj;
var player;
var img, ballImg, runLeft, runRight, wallImg;
var lava1, bumpyWall;
var gameState = 'startState';


function preload(){
  img = loadImage("images/player.png");
  ballImg = loadImage("images/blackCircle.png");
  bgm = loadSound('sounds/BGM.wav');
  winSound = loadSound('sounds/winSound.mp3');
  jumpSound = loadSound('sounds/jumpSound.mp3');
  lose = loadSound('sounds/error.mp3');
  openDoor = loadImage('images/openDoor.png');
  closedDoor = loadImage('images/door.png');
  bg = loadImage('images/caveBG2.png');
  bricks = loadImage('images/stoneWall.jpg');
  runRight = loadAnimation('images/player-run1.png', 'images/player-run2.png', 'images/player-run3.png', 'images/player-run4.png');
  runLeft = loadAnimation('images/player-run5.png', 'images/player-run6.png', 'images/player-run7.png', 'images/player-run8.png');
  wallImg = loadImage('images/wall.png');
}

function setup() {
  createCanvas(700,400);
  block1 = new Block(290, 300, 80, 200);
  block2 = new Block(400, 200, 300, 80);
  block3 = new Brick(680, 310, 100, 15,0);
  block4 = new Brick(400, 350, 90, 15, 0);

  ground = createSprite(350, 400, 750, 20);
  ground.shapeColor = "Black"
  
  door = createSprite(380, 307, 50, 70);
  door.shapeColor = "teal";
  door.addImage(closedDoor);
  door.scale = 0.3;

  bumpyWall = createSprite(250, 280.5, 10, 200);
  bumpyWall.addImage(wallImg);
  bumpyWall.scale = 0.7;
  bumpyWall.setCollider('rectangle', 0, 10, 40, 360, 0);
  //bumpyWall.debug = true;
  

  
  spawnPlayer();
  //player.debug = true;
  lavaGroup = new Group;
}

function draw() {
  background(bg); 
  noStroke();
  textSize(15);
  fill(225);
  text('# of Deaths :  ' + deaths, 550, 20);
  textFont('Verdana');
    textSize(50);
    stroke("Black");
    strokeWeight(6);
    fill('Skyblue');
    text("Escape The Cave", 10, 60);
   
  //make sure the player collides with objects;
  edges = createEdgeSprites();
  player.collide(ground);
  player.collide(edges[0]);
  player.collide(edges[1]);
  player.collide(edges[2]);
  player.collide(bumpyWall);
  
  //create gravity
  player.velocityY = player.velocityY + 0.8;

  //add non-player-characters
  block1.display();
  block2.display();
  block3.display();
  block4.display();

  lava(150, 394.9, 100);
  lava(470, 394.9, 100);
  lava(400, 165, 150);
  lava(680, 307, 50);
  lava(600, 394.9, 90);
  
  //climber(250, 170, 400);
  if (gameState === 'startState'){
    noStroke();
    textSize(8);
    fill(225);
    text("keep pressing space and right arrow", 80, 200);
    text("while touching the wall to climb to the top", 70, 210);
    text("go through the door to escape the cave", 380, 250);
    text("jump over the lava ", 110, 350);
    text("using space key", 120, 360);
    text("you can't jump on grey blocks", 570, 290);
    fill('skyblue');
    textSize(15);
    text('left and right arrow keys to move', 20, 90);
    fill(255);
    text('press SPACE to start', 20, 110);
    player.x = 40;
    player.y = 330;
    deaths = 0;
    door.changeImage(closedDoor);
  }
  if(keyDown('space') && gameState === 'startState'){
    gameState = 'playState'
  }
  if (gameState === 'playState'){
    
    
    //create bgm
    bgm.playMode('untilDone');
    bgm.play();
    bgm.setVolume(0.05);
    //set player movement;
    if (keyWentDown("space") ){
      if(player.y>350){
        player.velocityY = - 10;
      } else if(player.y<126 && player.y>124){
        player.velocityY = - 10;
      } 
    jumpSound.setVolume(0.1);
    jumpSound.play();
    }
  
    if (keyDown("LEFT_ARROW")){
      player.x = player.x - 10;
      player.changeAnimation("moreRunning", runLeft);

    } else if (keyDown("RIGHT_ARROW")){
      player.x = player.x + 10;
      player.changeAnimation("running", runRight);
    } else {
      player.changeAnimation('image', img);
    }

    if(player.isTouching(bumpyWall) && keyDown("space")) {
      player.y = 125;
    }  
     
    if(player.isTouching(door)){
      gameState = 'endState';
      winSound.play();
      door.scale = 0.08;
      door.y = 309;
      door.addImage(openDoor);
    } 
    if(player.isTouching(lavaGroup)){
      player.x = 40;
      player.y = 330;
      deaths = deaths + 1;
      lose.setVolume(1.0);
      lose.play();
    } 
  }else if (gameState === 'endState'){
    textSize(40);
    fill(68, 225, 0 );
    strokeWeight(3.5);
    stroke(68, 225, 0 );
    text("YOU ESCAPED!", 200, 100);
    bgm.pause();
    player.destroy();
    fill(225);
    noStroke();
    textSize(20);
    text("press 'r' to restart", 300, 150);
    if(keyDown('r') && gameState === 'endState'){
      gameState = 'startState';
      spawnPlayer();
    }
  }
  
  
  drawSprites();
}


function spawnPlayer(){
  player = createSprite(40, 330, 20, 40);
  player.addAnimation('image', img);
  player.addAnimation("running", runRight);
  player.addAnimation("moreRunning", runLeft);
  player.scale = 0.2;
  player.setCollider("rectangle", -5, -3, 120, 350, 0);
  door.addImage(closedDoor);
  door.scale = 0.3;
}

function lava(x, y, w){
  var lavaObj = createSprite(x, y, w, 10);
  lavaObj.shapeColor = "red";
  lavaGroup.add(lavaObj);
}