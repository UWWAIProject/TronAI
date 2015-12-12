/*  demo.js http://github.com/bgrins/javascript-astar
    MIT License

    Set up the demo page for the A* Search
*/
/* global Graph, astar, $ */

var GraphSearch= function(grid,start,end) {
    this.grid = grid;
    this.search = astar.search;
    this.end =  end;
    this.start = start;
     this.initialize();
};

GraphSearch.prototype.initialize = function() {
    this.graph = new Graph(this.grid);
};
GraphSearch.prototype.nextMove = function($end) {
    return this.search(this.graph,this.start,this.end);
};

GraphSearch.prototype.drawDebugInfo = function() {
    this.$cells.html(" ");
    var that = this;
    if(this.opts.debug) {
        that.$cells.each(function() {
            var node = that.nodeFromElement($(this)),
                debug = false;
            if (node.visited) {
                debug = "F: " + node.f + "<br />G: " + node.g + "<br />H: " + node.h;
            }

            if (debug) {
                $(this).html(debug);
            }
        });
    }
};
GraphSearch.prototype.nodeFromElement = function($cell) {
    return this.graph.grid[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];
};
GraphSearch.prototype.animateNoPath = function() {
    var $graph = this.$graph;
    var jiggle = function(lim, i) {
        if(i>=lim) { $graph.css("top", 0).css("left", 0); return; }
        if(!i) i=0;
        i++;
        $graph.css("top", Math.random()*6).css("left", Math.random()*6);
        setTimeout(function() {
            jiggle(lim, i);
        }, 5);
    };
    jiggle(15);
};
GraphSearch.prototype.animatePath = function(path) {
    var grid = this.grid,
        timeout = 1000 / grid.length,
        elementFromNode = function(node) {
        return grid[node.x][node.y];
    };

    var self = this;
    // will add start class if final
    var removeClass = function(path, i) {
        if(i >= path.length) { // finished removing path, set start positions
            return setStartClass(path, i);
        }
        elementFromNode(path[i]).removeClass(css.active);
        setTimeout(function() {
            removeClass(path, i+1);
        }, timeout*path[i].getCost());
    };
    var setStartClass = function(path, i) {
        if(i === path.length) {
            self.$graph.find("." + css.start).removeClass(css.start);
            elementFromNode(path[i-1]).addClass(css.start);
        }
    };
    var addClass = function(path, i) {
        if(i >= path.length) { // Finished showing path, now remove
            return removeClass(path, 0);
        }
        elementFromNode(path[i]).addClass(css.active);
        setTimeout(function() {
            addClass(path, i+1);
        }, timeout*path[i].getCost());
    };

    addClass(path, 0);
    this.$graph.find("." + css.start).removeClass(css.start);
    this.$graph.find("." + css.finish).removeClass(css.finish).addClass(css.start);
};
