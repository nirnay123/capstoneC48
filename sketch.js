var backgroundImg,bgSprite, canvas, gamestate="start";
var gelatoImg, birdImg, chocoImg, arrowImg, fireballImg;
var wallt, wallb, wallr, walll;

var gSprite, life, points, chocos=[];
var fireGroup, birdGroup, chocoGroup;
var startSnd, attackSnd, collectSnd;

function preload(){
    //images
    backgroundImg= loadImage("assets/background.jpg");
    birdImg= loadAnimation("assets/bird1.png", "assets/bird2.png", "assets/bird3.png");
    chocoImg=loadImage("assets/chocochip.png");
    arrowImg=loadImage("assets/arrow.png");
    fireballImg=loadImage("assets/fireball.png");
    gelatoImg=loadImage("assets/gelatoball.png");

    //sounds
    startSnd=loadSound("sounds/start.wav");
    attackSnd=loadSound("sounds/attack.wav");
    collectSnd= loadSound("sounds/pop.flac");
}

function setup(){
    canvas=createCanvas(windowWidth, windowHeight);

    fireGroup=new Group();
    birdGroup=new Group();
    chocoGroup=new Group();

    points=0;

    //SPRITES
    gSprite=createSprite(width/2,462 ,100,100);
    gSprite.addImage(gelatoImg);
    gSprite.scale=0.7;
    gSprite.velocityY=0;
    gSprite.velocityX=0;
    gSprite.debug=false;
    gSprite.setCollider("circle",0,0,80);
    life=3;

    //WALLS
    wallt=createSprite(width/2, 0, width, 1);
    wallb=createSprite(width/2, height-90, width, 1);
    wallb.visible=false;
    wallr=createSprite(width, height/2, 1, height);
    walll=createSprite(0, height/2, 1, height);
}

function draw(){
    background(backgroundImg);

    //START
    if(gamestate==="start"){
        life=3;
        textSize(20);
        fill("black");
        text("Use arrow keys to move and to jump, and avoid the fireballs.", width/2-290, height/3);
        text("click space to start.", width/2-95, height/2);
        if(keyDown("space")){
            gamestate="play";
            startSnd.play();
        }
    }

    //PLAY
    if(gamestate==="play"){
        gSprite.velocityY+=0.8;
        textSize(20);
        fill("black");
        text("Lives left: "+life, 20,70);
        text("Score: "+points, width-200,70);
        pointCollect();
        gelatoMove();
        birdSpawn();
        chocoSpawn();
        fireSpawn();
        if(gSprite.isTouching(fireGroup)){
            fireGroup.destroyEach();
                attackSnd.play();
            life-=1;
        }
        if(life===0){
            gamestate="end";
        }
        if(points>=25){
            gamestate="win";
        }
    }

    //END
    if(gamestate==="end"){
        fireGroup.destroyEach();
        chocos=[];
        chocoGroup.destroyEach();
        birdGroup.destroyEach();
        gSprite.x=width/2;
        gSprite.y=462;
        gSprite.velocityX=0;
        gSprite.velocityY=0;
        textSize(30);
        fill(0);
        text("Game Over :(", width/2-90, height/2);
        text("Score: "+points, width/2-50,height/3);
        text("click space to try again", width/2-130, (height/2+height/3)/2);
        if(keyDown("space")){
            life=3;
            points=0;
            gamestate="play";
        }
    }

    //WIN
    if(gamestate==="win"){
        textSize(30);
        fill(0);
        text("You win!!!!", width/2-80,height/3);
        text("click space to play again", width/2-160,height/2);
        text("lives: "+life, width/2-70,height/4);
        fireGroup.destroyEach();
        chocos=[];
        chocoGroup.destroyEach();
        birdGroup.destroyEach();
        gSprite.x=width/2;
        gSprite.y=462;
        gSprite.velocityX=0;
        gSprite.velocityY=0;
        
        if(keyDown("space")){
            life=3;
            points=0;
            gamestate="play";
        }
    }

    drawSprites();
}

function gelatoMove(){
    gSprite.collide(walll);
    gSprite.collide(wallb);
    gSprite.collide(wallr);
    gSprite.collide(wallt);

    if(keyDown("up_arrow")){
        gSprite.velocityY-=10;
    }
    if(keyDown("left_arrow")){
        gSprite.velocityX-=1;
    }
    if(keyDown("right_arrow")){
        gSprite.velocityX+=1;
    }
    if(gSprite.y>460){
        if(gSprite.velocityX>0){
            gSprite.velocityX-=0.3;
        }
        if(gSprite.velocityX<0){
            gSprite.velocityX+=0.3;
        }
    }
}

function birdSpawn(){
    if(frameCount%150==0){
        bird= createSprite(width+100, random(50,height-300));
        bird.velocityX=random(-3,-7);
        bird.lifetime=700;
        bird.depth=gSprite.depth-1;
        bird.addAnimation("birdImg", birdImg);
        bird.scale= random(1,0.2);
        birdGroup.add(bird);
    }
}

function chocoSpawn(){
    if(frameCount%100==0){
        choco= createSprite(random(100,width-100), random(50,height-300),20,20);
        choco.lifetime=350;
        choco.addImage("chocoImg", chocoImg);
        choco.scale= 0.2;
        choco.depth=gSprite.depth;
        chocos.push(choco);
        chocoGroup.add(choco);
        choco.setCollider("circle",0,0,120);
    }
}

function fireSpawn(){
    if(frameCount%50==0){
        var side= random(1,3);
        side=Math.round(side);
        switch(side){
            case 1:
                fire= createSprite(-100,random(50, height-300), 30,30);
                fire.velocityX=random(5,7);
                fire.velocityY=random(5,7);
                fire.lifetime=800;
                fire.addImage("fireImg", fireballImg);
                fire.scale=0.3;
                fireGroup.add(fire);
                fire.setCollider("circle",0,20,120);
                fire.depth=gSprite.depth;
                break;
            case 2:
                fire= createSprite(width+100,random(50, height-300), 30,30);
                fire.velocityX=random(-5,-7);
                fire.velocityY=random(5,7);
                fire.lifetime=800;
                fire.addImage("fireImg", fireballImg);
                fire.scale=0.3;
                fireGroup.add(fire);
                fire.setCollider("circle",0,20,120);
                fire.depth=gSprite.depth;
                break;
            case 3:
                fire= createSprite(random(100,width-100),-100, 30,30);
                fire.velocityX=random(-7,7);
                fire.velocityY=random(5,7);
                fire.lifetime=800;
                fire.addImage("fireImg", fireballImg);
                fire.scale=0.3;
                fireGroup.add(fire);
                fire.setCollider("circle",0,20,120);
                fire.depth=gSprite.depth;
                break;
        }
    }
}

function pointCollect(){
    for(var i=0;i<chocos.length;i++){
        if(chocos[i]!==undefined && gSprite.isTouching(chocos[i])){
            points+=1;
            chocos[i].remove();
            collectSnd.play();
        }
    }
}