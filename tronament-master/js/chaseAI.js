/**
 * Example of randomly moving AI (it sucks, you probably shouldn't use it).
 */
tronament.aiModule("Chase AI", function() {
    var direction = 1;
    this.index = -1;
    this.players = [];
    enemy_x = 2;
    enemey_y = 2;

    this.onReady = function(index, players) {
        this.index = index;
        this.players = players;
    }

    this.onDeath = function() {

    }

    this.find = function(){
        var result =[]
        for(var i = 0; i<this.players.length;i++){
            if (i === this.index){
                continue;
            }
            result.push(tronament.getPlayerCoordinates(i));
        }
        enemy_x = result[0].x;
        enemy_y = result[0].y;
        console.log(result[0].x + " , " + result[0].y);
    }

    this.scan = function(){
        for(var i=0; i<tronament.getBoardSize().width; i++){
            for(var j=0; j<tronament.getBoardSize().height; j++){
                    //saving this one for bail
                }
            }
        }



    this.chase = function(){
        favors_hor = "none";
        favors_vert = "none";
        //this.message(this.getCurrentPos()[0] + ", " + this.getCurrentPos()[1]);
        this.getCurrentPos();
    }

    /**
     * Moves based on some randomness and some checks.
     */
    this.move = function() {
        this.find();
        var move = Math.floor((Math.random() * 50) + 1);
        this.chase();
        if (move == tronament.EAST && this.directionIsSafe(move)) {
            direction = tronament.EAST;
        } else if (move == tronament.SOUTH && this.directionIsSafe(move)) {
            direction = tronament.SOUTH;
        } else if (move == tronament.WEST && this.directionIsSafe(move)) {
            direction = tronament.WEST;
        } else if (move == tronament.NORTH && this.directionIsSafe(move)) {
            direction = tronament.NORTH;
        }

        if (!this.directionIsSafe(direction)) {
            //this.message("Whoa! Not that way!");
            if (this.directionIsSafe(tronament.EAST)) {
                direction = tronament.EAST;
            } if (this.directionIsSafe(tronament.SOUTH)) {
                direction = tronament.SOUTH;
            } if (this.directionIsSafe(tronament.WEST)) {
                direction = tronament.WEST;
            } if (this.directionIsSafe(tronament.NORTH)) {
                direction = tronament.NORTH;
            }
        }

        return direction;
    }

    
     // Makes sure a given direction is a safe move.
     
    this.directionIsSafe = function(direction) {
        if (direction == tronament.EAST && this.queryRelative(1, 0)) {
            return false;
        } else if (direction == tronament.SOUTH && this.queryRelative(0, 1)) {
            return false;
        } else if (direction == tronament.WEST && this.queryRelative(-1, 0)) {
            return false;
        } else if (direction == tronament.NORTH && this.queryRelative(0, -1)) {
            return false;
        }
        return true;
    }
});
