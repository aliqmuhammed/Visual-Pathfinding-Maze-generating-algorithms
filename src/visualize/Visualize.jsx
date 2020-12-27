import React, { Component } from 'react'
import Circle from './circles/Circle';
//pathfinding
import bfs from './algorithms/pathfindingAlgorithms/Bfs';
import dfs from './algorithms/pathfindingAlgorithms/Dfs';
import dijkstra from './algorithms/pathfindingAlgorithms/Dijkstra';

//maze
import recursiveDivision from './algorithms/mazeAlgorithms/RecursiveDivision';
import './Visualize.css';

let start_circle_row = null;
let start_circle_col= null;
let finish_circle_row= null;
let finish_circle_col= null;
let startBtn;
let finishBtn;
let wallBtn = false;
let eraseBtn = false;
let mouseHeldDown;
var totalVisitedNodes = [];

export default class Visualize extends Component {
    constructor(){
        super();
        this.state= {
            grid: [],
        };
    }

    componentDidMount(){
       const initialGrid = getGrid();
       this.setState({grid:initialGrid});
    }

  Dijkstra(){
    if((start_circle_row  && start_circle_col) !== null && (finish_circle_row && finish_circle_col)!== null){
  animatePathFinding(dijkstra(this.state.grid,{row: start_circle_row,col: start_circle_col},{row: finish_circle_row,col: finish_circle_col})); 
    }else{
    console.log('You have not set a start and a finish position, cannot run search')           
}
}

     dfs(){
        if(startBtn){
            this.startBtn = false;
           }
           if(finishBtn){
            this.finishBtn = false;   
           } 

           if((start_circle_row  && start_circle_col) !== null && (finish_circle_row && finish_circle_col)!== null){

            totalVisitedNodes = dfs(this.state.grid,{row: start_circle_row,col:start_circle_col});
            //we have to do this, concider the case where starPosition is completly blocked.
            if(totalVisitedNodes !== undefined){
                animatePathFinding(totalVisitedNodes);
                }
                disableAlgoritms();
           }else{
            console.log('You have not set a start and a finish position, cannot run search')           
        }
     }

    recursiveDivision(){
    //maze - result with maze          
    var gridWithWall = recursiveDivision(this.state.grid);
        //animate walls with new maze - add wall class (for animation)
        for (let row = 0; row < gridWithWall.length; row++) {
            if(row === gridWithWall.length){
                this.setState({grid: gridWithWall});
            }
            for (let col = 0; col < gridWithWall[0].length; col++) {
             setTimeout(() => {
                 if(gridWithWall[row][col].isWall){
                    document.getElementById(`circle-${row}-${col}`).className = 'circle wall-circle'
                 }
        }, 40 * col);    

    }
  }

}


    onMouseDown(row,col){
          this.mouseHeldDown = true;
          console.log('Mouse IS down')

          if(this.wallBtn){
          const grid = this.state.grid;
        
          const circle = grid[row][col];
          const newCircle = {
            ...circle,
            isWall: true,
          };
          grid[row][col] = newCircle;
          this.setState({grid: grid});
        }

        if(this.eraseBtn){
            const grid = this.state.grid;
            const circle = grid[row][col];
            const newCircle = {
              ...circle,
              isFinish: false,
              isStart: false,
              isWall: false,
            };
            grid[row][col] = newCircle;
            this.setState({grid: grid});
        }
    }

    onMouseUp(){
          this.mouseHeldDown = false;
          console.log('Mouse IS UPP')
         
    }


