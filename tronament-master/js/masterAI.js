this.masterAI(){
var mdsistance = mdistancefuncte();
var safety_Ai = safety(my_x, my_y);
var safety_Op = safety(enemy_x, enemy_y);
var activity = activity();
var trapped = trapped();

if(trapped==true){
//enter survival state
}

var chaseCon = 0;
var chaseN = 0;
var chaseAgg = 0;
var bail = 0;
var attack = 0;

if(mdistance > 10){
chaseN+=3;
bail--;
}else 

if(mdistance < 10 && mdistance > 5){
chaseAgg++;

}else

if(mdistance < 5){
chaseCon++;
bail+=2;
attack+=3;
}
if(safety_Ai > safety_Op){
bail+=2;
}
if(safety_Ai < safety_Op){
chaseN+=2;
}

if(activity > 0){

}
if(activity < 0){

}



function findOpponent(){
    var result =[]
        for(var i = 0; i<this.players.length;i++){
            if (i === this.index){
                continue;
            }
            result.push(tronament.getPlayerCoordinates(i));
        }
        var enemy.x = result[0].x;
        enemy.y = result[0].y;
        return enemy;
}
 


//object level variables queues
var opponentMoves() = [];
var historyStates() = [];

function move(){
    //updates opponentoves;
    if (opponentMoves.length >=5){
        opponentMoves.shift();
    }
    opponentMoves.push(findOpponent());

    //updates historyStates
    if (historyStates.length >=5){
        historyStates.shift();
    }
    //history state

    //move logic
}

function activity(){
    var distance=0;
    var states=0;
    for each(move in opponentMoves()){
        if(mdistance(move,pos0)>0){
            distance++;
        }   
        if(mdistance(move,pos0)<0){
            distance --;
        }   
    }
    for each(state in historyStates){
        if(state="bail"){
            states++;
        }   
        if(state="chase"){
            states --;
        }   
    }
     return state-distance;
}

//requires two objects with x and y values. 
function mdistance(pos1,pos0){
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
}

//x,y are numberical coordinates
function saftey(x,y){
    var returnValue =0;
    //basedon an 8x8 grid
    for (i=(x-4;i<(x+5),i++){
        for(j=(y-4;j<(y+5),j++){
            if(tronament.collisionMap[i][j]){
                returnValue ++;
            }
        }
    }
    return returnValue;

}


}