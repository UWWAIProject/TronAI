/**
 * Example of randomly moving AI (it sucks, you probably shouldn't use it).
 */
tronament.aiModule("bail-ai", function() {
    var direction = 1;
    this.getDirection = function(){
        return direction;
    }
    this.onReady = function() {
        this.message("It's go-time!");
    }

    this.onDeath = function() {
        this.message("Curse you, Lightyear!");
    }

    /**
     * Moves based on some randomness and some checks.
     */
    this.move = function() {
        if (!this.directionIsSafe(direction)) {
            this.message("Whoa! Not that way!");
            direction = this.findBestDirection();
        }

        return direction;
    }

    /**
     * Makes sure a given direction is a safe move.
     */
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
    this.findBestDirection = function(){
        var max = 0;
        var maxDir = direction;
        for (var key in tronament.DIRECTIONS){
            var dir = tronament.DIRECTIONS[key];
            if (dir !== direction && dir !== tronament.getOppositeDirection(direction)){
                var score = this.directionScore(dir);
                if (score>max){
                    max = score;
                    maxDir = dir;
                }
            }
        }
        return maxDir;
    }

    this.directionScore = function(direction){
        var tempy = 0,
            tempx = 0,
            curDist = 0,
            incVal;
        if (direction == tronament.EAST) {
            incVal = function(){
                tempx++;
            }
        } else if (direction == tronament.SOUTH) {
            incVal = function(){
                tempy++;
            }
        } else if (direction == tronament.WEST) {
            incVal = function(){
                tempx--;
            }
        } else if (direction == tronament.NORTH) {
            incVal = function(){
                tempy--;
            }
        }
        //Start with one box in whatever direction we are checking right now
        incVal();
        while(this.queryRelative(tempx, tempy) === 0){
            incVal();
            curDist++;
        }
        return curDist;
    }
});
