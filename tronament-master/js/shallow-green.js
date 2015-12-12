tronament.aiModule("shallow-green", function() {
    var directions = [tronament.NORTH, tronament.EAST, tronament.SOUTH, tronament.WEST];
    var iteration = 0;

    this.onReady = function() {
        // randomly choose a favored direction for the round
        directions = shuffle(directions);

        this.message("Ready, Freddy!");
    }

    this.onDeath = function() {
        this.message("Another round?");
    }

    this.move = function() {
        iteration++;

        // send out a 7x7 sonar signal
        var grid = sonar(3, {x: 0, y: 0});

        // heuristic weights for each direction
        var moveWeights = [0, 0, 0, 0];

        // loop over each possible decision
        for (var i = 0; i < directions.length; i++) {
            var offset = offsetOf(directions[i]);

            // ignore spaces that would cause death
            if (grid.at(offset.x, offset.y) != tronament.EMPTY) {
                moveWeights[i] -= 100;
                continue;
            }

            // hug any nearby walls
            /*if (grid.at(offset.x + 1, offset.y) == tronament.EMPTY ||
                grid.at(offset.x - 1, offset.y) == tronament.EMPTY ||
                grid.at(offset.x, offset.y + 1) == tronament.EMPTY ||
                grid.at(offset.x, offset.y - 1) == tronament.EMPTY) {
                return directions[i];
            }*/

            // analyze the spaciousness of the general area
            moveWeights[i] += spaciousness(sonar(10, offsetOf(directions[i])));

            // analyze the spaciousness of the immediate area to avoid traps
            moveWeights[i] += 15 * spaciousness(sonar(1, offsetOf(directions[i])));
            moveWeights[i] += 13.5 * spaciousness(sonar(2, offsetOf(directions[i])));
            moveWeights[i] += 5 * spaciousness(sonar(3, offsetOf(directions[i])));

            if (spaciousness(sonar(1, offsetOf(directions[i]))) < 3) {
                this.message("You can't fool me!");
            }
        }

        // select the best move we have
        var bestMove = 0;
        for (var i = 0; i < directions.length; i++) {
            if (moveWeights[i] > moveWeights[bestMove]) {
                bestMove = i;
            }
        }
        return directions[bestMove];
    }

    var spaciousness = function(grid) {
        var spaces = 0;

        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[x].length; y++) {
                if (grid[x][y] == tronament.EMPTY) {
                    spaces++;
                }
            }
        }

        return spaces;
    }

    /**
     * Fetches a grid of collision information centered at the current position.
     *
     * @return Array
     */
    var sonar = function(radius, offset) {
        var grid = [];
        grid.radius = radius;

        for (var x = 0; x < radius * 2 + 1; x++) {
            grid[x] = [];
            for (var y = 0; y < radius * 2 + 1; y++) {
                grid[x][y] = this.queryRelative(offset.x + x - radius, offset.y + y - radius);
            }
        }

        // shortcut method for accessing the grid relative to the center
        grid.at = function(x, y) {
            return this[this.radius + x][this.radius + y];
        }.bind(grid);

        return grid;
    }.bind(this);

    var offsetOf = function(direction) {
        if (direction == tronament.NORTH) {
            return {x: 0, y: -1};
        }

        if (direction == tronament.SOUTH) {
            return {x: 0, y: 1};
        }

        if (direction == tronament.WEST) {
            return {x: -1, y: 0};
        }

        if (direction == tronament.EAST) {
            return {x: 1, y: 0};
        }

        return null;
    }

    var shuffle = function(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
});
