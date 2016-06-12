var Objects = function(x,y,sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

Objects.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
};

// Enemies Class
var Enemy = function(x,y) {
    Objects.call(this,x,y,'images/enemy-bug.png');
    this.reset(x,y);
};

Enemy.prototype = Object.create(Objects.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game; Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x < 800){
        this.x = this.x + (this.speed * dt);
    } else {
        this.reset(-100, this.y);
    }
};

Enemy.prototype.reset = function(x,y) {
     this.x = x;
     this.y = y;
     this.speed = (Math.random() * 300) + 300;
};

// Player Class
var Player = function(){
    Objects.call(this,303,392,'images/char-boy.png');
    this.score = 0;
    this.lives = 2;
};
Player.prototype = Object.create(Objects.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    this.checkCollisions();
};

Player.prototype.renderInfo = function() {
    ctx.font = '25px Arial';
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + this.score, 545, 30);
    ctx.fillText("Lives: " + this.lives, 45,30);
};

Player.prototype.handleInput = function (direction) {
    if (direction ==='left' && this.x > 0){
        this.x -= 101;
    } else if (direction === 'right' && this.x < 606) {
        this.x += 101;
    } else if (direction === 'up' && this.y > 80 ) {
        this.y -= 83;
    } else if (direction === 'down' && this.y < 390) {
        this.y += 83;
    } else if (this.y < 80 && this.y > 0 && this.x > 500 && this.x < 600 && star.starSelected === true){
        this.y -= 83;
    }
    console.log(this.x,this.y);
};

Player.prototype.reset = function() {
    this.x = 303;
    this.y = 392;
};

Player.prototype.checkCollisions = function(){
    //Check collisions with Enemies
    for(var i=0; i<allEnemies.length; i++){
        if(this.x < allEnemies[i].x + 70 && this.x + 55 > allEnemies[i].x &&
            this.y < allEnemies[i].y + 30 && this.y + 80 > allEnemies[i].y){

            this.lives--;
            player.reset();

            //Game Over
            if(this.lives===0){
                ctx.fillText("GAME OVER", 280,30);
            }
        }
    }

    //Check collissions with Selector
    if(this.x < selector.x + 70 && this.x + 55 > selector.x &&
        this.y < selector.y + 30 && this.y + 50 > selector.y){

        if (star.starSelected === true){
        } else {
            star.reset();
        }
    }

    //Check collissions with Star
    if(this.x < star.x + 70 && this.x + 55 > star.x &&
        this.y < star.y + 30 && this.y + 80 > star.y){

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
            allGems.splice(i,1);
        }
    }

    //Check collisions with Heart
    if(this.x < heart.x + 60 && this.x + 55 > heart.x &&
            this.y < heart.y + 15 && this.y + 80 > heart.y){

            this.lives++;
            delete heart.x;
            delete heart.y;
    }
};

//Selector Class
var Select = function(){
    Objects.call(this,0,43,'images/selector.png');
};
Select.prototype = Object.create(Objects.prototype);
Select.prototype.constructor = Select;

//Star Class
var Star = function(){
    Objects.call(this,-100,-100, 'images/Star.png');
    var starSelected = false;
};
Star.prototype = Object.create(Objects.prototype);
Star.prototype.constructor = Star;

Star.prototype.reset = function(){
    this.x = 505;
    this.y = 402;
};

//Gem Class
var Gem = function(color){
    var score;
    //Creating the right gem
    if (color === 'orange'){
        Objects.call(this,-100,-100,'images/GemOrange.png')
        this.score = 50;
    } else if (color === 'green') {
        Objects.call(this,-100,-100,'images/GemGreen.png')
        this.score = 100;
    } else {
        Objects.call(this,-100,-100,'images/GemBlue.png')
        this.score = 200;
    }
    //setting the location
    this.reset();
};
Gem.prototype = Object.create(Objects.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.reset = function(){
    var col = Math.round(Math.random() * 6);
    var row = Math.round(Math.random() * 2 + 2);
    this.x = col * 101 + 20;
    this.y = row * 83 + 25;
};

//Key Class
var Key = function(){
    Objects.call(this, -100,-100,'images/Key.png');
};
Key.prototype = Object.create(Objects.prototype);
Key.prototype.constructor = Key;

Key.prototype.reset = function(){
    this.x = 505;
    this.y = -20;
};

//Heart Class
var Heart = function(){
    Objects.call(this, -100, -100,'images/Heart.png');
    this.reset();
};
Heart.prototype = Object.create(Objects.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.reset = function(){
    var col = Math.round(Math.random() * 6);
    var row = Math.round(Math.random() * 2 + 2);
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
allEnemies[2] = new Enemy(450,226);
allEnemies[3] = new Enemy(600,309);
allEnemies[4] = new Enemy(750,143);
allEnemies[5] = new Enemy(150,143);

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
