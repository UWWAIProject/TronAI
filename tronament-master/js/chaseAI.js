
tronament.aiModule("Chase AI", function() {
    var that = this;
    that.direction = 1;
    that.index = -1;
    that.players = [];
    var my_x = 2;
    var my_y = 2;
    that.closestEnemy;
    var closestEnemyX = 2;
    var closestEnemyY = 2;
    var grid = [[]];
    that.generateGrid = function(){
        for (var i = 0; i<tronament.getBoardSize().width; i++){
            grid[i] = [];
            for (var j =0 ; j<tronament.getBoardSize().height;j++){
                grid[i][j] = 1;
            }
        }
    }

    that.updateGrid = function(){
         for (var xCol in tronament.collisionMap){
             for(var yCol in tronament.collisionMap[xCol]){
                 grid[xCol][yCol] = 0;
             }
        }

    }

    that.onReady = function(index, players) {
        that.generateGrid();
        that.index = index;
        that.players = players;
    }

    that.find = function(){
        var result;
        for(var i = 0; i<that.players.length;i++){
            if (i === that.index){
                continue;
            }
            var enemyCoords = tronament.getPlayerCoordinates(i);
            var enemyDist = astar.manhattan(enemyCoords, tronament.getPlayerCoordinates(that.index));
            if (!result || enemyDist < result.dist){
                result = {player: that.players[i], dist: enemyDist, coords: enemyCoords};
            }
        }
        that.closestEnemy = result.player;
        that.closestEnemyDist = result.dist;
        my_x = tronament.getPlayerCoordinates(that.index).x;
        my_y = tronament.getPlayerCoordinates(that.index).y;
        closestEnemyX = result.coords.x;
        closestEnemyY = result.coords.y;
        console.log('Enemy: (' +closestEnemyX + ' , ' + closestEnemyY + ') MY: (' + my_x + ' , ' + my_y + ')');
    }

    that.scan = function(){
        for(var i=0; i<tronament.getBoardSize().width; i++){
            for(var j=0; j<tronament.getBoardSize().height; j++){
                    //saving this one for bail
                }
            }
        }

    that.chase = function(){
        /* favors is a string that's either up, down, left or right that, based on the vert/hori weight decide whether to hug the line
        ** above, below, to the left of, or two the right of the opponent.  The weighting will measure distance between players and in what
        ** direction, then favor will determine which distance is shorter, then favor that direction to hug the line.  from there we will make
        ** a coordinate point. 
        */
        var x = closestEnemyX,
            y = closestEnemyY,
            dx = 0;
            dy = 0;
        var invalid = [];
        switch (that.closestEnemy.getDirection()) {
            case tronament.NORTH:
                dy = -1;
                break;
            case tronament.SOUTH:
                dy = 1;
                break;
            case tronament.WEST:
                dx = -1;
                break;
            case tronament.EAST:
                dx = 1;
                break;
        }
        //This cool little function checks to make sure that this cell is open
        //If it is not open it will flip the deltaX and deltaY untill it finds one.
        var counter = 0;
        var checkBounds = function checkBounds(dx1,dy1){
            if (Math.abs(dx1) > 8 || Math.abs(dx1) > 8){
                throw new Error("Cannot Find Route to Enemy");
            }
            function tryAnotherDirection(){
                //Flip the delta values and multiply by -1. this way it will cycle through all of the
                // possible cells around the enemy position
                //Avoid an infinite loop, if there are no open spots
                counter++;
                if (counter < 5){
                    return checkBounds(dy1 * -1, dx1 * -1);
                }else{
                    //Increment the delta values to widen the search;
                    counter = 0;
                    return checkBounds(dx1*2,dy1*2);
                }
            }
            var destContent = that.queryAbsolute(closestEnemyX + dx1, closestEnemyY + dy1);
            if (destContent !== tronament.EMPTY){
                return tryAnotherDirection();
            }else{
                for(var i in invalid){
                    if (dx == invalid[i].x && dy == invalid[i].y){
                        return tryAnotherDirection(); //Return so that dx or dy aren't changed
                    }
                }
                //Has not returned, so this set is not invalid
                dx=dx1;
                dy=dy1;
            }
        };


        while(!result){
            checkBounds(dx,dy);
            //Add this set to the invalid array so that it is not tried again
            invalid.push({x:dx,y:dy});
            var result = that.goto(closestEnemyX+dx,closestEnemyY+dy);
        }
        return result;
    }

    that.goto = function(x,y){
        that.updateGrid();

        var result = new GraphSearch(grid,new GridNode(my_x,my_y,grid[my_x][my_y]),new GridNode(x,y,grid[x][y]));
        if (result || result.nextMove() || result.nextMove()[0]){
            return result.nextMove()[0];
        }else{
            debugger;
        }


    }

    /**
     * Moves based on some randomness and some checks.
     */
    that.move = function() {
        that.find();
        try{
            move = that.chase();
        }catch(e){
            console.log("Cannot find route to enemy");
            //Just find a safe direction to go now
            return that.getSafeDirection();
        }
        if (!move){
            debugger;
            that.chase();
        }
        if(move.x != my_x){
            if(move.x > my_x){
                that.direction=tronament.EAST;
            }
            else{
                that.direction=tronament.WEST;
            }
        }
        if (move.y != my_y){
            if(move.y > my_y){
                that.direction=tronament.SOUTH;
            }
            else{
                that.direction=tronament.NORTH;
            }
        }
        return that.direction;
    }

    that.getSafeDirection = function () {
        if(that.directionIsSafe(that.direction)){
            return that.direction;
        }

            for (var dir in tronament.DIRECTIONS){
                if (that.directionIsSafe(tronament.DIRECTIONS[dir])){
                    return tronament.DIRECTIONS[dir];
                }
            }
    };
     // Makes sure a given direction is a safe move.
     
    that.directionIsSafe = function(direction) {
        if (direction == tronament.EAST && that.queryRelative(1, 0)) {
            return false;
        } else if (direction == tronament.SOUTH && that.queryRelative(0, 1)) {
            return false;
        } else if (direction == tronament.WEST && that.queryRelative(-1, 0)) {
            return false;
        } else if (direction == tronament.NORTH && that.queryRelative(0, -1)) {
            return false;
        }
        return true;
    }
});
