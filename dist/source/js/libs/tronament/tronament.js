
window.tronament = new function() {
    var that = this;
    // some constants
    that.NORTH = 1;
    that.SOUTH = 2;
    that.WEST = 3;
    that.EAST = 4;
    that.DIRECTIONS = [
        that.NORTH,
        that.SOUTH,
        that.WEST,
        that.EAST
    ]

    that.EMPTY = 0;
    that.TRAIL = 1;
    that.OPPONENT = 2;
    that.WALL = 4;
    that.OUT_OF_BOUNDS = 8;

    // game options
    that.options = {
        playerCount: 2,
        fastMovement: false
    }

    // some debug options
    that.debug = {
        // indicates if the framerate should be displayed on the canvas
        showFps: false,
        // the current frame rate
        fps: 0,
        maxFps: 60
    };

    // times used for scheduling, keeping track of frame rate, etc...
    var lastDrawTime, lastSecondTime, lastTickTime;

    // variables used for drawing to the canvas
    var canvas, ctx;

    // a map of all loaded AI classes
    that.aiModules = [];
    // an array of currently active players
    var players = [];
    // an array containing the coordinates of each player
    var playerCoordinates = [];
    // the dimensions of the board grid
    var boardWidth, boardHeight;
    // a 2d array that stores a collision map for each position on the grid
    that.collisionMap = [[]];
    var squareWidth, squareHeight;
    var timer;
    var running = false;
    var lastLoadedModule;
    var alivePlayerCount = 0;

    /**
     * Initializes the Tronament game engine.
     *
     * @param Element canvasElement The canvas element to be used for drawing.
     */
    that.init = function() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        that.setBoardSize(48, 48);
    }

    /**
     * Gets the dimensions of the board.
     *
     * @return Object An object whose "width" property is the width of the board
     *                and "height" property is the height of the board.
     */
    that.getBoardSize = function() {
        return {
            width: boardWidth,
            height: boardHeight
        };
    }

    /**
     * Sets the dimensions of the board.
     *
     * @param Number width  The new board width.
     * @param Number height The new board height.
     */
    that.setBoardSize = function(width, height) {
        boardWidth = width;
        boardHeight = height;

        // do some calculations ahead of time for rendering performance
        squareWidth = Math.round(canvas.width / boardWidth);
        squareHeight = Math.round(canvas.height / boardHeight);
    }

    /**
     * Gets the opposite direction
     * @return direction
     */
    that.getOppositeDirection = function(direction){
        switch (direction){
            case tronament.NORTH:
                return tronament.SOUTH;
            case tronament.SOUTH:
                return tronament.NORTH;
            case tronament.WEST:
                return tronament.EAST;
            case tronament.EAST:
                return tronament.WEST;
        }

    }
    /**
     * Gets the dimensions of the board.
     * @param i OPTIONAL the player to get coordinates of
     * @return Object An object whose "width" property is the width of the board
     *                and "height" property is the height of the board.
     */
    that.getPlayerCoordinates = function(i) {
        return playerCoordinates[i];
    };

    /**
     * Bootstraps an AI module prototype.
     *
     * Here there be dragons. that method uses some meta-programming
     * techniques, so be sure to remember who's who and what's what.
     *
     * @param String   name        The module name.
     * @param Function constructor An object constructor.
     */
    that.aiModule = function(name, constructor) {
        constructor.prototype.name = name;

        // next, define some useful methods for the module to use...

        /**
         * Queries the game for what is at an absolute location.
         *
         * @param  Number  x The x-coordinate of the position.
         * @param  Number  y The y-coordinate of the position.
         * @return Number    A Space value indicating what is in the space.
         */
        constructor.prototype.queryAbsolute = function(x, y) {
            var playerIndex = players.indexOf(this);
            var result = tronament.query(x, y);

            // do an additional check for opponent trail
            if (result == tronament.TRAIL && that.collisionMap[x] && that.collisionMap[x][y] != playerIndex) {
                result = tronament.OPPONENT;
            }

            return result;
        }

        /**
         * Queries the game for what is at a location relative to the player's current position.
         *
         * @param  Number  x The x-coordinate offset of the position.
         * @param  Number  y The y-coordinate offset of the position.
         * @return Number    A Space value indicating what is in the space.
         */
        constructor.prototype.queryRelative = function(x, y) {
            var playerIndex = players.indexOf(this);
            return this.queryAbsolute(playerCoordinates[playerIndex].x + x, playerCoordinates[playerIndex].y + y);
        }

        //constructor.prototype.getCurrentPos = function(){
        //	var positions = [playerCoordinates[playerIndex].x, playerCoordinates[playerIndex].y];
        //	return positons
        //}

        /**
         * Displays a fun message in the Tronament UI.
         *
         * @param String message The message to display.
         */
        constructor.prototype.message = function(message) {
            var playerIndex = players.indexOf(this);
            var messageBox = document.getElementById("player-" + (playerIndex + 1) + "-message");
            console.log('Player' + playerIndex + ': ' + message);
            messageBox.value = message;
        }

        constructor.prototype.getDirection = function(){
            return this.direction;
        }
        that.aiModules[name] = constructor;
        lastLoadedModule = name;
    }

    /**
     * Loads a module from file.
     */
    that.loadModule = function() {
        // open the file chooser
        that.ui.openFilePicker(function(files) {
            // get the chosen file
            var file = files[0];
            var objectURL = window.URL.createObjectURL(file);

            // load the script
            var script = document.createElement("script");
            script.src = objectURL;
            document.body.appendChild(script);

            // update the player widgets after the module is loaded
            script.onload = function() {
                that.ui.updatePlayerWidgets();
            }.bind(that);
        }.bind(that));
    }

    /**
     * Sets the resolution of the canvas.
     *
     * @param Number width  The new canvas width.
     * @param Number height The new canvas height.
     */
    that.setResolution = function(width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    /**
     * Queries the game for what is at a given location.
     *
     * @param  Number  x The x-coordinate of the position.
     * @param  Number  y The y-coordinate of the position.
     * @return Number    A Space value indicating what is in the space.
     */
    that.query = function(x, y) {
        if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) {
            return that.OUT_OF_BOUNDS;
        }
        if (that.collisionMap[x] != undefined && that.collisionMap[x][y] != undefined) {
            return that.TRAIL;
        }
        return that.EMPTY;
    }

    /**
     * Resets all the game variables and starts a new game running.
     */
    that.start = function() {
        players = [];
        that.collisionMap = [[]];
        playerCoordinates = [
            { x: Math.floor(boardWidth * 0.1), y: Math.floor(boardHeight * 0.1) },
            { x: Math.floor(boardWidth * 0.9), y: Math.floor(boardHeight * 0.9) },
            { x: Math.floor(boardWidth * 0.1), y: Math.floor(boardHeight * 0.9) },
            { x: Math.floor(boardWidth * 0.9), y: Math.floor(boardHeight * 0.1) }
        ];

        // create player objects
        for (var i = 0; i < that.options.playerCount; i++) {
            // get the desired a.i. module for that player
            var name = document.getElementById("player-ai-" + (i + 1)).value;

            // initialize an a.i. module instance
            try {
                var instance = new that.aiModules[name]();
            } catch(e) {
                console.log(e);
                tronament.ui.showDialog("Error", "The A.I. \"" + name + "\" created the following exception: " + e.message);
                return;
            }

            // set player's color as requested
            instance.color = document.getElementById("player-color-" + (i + 1)).value;

            // let the a.i. know we are ready
            players[i] = instance;

        }
        players.forEach(function(player,index,array){
            if (typeof instance.onReady === "function") {
                player.onReady(index,array);
            }

        });

        alivePlayerCount = players.length;
        running = true;
        mainLoop();
    }

    /**
     * Ends the game.
     */
    that.end = function(player) {
        terminateLoop();
        tronament.ui.showDialog("Game Over", "Player " + (players.indexOf(player) + 1) + " (" + player.name + ") Wins!", true);
        tronament.ui.playAudio("sound2");
    }

    var terminateLoop = function() {
        running = false;
        cancelAnimationFrame(timer);
    }

    /**
     * The main game loop that gets called repeatedly.
     */
    var mainLoop = function() {
        if (!running) {
            return;
        }

        // schedule the main loop to be called again
        timer = requestAnimationFrame(mainLoop);

        // initialize timers
        if (!lastDrawTime || !lastSecondTime || !lastTickTime) {
            lastDrawTime = lastSecondTime = lastTickTime = timestamp();
        }

        var now = timestamp();
        // update fps every second
        if (now - lastSecondTime > 1000) {
            var delta = (now - lastDrawTime) / 1000;
            that.debug.fps = 1 / delta;
            lastSecondTime = now;
        }

        // check if it is time to run the next game tick based on speed setting
        if (that.options.fastMovement || now - lastTickTime > 100) {
            tick();
            lastTickTime = now; // update tick time since we just called it
        }

        // render the display canvas
        draw();
        lastDrawTime = now;
    }.bind(that);

    var timestamp = function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    /**
     * Executes a single tick of the game loop.
     */
    var tick = function() {
        // ask each player to respond with their move
        for (var i = 0; i < players.length; i++) {
            // ignore dead players :(
            if (players[i].__dead) {
                continue;
            }

            // tell the player to move
            try {
                var move = players[i].move(that);
                players[i].direction = move;
            } catch(e) {
                console.log(e);
                tronament.ui.showDialog("Error", "The A.I. \"" + players[i].name + "\" created the following exception: " + e.message);
                terminateLoop();
                return;
            }

            // adjust the player position based on the direction
            if (move == that.EAST) {
                playerCoordinates[i].x++;
            } else if (move == that.SOUTH) {
                playerCoordinates[i].y++;
            } else if (move == that.WEST) {
                playerCoordinates[i].x--;
            } else if (move == that.NORTH) {
                playerCoordinates[i].y--;
            }

            if (that.query(playerCoordinates[i].x, playerCoordinates[i].y)) {
                playerDeath(i);
            } else {
                fill(i, playerCoordinates[i].x, playerCoordinates[i].y);
            }
        }
    }.bind(that);

    /**
     * Fills a player's position into the collision map.
     *
     * @param Number x The x-coordinate of the position.
     * @param Number y The y-coordinate of the position.
     */
    var fill = function(playerIndex, x, y) {
        if (that.collisionMap[x] == undefined) {
            that.collisionMap[x] = [];
        }
        that.collisionMap[x][y] = playerIndex;
    }.bind(that);

    /**
     * Removes a player from the game.
     */
    var playerDeath = function(i) {
        // tell the a.i. that it died
        if (typeof players[i].onDeath === "function") {
            players[i].onDeath();
        }

        // remove player from game
        alivePlayerCount--;
        players[i].__dead = true;

        if (alivePlayerCount <= 1) {
            for (var i = 0; i < players.length; i++) {
                if (!players[i].__dead) {
                    that.end(players[i]);
                }
            }
        }
    }.bind(that);

    /**
     * Renders the game screen to the canvas.
     */
    var draw = function() {
        // wipe the canvas clean
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // calculate the size of the trails

        // render all trails
        for (var x = 0; x < that.collisionMap.length; x++) {
            if (that.collisionMap[x] != undefined) {
                for (var y = 0; y < that.collisionMap[x].length; y++) {
                    if (that.collisionMap[x][y] != undefined) {
                        var player = players[that.collisionMap[x][y]];
                        ctx.fillStyle = player.color;
                        ctx.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    }
                }
            }
        }

        // draw the grid
        ctx.strokeStyle = "#334";
        ctx.beginPath();
        for (var i = 0; i < boardWidth; i++) {
            ctx.moveTo(i * squareWidth, 0);
            ctx.lineTo(i * squareWidth, canvas.height);
        }
        for (var i = 0; i < boardHeight; i++) {
            ctx.moveTo(0, i * squareHeight);
            ctx.lineTo(canvas.width, i * squareHeight);
        }
        ctx.stroke();

        // render debug info
        if (that.debug.showFps) {
            ctx.fillStyle = "white";
            ctx.font = "24px Silkscreen";
            ctx.textAlign = "end";
            ctx.textBaseline = "bottom";
            ctx.fillText("FPS: " + that.debug.fps.toFixed(2), canvas.width - 10, canvas.height - 10);
        }
    }.bind(that);
};