     breathFirstSearch(){
        /*
        We need to check that startBtn or finishBtn is not turned on when
        running this method, this is because if we run this method
        and it has finished AND button is true, it means that one can
        set the new start or finish position, and one should not be able
        to do so, rather we want to reset things first.
        */  
       if(startBtn){
        this.startBtn = false;
       }
       if(finishBtn){
        this.finishBtn = false;   
       }     
    
     //if both positions are set then we can run the method       
     if((start_circle_row  && start_circle_col) !== null && (finish_circle_row && finish_circle_col)!== null){
        //remove options to set start and finish position
        disableButtons();
        totalVisitedNodes =  bfs([start_circle_row,start_circle_col],this.state.grid);
        if(totalVisitedNodes !== undefined){
        animatePathFinding(totalVisitedNodes);
        }
        //while algorithm is running, disable all other pathfinding algorithm
      disableAlgoritms();
    }else{
        console.log('You have not set a start and a finish position, cannot run search')
    }
      
    }

    
    onMouseEnter(row,col){
        console.log('mouseheldDown: ' + this.mouseHeldDown)
        console.log('wallBtn: ' + this.wallBtn)
        
        //if mouse is held down - acctually set wall on mouse down drag
        if(this.mouseHeldDown && this.wallBtn){
            //we must disable start and finish position buttons
            //cannot set positions AND isWAllBtn enabled, then
            //we cannot reach methods underneath this one (to set position of start/finish)
           const grid = this.state.grid; 

           var currentCircle = grid[row][col];
           const updatedCircle = {
            ...currentCircle,
            isStart: false,
            isFinish: false,
            isWall: true,
             }
             grid[row][col] = updatedCircle;
             this.setState({grid: grid});
            return
        }else if(this.eraseBtn && this.mouseHeldDown){
            const grid = this.state.grid; 

            const circle = grid[row][col];
            const newCircle = {
              ...circle,
              isFinish: false,
              isStart: false,
              isWall: false,
            };
            grid[row][col] = newCircle;
            this.setState({grid: grid});
            return
        }
        
        const circle = document.getElementById(`circle-${row}-${col}`);

        //set temp wall 
        if(this.wallBtn){
            if(circle.className === 'circle start-circle'){
                console.log('that one is occupied by red')
                 return
            }else if(circle.className ==='circle finish-circle'){
                console.log('Its ocupied by green')
             return
         }else{
              circle.className ='circle wall-circle'; 
            } 
        }


            if(this.finishBtn){
            if(circle.className === 'circle start-circle'){
                console.log('that one is occupied by red')
                 return
            }else if(circle.className ==='circle wall-circle'){
             return
         }else{
              circle.className ='circle finish-circle'; 
            }
           }
     
         if(this.startBtn){
            if(circle.className === 'circle finish-circle'){
            console.log('that one is occupied by green');
            }else if(circle.className ==='circle wall-circle'){
             return
         }else{
             circle.className = 'circle start-circle';
            }
         }     
}

    onMouseLeave(row,col){

    if(!this.mouseHeldDown && this.wallBtn){
        console.log('cant set wall')
        //this.wallBtn = false;   
    }
    
    const circle = document.getElementById(`circle-${row}-${col}`);
    //used to get the acctuall value inside the circle node, cannot with document.getElementByID
    const circleValue = this.state.grid[row][col];
    if(this.wallBtn){

        if(circle.className === 'circle start-circle'){
            console.log('that one is occupied by red')
             return
        }else if(circle.className ==='circle finish-circle'){
            console.log('Its ocupied by green')
         return
     }else if(circleValue.isWall){
         console.log('this is already a wall so we cannot remove its class!')
        return
        }else{
            circle.className ='circle'; 

        } 
    }


     if(this.finishBtn){
      if(circle.className === 'circle start-circle'){
          return
      }else if(circle.className ==='circle wall-circle'){
          return
      }else{
        circle.className = 'circle';
      }
    }

    if(this.startBtn){
      if(circle.className === 'circle finish-circle'){
          return
      }else if(circle.className ==='circle wall-circle'){
        return
    }else{
        circle.className = 'circle';
      }
     }
    }

