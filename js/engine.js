/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.*/

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.*/
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 707;
    canvas.height = 587;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.*/
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call then check for collisions
     * of the player.*/
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.checkCollisions();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. This function is called every
     * game tick (or loop of the game engine)*/
    function render() {
        //This array holds the relative URL to the image used for each row
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png',
                'images/grass-block.png',
                'images/stone-block.png',
            ],
            numRows = 6,
            numCols = 7,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array to draw the correct */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.*/
                 if (row === 0 && col === 5 && star.selected === true){
                    ctx.drawImage(Resources.get('images/stone-block.png'), col * 101, row * 83);
                 } else {
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                 }
            }
        }

        //draw Gameinfos
        ctx.rect(0,0,151,40);
        ctx.rect(555,0,151,40);
        ctx.fillStyle = '#43A047';
        ctx.strokeStyle = '#333';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.font = '40px helvetica';
        ctx.fillText('Frogger', 287, 33);

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. */
    function renderEntities() {
        /* Loop through all of the objects call the render function you have defined.*/
        allGems.forEach(function(gem){
            gem.render();
        });
        heart.render();

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        selector.render();
        star.render();
        key.render();
        player.render();
        player.displayInfo();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/selector.png',
        'images/Star.png',
        'images/GemBlue.png',
        'images/GemGreen.png',
        'images/GemOrange.png',
        'images/Key.png',
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.*/
    global.ctx = ctx;
})(this);
