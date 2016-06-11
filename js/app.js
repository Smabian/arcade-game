/*
Inside the app.js file, you will need to implement the Player and the Enemy classes, using Object-Oriented JavaScript. Part of the code for the Enemy is provided to you, and you will need to complete the following:

The Enemy function, which initiates the Enemy by:
    - Loading the image by setting this.sprite to the appropriate image in the image folder (already provided)
    - Setting the Enemy initial location (DONE)
    - Setting the Enemy speed (DONE)
The update method for the Enemy
    - Updates the Enemy location (DONE)
    - Handles collision with the Player (you need to implement)
    - You can add your own Enemy methods as needed

You will also need to implement the Player class, and you can use the Enemy class as an example on how to get started. At minimum you should implement the following:
The Player function, which initiates the Player by:
    - Loading the image by setting this.sprite to the appropriate image in the image folder (DONE)
    - Setting the Player initial location (DONE)
    - The update method for the Player (PENDING)
    - The render method for the Player (DONE)
    - The handleInput method, which should receive user input, allowedKeys (DONE) and move the player according to that input. In particular:
        - Left key should move the player to the left, right key to the right, up should move the player up and down should move the player down. (DONE)
        - Recall that the player cannot move off screen (DONE)
        - If the player reaches the water the game should be reset by moving the player back to the initial location (DONE).
    -You can add your own Player methods as needed.
Once you have completed implementing the Player and Enemy, you should instantiate them by:
    - Creating a new Player object (DONE)
    - Creating several new Enemies objects and placing them in an array called allEnemies (DONE)*/


// Enemies our player must avoid
var Enemy = function(x,y) {

    var x,
        y,
        speed,
        sprite;

    this.reset(x,y);

    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    if (this.x < 1000){
        this.x = this.x + (this.speed * dt);
    } else {
        this.reset(-100, this.y);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function(x,y) {
     this.x = x;
     this.y = y;
     this.speed = (Math.random() * 300) + 300;
};

//Player Class
var Player = function(){

    var x,
        y,
        sprite,
        score,
        lives;

    this.reset();
    this.score = 0;
    this.lives = 2;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    this.checkCollisions();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (direction) {
    if (direction ==='left' && this.x > 0){
        this.x -= 101;
    } else if (direction === 'right' && this.x < 808) {
        this.x += 101;
    } else if (direction === 'up' && this.y > 80 ) {
        this.y -= 83;
    } else if (direction === 'down' && this.y < 474) {
        this.y += 83;
    } else if (this.y < 80 && this.y > 0 && this.x > 700 && this.x < 800 && star.starSelected === true){
        this.y -= 83;
    }
    console.log(this.x,this.y);
};

Player.prototype.reset = function() {
    this.x = 404;
    this.y = 475;
};

Player.prototype.checkCollisions = function(){
    //Check collisions with Enemies
    for(var i=0; i<allEnemies.length; i++){
        if(this.x < allEnemies[i].x + 70 && this.x + 55 > allEnemies[i].x &&
            this.y < allEnemies[i].y + 30 && this.y + 80 > allEnemies[i].y){

            console.log("Player (x/y: " + this.x + "/" + this.y + ")");
            console.log("Enemy " + i + " (x/y: " + allEnemies[i].x + "/" + allEnemies[i].y + ")" );
            player.reset();
        }
    }

    //Check collissions with Selector
    if(this.x < selector.x + 70 && this.x + 55 > selector.x &&
        this.y < selector.y + 30 && this.y + 50 > selector.y){

        console.log("Selector Pushed " + star.starSelected);
        if (star.starSelected === true){
        } else {
            star.reset();
        }
    }

    //Check collissions with Star
    if(this.x < star.x + 70 && this.x + 55 > star.x &&
        this.y < star.y + 30 && this.y + 80 > star.y){
        console.log("Star selected");
        star.starSelected = true;
        star.x = 0;
        star.y = 70;
        key.reset();
    }

    //Check collisions with Gems
    for(var i = 0; i<allGems.length; i++){
        if(this.x < allGems[i].x + 60 && this.x + 55 > allGems[i].x &&
            this.y < allGems[i].y + 30 && this.y + 80 > allGems[i].y){

            this.score += allGems[i].score;
            console.log("Gemscore: " + allGems[i].score);
            console.log("Total Score: " + this.score);
            allGems.splice(i,1);
        }
    }
    console.log(heart.x + " - " + heart.y);
    //Check collisions with Heart
    if(this.x < heart.x + 60 && this.x + 55 > heart.x &&
            this.y < heart.y + 15 && this.y + 80 > heart.y){

            this.lives++;
            console.log("Total Lives: " + this.lives);
            delete heart.x;
            delete heart.y;
    }
};

//Collectibles Class


//Selector Class
var Select = function(){
    this.x = 0;
    this.y = 43;
    this.sprite = 'images/selector.png';
};

Select.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Star Class
var Star = function(){
    var starSelected = false;
    this.sprite = 'images/Star.png';
};

Star.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Star.prototype.reset = function(){
    this.x = 606;
    this.y = 485;
};

//Gem Class
var Gem = function(color){
    var score;
    //Creating the right gem
    if (color === 'orange'){
        this.sprite = 'images/GemOrange.png';
        this.score = 50;
    } else if (color === 'green') {
        this.sprite = 'images/GemGreen.png';
        this.score = 100;
    } else {
        this.sprite = 'images/GemBlue.png';
        this.score = 200;
    }
    //setting the location
    this.reset();
};

Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.reset = function(){
    var col = Math.round(Math.random() * 8);
    var row = Math.round(Math.random() * 3 + 2);
    this.x = col * 101 + 20;
    this.y = row * 83 + 25;
};

//Key Class
var Key = function(){
    this.sprite = 'images/Key.png';
};

Key.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Key.prototype.reset = function(){
    this.x = 707;
    this.y = -20;
};

//Heart Class
var Heart = function(){
    this.sprite = 'images/Heart.png';
    this.reset();
};

Heart.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Heart.prototype.reset = function(){
    var col = Math.round(Math.random() * 8);
    var row = Math.round(Math.random() * 3 + 2);
    this.x = col * 101 + 20;
    this.y = row * 83 + 40;
};

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var selector = new Select();
var star = new Star();
var key = new Key();
var heart = new Heart();

var allEnemies = [];
allEnemies[0] = new Enemy(0,226);
allEnemies[1] = new Enemy(150,309);
allEnemies[2] = new Enemy(300,392);
allEnemies[3] = new Enemy(450,226);
allEnemies[4] = new Enemy(600,309);
allEnemies[5] = new Enemy(750,392);
allEnemies[6] = new Enemy(750,143);
allEnemies[7] = new Enemy(150,143);
allEnemies[8] = new Enemy(600,226);
allEnemies[9] = new Enemy(0,309);

var allGems = [];
allGems[0] = new Gem('green');
allGems[1] = new Gem('green');
allGems[2] = new Gem('orange');
allGems[3] = new Gem('blue');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
