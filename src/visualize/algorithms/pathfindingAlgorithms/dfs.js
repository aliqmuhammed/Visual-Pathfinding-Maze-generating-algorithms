

var visited = [];
//visited nodes in order
var visitedNodesInOrder = [];
export default function init(maze,node){
  //  visited =[maze.length][maze[0].length]

  visitedNodesInOrder = [];
  
    var state =  dfs(maze,node);
    console.log('state: ' + state)
    if(state){
        return visitedNodesInOrder;
    }else if (!state){
        if(visitedNodesInOrder === 0){
            return 'start position is completly blocked'
        }
        return visitedNodesInOrder
    }
    
}
function dfs(maze, node){
    
    if (maze[node.row][node.col].isFinish){
        visitedNodesInOrder.push({row: node.row,col: node.col})
       console.log("FOUND IT AT: ROW: " + node.row + " COL: " + node.col );
        return true;
    }

    var neighbours = getNeighbors(maze,node);
    //typeof(neighbors) === 'undefined' ||
    if (neighbours.length <= 0){
        return false;
    }
    for (var i=0;i<neighbours.length;i++){
        maze[neighbours[i].row][neighbours[i].col].isVisited = true;
        console.log()
        if(dfs(maze,neighbours[i])){
            return true;
        }
    }
    return false;
}
//directions
const dr = [-1,+1,0,0];
const dc = [0,0,+1,-1];

function getNeighbors(grid,node){
  var neighbours = [];
    //checks all direction from the node added
    for (let i = 0; i < 4; i++) {
        var   newRow = node.row + dr[i];
        var   newCol = node.col + dc[i];
        
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
             //push valid neighbours from current node
             visitedNodesInOrder.push({row: node.row,col: node.col})
             neighbours.push({row: newRow,col: newCol})
  }
return neighbours;
}



