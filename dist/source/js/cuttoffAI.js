/**
 * example of how an attack AI would be implemented.
 * The Attack AI would be initiated when there is an opponent within 5 squares. This will try to cut them off,
 * box them in, or some other offensive move.
 */
tronament.aiModule("cuttoff-ai-NON-WORKING", function() {
    var direction = 1;
    this.index = -1;
    this.players = [];
    my_x = 2;
    my_y = 2;
    closestEnemyX = 2;
    enemey_y = 2;

    this.getDirection = function(){
        return direction;
    }
    this.onReady = function(index, players) {
        this.index = index;
        this.players = players;
    }

    this.onDeath = function() {

    }
    /**
     * Moves based on some randomness and some checks.
     */
    this.move = function() {
        //First check to see if we can cuttoff the other player
        this.checkForCutOff();

        if (!this.directionIsSafe(direction)) {
            this.message("Whoa! Not that way!");
            direction = this.findBestDirection();
        }

        return direction;
    }
    this.checkForCutOff = function(){
        //returns relative coordinates based on our direction
        /*
                                                        over
                                             +  (right)             - (left)
           Behind       + (behind)      behind to the right     behind to the left
                        - (in front)    in front to the right   in front to the left
         */
        dirBasedCoords = function(x,y){
            switch (direction){
                case tronament.NORTH:
                    return {behind: y-my_y, over: x-my_x, overDir: tronament.EAST};
                case tronament.SOUTH:
                    return {behind: my_y-y, over: my_x-x, overDir: tronament.WEST};
                case tronament.WEST:
                    return {behind: x-my_x, over: my_y-y, overDir: tronament.NORTH};
                case tronament.EAST:
                    return {behind: my_x-x, over: y-my_y, overDir: tronament.SOUTH};
            }
        };
        var cutOffCandidates = [];
        for (var i =0;i<this.players.length;i++){
            if (i!==this.index){
                var coords = dirBasedCoords(this.players[i]);
                if (this.players[i].getDirection() === this.getDirection()){
                    if (coords.behind > Math.abs(coords.over)){ /*&& this.players[i].getDirection() == this.getDirection()*/
                        //It is possible to cut this off, it will require traveling coords.over blocks, add it to the array
                        cutOffCandidates.push({playerIdx: i, coords: coords});
                    }
                }else if(this.players[i].getDirection() === tronament.getOppositeDirection(this.getDirection())){
                    //Check to see if we can cut off an enemy coming towards us
                    if (Math.abs(coords.behind) > Math.abs(coords.over)){ /*&& this.players[i].getDirection() == this.getDirection()*/
                        //It is possible to cut this off, it will require traveling coords.over blocks, add it to the array
                        cutOffCandidates.push({playerIdx: i, coords: coords});
                    }
                }else if(this.players[i].getDirection() === coords.overDir || this.players[i].getDirection() === tronament.getOppositeDirection(coords.overDir)){
                    //Check to see if we can cut off an enemy going left or right
                    if (Math.abs(coords.behind) < Math.abs(coords.over)){ /*&& this.players[i].getDirection() == this.getDirection()*/
                        //It is possible to cut this off, it will require traveling coords.over blocks, add it to the array
                        cutOffCandidates.push({playerIdx: i, coords: coords});
                    }
                }
            }
        }
        var closestCutOff;
        for(var opt in cutOffCandidates){
            if(!closestCutOff || (Math.abs(cutOffCandidates[opt].coords.over) < Math.abs(closestCutOff.coords.over))){
                closestCutOff = cutOffCandidates[opt];
            }
        }
        //get the coords to go to
        if (closestCutOff){
            console.log('CUT OFF OPTION ' + closestCutOff);
            var player = this.players[closestCutOff.playerIdx];
            var absCoords = {x:player.x, y:player.y};
            if (closestCutOff.coords.over >0){
                direction = closestCutOff.coords.overDir;
            }else{
                direction = tronament.getOppositeDirection(closestCutOff.coords.overDir);
            }
        }
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
