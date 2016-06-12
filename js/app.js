var Objects = function(x,y,sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

Objects.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
};

Objects.prototype.reset = function(x,y){
    this.x = x;
    this.y = y;
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
        this.reset(-100,this.y);
    }
};

Enemy.prototype.reset = function(x,y) {
     Objects.prototype.reset.call(this,x,y);
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

Player.prototype.displayInfo = function() {
    ctx.font = '25px Helvetica';
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: " + this.score, 570, 30);
    ctx.fillText("Lives: " + this.lives, 20,30);
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
    } else if (this.y < 80 && this.y > 0 && this.x > 500 && this.x < 600 && star.selected === true){
        this.y -= 83;
    }
};

//TO DO: Improve Collisions
Player.prototype.checkCollisions = function(){
    //Check collisions with Enemies
    for(var i=0; i<allEnemies.length; i++){
        if(this.x < allEnemies[i].x + 70 && this.x + 55 > allEnemies[i].x &&
            this.y < allEnemies[i].y + 30 && this.y + 80 > allEnemies[i].y){

            this.lives--;
            player.reset(303,392);

            //Game Over
            if(this.lives===0){
                ctx.fillText("GAME OVER", 280,30); //END GAME
            }
        }
    }
    //Check collisions with Gems
    for(var i = 0; i<allGems.length; i++){
        if(this.x < allGems[i].x + 60 && this.x + 55 > allGems[i].x &&
            this.y < allGems[i].y + 30 && this.y + 80 > allGems[i].y){

            this.score += allGems[i].score;
            allGems[i].reset();
        }
    }
    //Check collisions with Heart
    if(this.x < heart.x + 60 && this.x + 55 > heart.x &&
            this.y < heart.y + 15 && this.y + 80 > heart.y){

            this.lives++;
            delete heart.x;
            delete heart.y;
    }
    //Check collissions with Selector
    if(this.x < selector.x + 70 && this.x + 55 > selector.x &&
        this.y < selector.y + 30 && this.y + 50 > selector.y){

        if (star.selected === true){} else {
            star.reset(505,402);
        }
    }
    //Check collissions with Star
    if(this.x < star.x + 70 && this.x + 55 > star.x &&
        this.y < star.y + 30 && this.y + 80 > star.y){

        star.selected = true;
        star.reset(0,70);
        key.reset(518,10);
    }
    //Check collissions with Key
    if(this.x < key.x + 70 && this.x + 55 > key.x &&
        this.y < key.y + 30 && this.y + 80 > key.y){

        key.selected = true;
        this.score = this.score + this.lives * 500;
        console.log("Game won"); //END GAME
    }
};

//Selector Class
var Select = function(){
    Objects.call(this,0,43,'images/selector.png');
};
Select.prototype = Object.create(Objects.prototype);
Select.prototype.constructor = Select;

//Item Class
var Item = function(type){
    if (type==='Star'){
        Objects.call(this,-100,-100, 'images/Star.png');
    } else if (type === 'Key'){
        Objects.call(this, -100,-100,'images/Key.png');
    }
    var selected = false;
};
Item.prototype = Object.create(Objects.prototype);
Item.prototype.constructor = Item;

//Collectible Class
var Collectible = function(color){
    var score;
    //Creating the right gem
    if (color === 'orange'){
        Objects.call(this,-100,-100,'images/GemOrange.png')
        this.score = 50;
    } else if (color === 'green') {
        Objects.call(this,-100,-100,'images/GemGreen.png')
        this.score = 100;
    } else if (color === 'blue') {
        Objects.call(this,-100,-100,'images/GemBlue.png')
        this.score = 200;
    } else {
        //Heart
        Objects.call(this, -100, -100,'images/Heart.png');
    }
    //setting the location
    this.reset();
};
Collectible.prototype = Object.create(Objects.prototype);
Collectible.prototype.constructor = Collectible;

Collectible.prototype.reset = function(){
    //Random position on Grid (Grass)
    var col = Math.round(Math.random() * 6) * 101 + 20;
    var row = Math.round(Math.random() * 2 + 2) * 83 + 25;
    Objects.prototype.reset.call(this,col,row);
};

// Create Objects
var player = new Player();
var selector = new Select();
var star = new Item('Star');
var key = new Item('Key');
var heart = new Collectible();

var allEnemies = [];
allEnemies[0] = new Enemy(0,226);
allEnemies[1] = new Enemy(150,309);
allEnemies[2] = new Enemy(450,226);
allEnemies[3] = new Enemy(600,309);
allEnemies[4] = new Enemy(750,143);
allEnemies[5] = new Enemy(150,143);

var allGems = [];
allGems[0] = new Collectible('green');
allGems[1] = new Collectible('green');
allGems[2] = new Collectible('orange');
allGems[3] = new Collectible('blue');

// This listens for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
