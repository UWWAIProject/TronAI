/**
 * Example of randomly moving AI (it sucks, you probably shouldn't use it).
 */
tronament.aiModule("Chase AI", function() {
    var direction = 1;
    var enemyPos = "nothing";

    this.onReady = function() {
        //this.message("Hello");
    }

    this.onDeath = function() {
        //this.message("Curse you, Lightyear!");
    }

    this.find = function(){
        if (enemyPos == "nothing")
            this.scan();
        else{
            this.message(enemyPos);
            //if(this.queryAbsolute)
        }
    }

    this.scan = function(){
        for(var i=0; i<48; i++){
            for(var j=0; j<48; j++){
                //this.message("hello" + j);
                if(this.queryAbsolute(i,j) == tronament.OPPONENT){
                    enemyPos = i + "," + j;
                    //this.message(enemyPos);
                    break;
                	break;
                }
            }
        }
    }

    this.dis = function(){
        this.message(enemyPos);
    }

    /**
     * Moves based on some randomness and some checks.
     */
    this.move = function() {
        var move = Math.floor((Math.random() * 50) + 1);
        this.find();
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
