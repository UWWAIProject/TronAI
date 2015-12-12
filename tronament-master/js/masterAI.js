/**
 * This none-working example of a master AI would take a dynamic number of states and it would ask the
 * states for moves, and to score their move on a confidence level of how good the state thinks that
 * the move is. The master AI then would take all of these heuristics into consideration before making
 * the final decision
 */
window.masterAI = new function(){
  var mdistance = astar.manhattan;
  var safety_Ai = safety(my_x, my_y);
  var safety_Op = safety(enemy_x, enemy_y);
  var activity = activity();
  var trapped = trapped();


  //Each state plugin should register itself with this array on the window
  //This will allow states to be added and removed
  //An API for communicating with the states and returning a standard value
  // from the states to the master AI to allow it to be standardized
  window.masterAIStates = [];
  this.states = window.masterAIStates;

  /*
  ** The empty scores of each state type.  In the final product the ChaseAI would have multiple variations that either move
  ** ahead, behind, or side by side the opponent.  A primitive version of the scoring system is also below.  It's just a simple
  ** set of if statements that illustrates scenarios based on the condition results.  These scenarios then provide incremental scores for each
  ** state type.
  ** 
  ** Markov would likely be initiated after this conditional scoring process.
  */
  var chaseCon = 0;
  var chaseN = 0;
  var chaseAgg = 0;
  var bail = 0;
  var attack = 0;

  if (mdistance > 10) {
    chaseN += 3;
    bail--;
  } else if (mdistance < 10 && mdistance > 5) {
    chaseAgg++;

  } else if (mdistance < 5) {
    chaseCon++;
    bail += 2;
    attack += 3;
  }
  if (safety_Ai > safety_Op) {
    bail += 2;
  }
  if (safety_Ai < safety_Op) {
    chaseN += 2;
  }

  if (activity > 0) {

  }
  if (activity < 0) {

  }
  var base = 0;
  var baseState = "";

  //determining which is the highest score
  if(chaseCon > base){
    base = chaseCon;
    baseState="chaseCon";
  }

  if(chaseN > base){
    base = chaseN;
    baseState="chaseN";
  }

  if(chaseAgg > base){
    base = chaseAgg;
    baseState="chaseAgg";
  }

  if(bail > base){
    base = bail;
    baseState="bail";
  }

  if(attack > base){
    base = attack;
    baseState="attack";
  }

  function findOpponent() {
    var result = [];
    for (var i = 0; i < this.players.length; i++) {
      if (i === this.index) {
        continue;
      }
      result.push(tronament.getPlayerCoordinates(i));
    }
    var enemy = {};
    enemy.x = result[0].x;
    enemy.y = result[0].y;
    return enemy;
  }


  //object level variables queues
  var opponentMoves = [];
  var historyStates = [];

  function move() {
    //updates opponent moves;
    if (opponentMoves.length >= 5) {
      opponentMoves.shift();
    }
    opponentMoves.push(findOpponent());

    //updates historyStates
    if (historyStates.length >= 5) {
      historyStates.shift();
    }
    //history state

    //move logic
  }

  /*
  ** These are all functions to determine the various conditions MasterAI will use to perform decision making
  ** In the final product, each of these function's return values will be stored in an object, the objects will
  ** then be stored in an array that allows the Hidden Markov method to perform pattern analysis to add additional
  ** weight to any state score of its choosing.
  */

  function activity() {
    var distance = 0;
    var states = 0;
    for(var move in opponentMoves){
      if (mdistance(move, pos0) > 0) {
        distance++;
      }
      if (mdistance(move, pos0) < 0) {
        distance--;
      }
    }
    for(var state in historyStates){
      if (state = "bail") {
        states++;
      }
      if (state = "chase") {
        states--;
      }
    }
    return state - distance;
  }

  //requires two objects with x and y values.
  function mdistance(pos1, pos0) {
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  }

  //x,y are numberical coordinates
  function saftey(x, y) {
    var returnValue = 0;
    //based on an 8x8 grid
    for (var i = x - 4; i < (x + 5); i++) {
      for (var j = y - 4; j < (y + 5); j++) {
        if (tronament.collisionMap[i][j]) {
          returnValue++;
        }
      }
    }
    return returnValue;

  }


}