    setCircle(clickedRow,clickedCol,event){
        const grid = this.state.grid;

        //if its a wall
        if(this.wallBtn && this.mouseHeldDown){
          const currentWall = grid[clickedRow][clickedCol];
            //see if this position has isFinished enabled already, we dont want
            //to add it if its occupied!
           if(currentWall.isFinish){
               console.log('Cant place wall, its occupied by isFinish (green)')
               return
           }else if(currentWall.isStart){
            console.log('Cant place wall, its occupied by isStart (red)')
            return
           }
            const wallCircle = {
               ...currentWall,
               isWall: true,
            }
    
            grid[clickedRow][clickedCol] = wallCircle;
            //-------------------this.wallBtn = false;------------------------------------
            this.setState({grid: grid})
            return
        }

        //set false if both button is true
        if(this.startBtn && this.finishBtn){
            this.startBtn = false;
            this.finishBtn = false;
            console.log(`You can't add start and finish at the same time`)
            return
        }
    
        if(this.startBtn){
            if(start_circle_row != null && start_circle_col != null){
                const oldCircle = grid[start_circle_row][start_circle_col];
                const tempOldCircle = {
                    ...oldCircle,
                    isStart: false,
                     }
                grid[start_circle_row][start_circle_col]= tempOldCircle; 
             //   this.setState({grid: grid});
              }

             const clickedCircle = grid[clickedRow][clickedCol];
             //see if this position has isFinished enabled already, we dont want
             //to add it if its occupied!
            if(clickedCircle.isFinish){
                console.log('Sorry that position is occupied by isFinish (GREEN)')
                return
            }
             const tempCircle = {
                ...clickedCircle,
                isStart: true,
                 }

                grid[clickedRow][clickedCol] = tempCircle; 
               // this.setState({grid: grid});
                //set the new global start grid position
                start_circle_row = clickedRow;
                start_circle_col = clickedCol;
                //reset button (startBtn state)
                this.startBtn = false;
                this.setState({grid: grid})
            }

      if(this.finishBtn){
       if(finish_circle_row != null && finish_circle_col != null){
        const oldCircle = grid[finish_circle_row][finish_circle_col];
        const tempOldCircle = {
            ...oldCircle,
            isFinish: false,
             }
        grid[finish_circle_row][finish_circle_col]= tempOldCircle; 
        this.setState({grid: grid});
      }
     const clickedCircle = grid[clickedRow][clickedCol];
     if(clickedCircle.isStart){
        console.log('Sorry that position is occupied by isStart (RED)')
        return
    }
     const tempCircle = {
        ...clickedCircle,
        isFinish: true,
         }
        grid[clickedRow][clickedCol] = tempCircle; 
        this.setState({grid: grid});
        //set the new global finish grid position
        finish_circle_row = clickedRow;
        finish_circle_col = clickedCol;
        //reset button (finishBtn state)
       this.finishBtn = false;
    }
    //if start and finish button is true = breathfirstSearch enabled!
    //then after set both to false.

   }

       resetGrid(){
     
        //Start row and col set to null
        start_circle_row = null;
        start_circle_col = null;
        //finish row and col set to null
        finish_circle_row = null;
        finish_circle_col = null;

    
        //remove all classes that we have visited 
       // for (let i = 0; i < totalVisitedNodes.length; i++) {
          //  let circle = totalVisitedNodes[i];
        //    document.getElementById(`circle-${circle.row}-${circle.col}`).className = 'circle'
      //  }

             //remove all classes if there are walls also
             for (let row = 0; row < this.state.grid.length; row++) {
                for (let col = 0; col < this.state.grid[0].length; col++) {
                document.getElementById(`circle-${row}-${col}`).className = 'circle'
            }
        }

        const initialGrid = getGrid();
        this.setState({grid:initialGrid})

        enableAlgoritms();
        enableButtons();
        return true;
    
    }

    setEraseBtn(){
    this.eraseBtn = true;
    this.startBtn = false;
    this.finishBtn = false;
    this.wallBtn = false;
    }
    setStartBtn (){
        this.eraseBtn = false;
        this.startBtn = true;
        this.finishBtn = false;
        this.wallBtn = false;
    }

    setFinishBtn(){
        this.eraseBtn = false;
        this.startBtn = false;
        this.finishBtn = true;
        this.wallBtn = false;
    }
    setWallBtn(){
    this.eraseBtn = false;
    this.startBtn = false;
    this.finishBtn = false;
    this.wallBtn = true;
    }

