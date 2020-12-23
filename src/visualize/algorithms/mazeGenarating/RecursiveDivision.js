var grid;
export default function generateWall(oldGrid){
    grid = oldGrid;
    //add border
    borderWalls(grid);
    
    //addInnerWalls - recursive function
    innerWalls(true,1,grid[0].length-2,1,grid.length-2);
    return grid;
}

function borderWalls(grid){
for (var i = 0; i < grid.length; i++) {
        //add full row of walls at first row and last
        if (i === 0 || i === (grid.length-1)) {
            //column
            for (var j = 0; j < grid[0].length; j++) {
                grid[i][j].isWall = true;
            }
        } else {
          //  wall at start and end
            grid[i][0].isWall = true;
            grid[i][grid[0].length - 1].isWall = true;
           
        }
    }

    return grid
}
//addInnerWalls(true, 1, grid.length - 2, 1, grid.length - 2, ent);
//function addInnerWalls(h, minX, maxX, minY, maxY, gate)
function innerWalls (state,minLengthX,maxLengthX,minLengthY,maxLengthY){
if(state){
    //base case
    if(maxLengthX - minLengthX < 2){
        return;   
    }
    //get random number between two values width and height                   
    var random = Math.floor(getRandomNumber(minLengthY,maxLengthY)/2)*2; 
    addHWall(minLengthX,maxLengthX,random);

    //recursive
    innerWalls(!state,minLengthX,maxLengthX,minLengthY,random - 1);
    innerWalls(!state,minLengthX,maxLengthX,random + 1,maxLengthY);

}else{
     //base case
    if(maxLengthY - minLengthY < 2){
        return;   
    }
    //get random number between two values width and height                
    var rand = Math.floor(getRandomNumber(minLengthX,maxLengthX)/2)*2;   
    addVWall(minLengthY, maxLengthY, rand);

    innerWalls(!state,minLengthX,rand - 1,minLengthY, maxLengthY);
    innerWalls(!state,rand + 1,maxLengthX,minLengthY,maxLengthY);
}

}

function addHWall(minX,maxX,random){
    var opening = Math.floor(getRandomNumber(minX,maxX)/2)*2+1;

    for (let i = minX ; i <= maxX; i++){
     
        if(i === opening){
         //kanske kan skippa totalt i detta
         const currentWall = grid[random][i];

            const newCurrentOpening = {
                ...currentWall,
                isWall: false,
                 }
         grid[random][i] = newCurrentOpening;
       }else{
        grid[random][i].isWall = true;
       }
    }
}

function addVWall(minY, maxY, random) {
    var opening = Math.floor(getRandomNumber(minY,maxY)/2)*2+1;
    for (var i = minY; i <= maxY; i++) {
        if(i === opening){
            const currentWall = grid[i][random];
               const newCurrentOpening = {
                   ...currentWall,
                   isWall: false,
                    }
            grid[i][random] = newCurrentOpening;
          }else{
            grid[i][random].isWall = true;
          }
    }
}

//What it does "extra" is it allows random intervals that do not start with 1.
// So you can get a random number from 10 to 15 for example. Flexibility.
function getRandomNumber(min,max){
return  Math.floor(Math.random() * (max - min + 1) + min)
}
