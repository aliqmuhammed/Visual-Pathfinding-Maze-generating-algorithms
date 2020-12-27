//holds current row
var currentRow = [];
//hold current col
var currentCol = [];
//All the directions
const dr = [-1,+1,0,0];
const dc = [0,0,+1,-1];
//visited nodes in order
var visitedNodesInOrder = [];
export default function bfs(startNode,grid){
//need to empty everything in the begining, if we are to use this
//method twice
currentRow = [];
currentCol = [];
visitedNodesInOrder = [];

//Add start position into row and column arrays
    currentRow.push(startNode[0]);
    currentCol.push(startNode[1]);
    //startNode set it to visited
    grid[startNode[0]][startNode[1]].isVisited = true;

    //important that if its empty
    while(!!currentRow.length){
        //take out current row and current column
        //latest row and col pushed into arrays
        var row = currentRow.shift();
        var col = currentCol.shift();
     
        //if the current position is the finished node, then stop
        if(grid[row][col].isFinish){
            visitedNodesInOrder.push({row: row,col: col})
            //send back visited nodes in order
            return visitedNodesInOrder;
        }
        //from this current node explore neighbour nodes
        //(North, East, South, West)
        exploreNeighbours(row,col,grid);
       //saving their position into a new column
        //will be used later for animation
        visitedNodesInOrder.push({row: row,col: col});

       
    }
    console.log('THE FINISH POSITION WAS NEVER REACHED')
    return visitedNodesInOrder;
}

var exploreNeighbours = function (row,col,grid){
    var newRow;
    var newCol;
   
    //loop through these 4 positions
    for (let i = 0; i < 4; i++) {
      newRow = row + dr[i];
      newCol = col + dc[i];
   
      //if the column or row is outside the grid then we stop iterating
      if(newCol < 0 || newCol >= grid[0].length|| newRow < 0 || newRow >= grid.length){
            continue;
        }
        //Checking that the current node is not outside the grid, else stop iterating
        if (typeof(grid[newRow][newCol]) == 'undefined'){
            //stop iterating since this position is already visisted
            continue;
        }
        //checking that the node has not already been visited else we stop iterating
        if (grid[newRow][newCol].isVisited){
            continue;
        }

        if(grid[newRow][newCol].isWall){
            continue;
        }
        

        //mark this position as visited
        grid[newRow][newCol].isVisited = true;

        //If this neighbour is inside the grid and not visited
        //we add it to their array holder so that we can from this position
        //visit other nodes around it (neighbours)
        currentRow.push(newRow);
        currentCol.push(newCol);
        
    }

}

/*
Solution 2
var stack = [];
const dr = [-1,+1,0,0];
const dc = [0,0,+1,-1];
export default function dfs(startNode, grid){
    stack.push(startNode);
    while(stack.length > 0){
        var node = stack.shift();
        grid[node.row][node.col].isVisited = true;
        var row = node.row;
        var col  = node.col;
        if(grid[row][col].isFinish){
            console.log('found finish at row: ' + row + ' col: ' + col);
            return
        }
        // explore explore neighbours - all directions
        for (let i = 0; i < 4; i++) {
         var   newRow = row + dr[i];
         var   newCol = col + dc[i];
         
            //if the column or row is outside the grid then we stop iterating
            if(newCol < 0 || newCol >= grid[0].length|| newRow < 0 || newRow >= grid.length){
                  continue;
              }
              //Checking that the current node is not outside the grid, else stop iterating
              if (typeof(grid[newRow][newCol]) == 'undefined'){
                  //stop iterating since this position is already visisted
                  continue;
              }
              //checking that the node has not already been visited else we stop iterating
              if (grid[newRow][newCol].isVisited){
                  continue;
              }

              if(grid[newRow][newCol].isWall){
                  continue;
              }
              
              startNode.isVisited = true;              
              stack.push({row: newRow,col: newCol})
          }

    }
        console.log('was never found!')
    

}

*/