    render() {
        const {grid} = this.state;
        return (
            <>
            <button id='maze-recursive-division' onClick={() => this.recursiveDivision()}>
                maze: recursiveDivision
            </button>
            <button id='wall-button' onClick={() => this.setWallBtn()}>
                Wall-button
            </button>
            <button id='wall-button' onClick={() => this.setEraseBtn()}>
                Erase-button
            </button>
            <button id='depthFirstSearch' onClick={() => this.dfs()}>
                DepthFirstSearch
            </button>
             <button id='breathFirstSearch-button' onClick={() => this.breathFirstSearch()}>
                breathFirstSearch
            </button>
            <button id='djikstra' onClick={() => this.Dijkstra()}>
                Dijkstra
            </button>
            <button id='start-button' onClick={() => this.setStartBtn()}>
                Start-position
            </button>
            <button id='finish-button' onClick={() => this.setFinishBtn()}>
                Finish-position
            </button>
            <button onClick={() => this.resetGrid()}>
                Reset-grid
            </button>
            <div className="grid">
                {grid.map((row,index)=>{
                    return(
                        <div key={index}>
                          {row.map((circle,CircleIndex)=>{
                              const {row, col, isStart, isFinish, isWall, isVisited } = circle; 
                              return (
                                <Circle 
                                key={CircleIndex}
                                col={col}
                                row={row}
                                isStart={isStart}
                                isFinish={isFinish}
                                isVisited={isVisited}
                                isWall={isWall}
                                onMouseEnter={(row,col) => this.onMouseEnter(row, col)}
                                onMouseLeave={(row,col)=> this.onMouseLeave(row,col)}
                                onClick={() => this.setCircle(row, col)}
                               

                                onMouseDown={(row,col)=> this.onMouseDown(row,col)}
                                onMouseUp={()=> this.onMouseUp()}>   
                                </Circle> 
                              );
                          })}  
                        </div>
                    );
                })}
            </div>
            </>
        );
    }
}

const  getGrid = () => {
    const grid = [];
    for (let row = 0; row <20; row++) {
        const createRow = [];
        for (let col = 0; col < 50; col++) {
        createRow.push(createCircleData(col,row));
        }
        grid.push(createRow);
    }
    return grid;
}

//add more data per pentagon
const createCircleData = (col,row) => {
    return {
        col,
        row,
        isStart: false,
        isFinish: false,
        isVisited: false,
        isWall: false,
    };
};

// DISABLE
const disableAlgoritms = ()=> {
   
    const algorithms = ['breathFirstSearch-button','maze-recursive-division'];
    for (let i = 0; i < algorithms.length; i++) {
     document.getElementById(algorithms[i]).disabled = true;
    }
}

const disableButtons = ()=>{
    const positions = ['start-button','finish-button','wall-button'];
    for (let i = 0; i < positions.length; i++) {
       document.getElementById(positions[i]).disabled = true;
    }
}

// ENABLE
const enableAlgoritms = ()=>{
    const algorithms = ['breathFirstSearch-button','maze-recursive-division'];
    for (let i = 0; i < algorithms.length; i++) {
     document.getElementById(algorithms[i]).disabled = false;
    }
}

const enableButtons = ()=>{
    const positions = ['start-button','finish-button','wall-button'];
    for (let i = 0; i < positions.length; i++) {
       document.getElementById( positions[i]).disabled = false;
    }
  }
// ANIMATE
//Vi kan använda denna metoden för att animera andra, gör den generell och byt namn
const animatePathFinding = (totalPath)=>{
    var previousCircle = null;
    var circle = null;

    for (let i = 0; i < totalPath.length; i++) { 
    setTimeout(() => {

    previousCircle = totalPath[i-1];
    circle = totalPath[i];

       if(previousCircle){
        document.getElementById(`circle-${previousCircle.row}-${previousCircle.col}`).className = 'circle visited-circle'
       }

       document.getElementById(`circle-${circle.row}-${circle.col}`).className = 'circle visited-circle-test'

        if((circle.row === finish_circle_row)&&(circle.col === finish_circle_col)){
            document.getElementById(`circle-${circle.row}-${circle.col}`).className = 'circle finish-circle finish-circle-found'
        }
    
}, 15 * i);
}
}