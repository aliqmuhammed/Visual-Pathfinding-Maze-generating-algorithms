var currentGrid = [];
export default function dijkstra(grid,startNode,finishNode){
const visitedNodesInOrder = [];   
grid = addNewKeyValuePair(grid);
//will be used for next method
currentGrid = grid;

//set starting node distance to 0
grid[startNode.row][startNode.col].distance = 0;
//get all unvisited nodes
const unvisited = []
//all nodes that exist push into unvisited
for(const row of grid){
    for(const circle of row){
        unvisited.push(circle);
    }
}


while(!!unvisited.length){

    //sort nodes
    //numArray.sort((a,b) => a.distance-b.distance);
    unvisited.sort((a,b) => a.distance - b.distance);

    //closest
    const closest = unvisited.shift();
    //check that its valid
    if(closest.isWall){
        continue
    }

    if(closest.distance === Infinity){
        
        return visitedNodesInOrder;
    }
    //set to visited
    closest.isVisited = true;
    visitedNodesInOrder.push(closest);

    if((closest.row === finishNode.row) && (closest.col === finishNode.col)){
        console.log('finished?')
        return visitedNodesInOrder;
    }
    updateUnvisited(closest,grid);

}

}

function addNewKeyValuePair(grid){
    //This method adds a new key-value pair that
    //will keep track of the distance, djikstra requires it!
var newGrid = [];
for (let row = 0; row < grid.length; row++) {
    var newCol = []
    for (let col = 0; col < grid[0].length; col++) {
        //take specific object
        var object = grid[row][col];
        //add new key-value pair
        object.distance = Infinity;
        object.previousNode = null;
       newCol.push(object) 
    } 
    newGrid.push(newCol)
}

    return newGrid;
}

//directions
const dr = [-1,+1,0,0];
const dc = [0,0,+1,-1];

function updateUnvisited(node,grid){
    const neighbors = [];

    for (let i = 0; i < 4; i++) {
        console.log('neighbors - 4 directions?')

        var newRow = node.row + dr[i];
        var newCol = node.col + dc[i];
        
           //if the column or row is outside the grid then we stop iterating
           if(newCol < 0 || newCol >= grid[0].length|| newRow < 0 || newRow >= grid.length){
                 continue;
             }

             //checking that the node has not already been visited else we stop iterating
             if (grid[newRow][newCol].isVisited){
                 continue;
             }

             if(grid[newRow][newCol].isWall){
                 continue;
             }
            
             neighbors.push(grid[newRow][newCol]);
  }

  neighbors.filter(neighbor => neighbor.isVisited = true);

  for (let i = 0; i < neighbors.length; i++) {
    neighbors[i].distance = node.distance + 1;
    //kan bli fel här var är previousNode..
    neighbors[i].previousNode = node;
  }

}
