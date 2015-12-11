/**
 * Example of randomly moving AI (it sucks, you probably shouldn't use it).
 */
tronament.aiModule("Chase AI", function() {
    var direction = 1;
    this.index = -1;
    this.players = [];
    my_x = 2;
    my_y = 2;
    enemy_x = 2;
    enemey_y = 2;
    grid = [[]];

    this.generateGrid = function(){
        for (var i = 0; i<tronament.getBoardSize().width; i++){
            grid[i] = [];
            for (var j =0 ; j<tronament.getBoardSize().height;j++){
                grid[i][j] = 1;
            }
        }
    }

    this.updateGrid = function(){
        if(tronament.collisionMap.length>0){
             for (var i = 0; i<tronament.getBoardSize().width; i++){
                if(tronament.collisionMap[i] !== undefined){
                    for (var j =0 ; j<tronament.getBoardSize().height;j++){
                        if(tronament.collisionMap[i][j] !== undefined && enemy_x !==i && enemy_y !==j){
                                grid[i][j] = 0;

                        }
                    }
                }
            }
        }

    }

    this.onReady = function(index, players) {
        this.generateGrid();
        this.index = index;
        this.players = players;
    }

    this.find = function(){
        var result =[]
        for(var i = 0; i<this.players.length;i++){
            if (i === this.index){
                continue;
            }
            result.push(tronament.getPlayerCoordinates(i));
        }
        my_x = tronament.getPlayerCoordinates(this.index).x;
        my_y = tronament.getPlayerCoordinates(this.index).y;
        enemy_x = result[0].x;
        enemy_y = result[0].y;
        console.log(result[0].x + " , " + result[0].y + " MY: " + my_x + " , " + my_y);
    }

    this.scan = function(){
        for(var i=0; i<tronament.getBoardSize().width; i++){
            for(var j=0; j<tronament.getBoardSize().height; j++){
                    //saving this one for bail
                }
            }
        }

    this.chase = function(){
        /* favors is a string that's either up, down, left or right that, based on the vert/hori weight decide whether to hug the line
        ** above, below, to the left of, or two the right of the opponent.  The weighting will measure distance between players and in what
        ** direction, then favor will determine which distance is shorter, then favor that direction to hug the line.  from there we will make
        ** a coordinate point. 
        */

        // vert_weight = enemy_x - my_x;
        // hori_weight = enemy_y - my_y;

        // if(Math.abs(vert_weight) > Math.abs(hori_weight) && hori_weight > 0){
        //         //favor left side
        //         return this.goto(enemy_x-1, enemy_y);
        // }

        // if(Math.abs(vert_weight) > Math.abs(hori_weight) && hori_weight < 0){
        //         //favor right side
        //         return this.goto(enemy_x+1, enemy_y);
        // }

        // if(Math.abs(vert_weight) < Math.abs(hori_weight) && vert_weight > 0){
        //         //favor above
        //         return this.goto(enemy_x, enemy_y-1);
        // }

        // if(Math.abs(vert_weight) < Math.abs(hori_weight) && vert_weight < 0){
        //         //favor below
        //         return this.goto(enemy_x, enemy_y+1);
        // }

        return this.goto(enemy_x,enemy_y);

        //determining point based on favor

        //I'll figure out the directions tomorrow
        //@TODO have function to determine our current position
    }

    this.goto = function(x,y){
        this.updateGrid();

        var result = new GraphSearch(grid,new GridNode(my_x,my_y,grid[my_x][my_y]),new GridNode(x,y,grid[x][y]));
        return result.nextMove()[0];

    }

    /**
     * Moves based on some randomness and some checks.
     */
    this.move = function() {
        this.find();
        move = this.chase();
        if(move.x != my_x){
            if(move.x > my_x){
                direction=tronament.EAST;
            }
            else{
                 direction=tronament.WEST;
            }
        }
        if (move.y != my_y){
            if(move.y > my_y){
                direction=tronament.SOUTH;
            }
            else{
                 direction=tronament.NORTH;
            }
        }
        //this.chase();
        // if (move == tronament.EAST && this.directionIsSafe(move)) {
        //     direction = tronament.EAST;
        // } else if (move == tronament.SOUTH && this.directionIsSafe(move)) {
        //     direction = tronament.SOUTH;
        // } else if (move == tronament.WEST && this.directionIsSafe(move)) {
        //     direction = tronament.WEST;
        // } else if (move == tronament.NORTH && this.directionIsSafe(move)) {
        //     direction = tronament.NORTH;
        // }

        // if (!this.directionIsSafe(direction)) {
        //     //this.message("Whoa! Not that way!");
        //     if (this.directionIsSafe(tronament.EAST)) {
        //         direction = tronament.EAST;
        //     } if (this.directionIsSafe(tronament.SOUTH)) {
        //         direction = tronament.SOUTH;
        //     } if (this.directionIsSafe(tronament.WEST)) {
        //         direction = tronament.WEST;
        //     } if (this.directionIsSafe(tronament.NORTH)) {
        //         direction = tronament.NORTH;
        //     }
        // }

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
