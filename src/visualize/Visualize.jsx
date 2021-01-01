import React, { Component, useState } from 'react';
import Modal from 'react-modal';
import Circle from './circles/Circle';
import PreviewCircle from './circles/PreviewCircle';
import SideNavbar from '../navbar/sideNavbar/sideNavbar';
import TopNavBar from '../navbar/topNavbar/topNavbar';
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
//for screen width and calculation of max rows and colums
var gridRow;
var gridCol;
var ScreenWidth;
var ScreenHeight;
//in preview maze we keep track of clicked row and col
var previousCol;
var previousRow;
export default class Visualize extends Component {
    constructor(){
        super();
        this.state= {
            grid: [],
            isOpen: true,
            previewRow: 0,
            previewCol: 0,
        };

    }

    componentDidMount(){
        //calculates the maximum rows and columns possible for us to add
       this.calculateScreenDimensions();
    }
  setGrid(){
       const initialGrid = this.getGrid();
       this.setState({grid:initialGrid});
  }  

  Dijkstra(){
    if((start_circle_row  && start_circle_col) !== null && (finish_circle_row && finish_circle_col)!== null){
  animatePathFinding(dijkstra(this.state.grid,{row: start_circle_row,col: start_circle_col},{row: finish_circle_row,col: finish_circle_col})); 
   //disableAlgoritms();
   //disableButtons();
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
              //  disableAlgoritms();
               // disableButtons();
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
       // disableButtons();
        totalVisitedNodes =  bfs([start_circle_row,start_circle_col],this.state.grid);
        if(totalVisitedNodes !== undefined){
        animatePathFinding(totalVisitedNodes);
        }
        //while algorithm is running, disable all other pathfinding algorithm
     // disableAlgoritms();
    }else{
        console.log('You have not set a start and a finish position, cannot run search')
    }
      
    }

    
    onMouseEnter(row,col){
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
              circle.className ='circle wall-circle-temp'; 
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
  
    setPreviewCircle(row,col){
        //column
        if(row === 0 && col >= 0 && col <= gridCol){
            //gridCol = col;
            if(previousRow){
             document.getElementById(`PreviewCircle-${previousRow.row}-${previousRow.col}`).className = 'PreviewCircle  circle-choosable'
            }
           
            //remove animation AFTER the choosen point
            for (let i = 0; i < gridCol; i++) {
                if(i <col){
                    document.getElementById(`PreviewCircle-${row}-${i}`).className = 'PreviewCircle circle-choosable';
                }else{
                    document.getElementById(`PreviewCircle-${row}-${i}`).className = 'PreviewCircle';
                }
               
             }
            //local variable for displaying how many colums were chosen
            this.setState({previewCol:col});
            //save the current clicked positions (will be used in the if above to erase it when choosing new position)
            previousRow = ({row:row,col:col});
            document.getElementById(`PreviewCircle-${row}-${col}`).className = 'PreviewCircle  circle-choosen'
          
            if(this.state.previewRow != 0){
            for(let  ix  =  1;  ix < gridRow; ix++) {
                for (let jx = 0; jx < gridCol; jx++) {
                   if(ix<=this.state.previewRow && jx<=col){
                    document.getElementById(`PreviewCircle-${ix}-${jx}`).className = 'PreviewCircle circle-choosable';
                   }else{
                       document.getElementById(`PreviewCircle-${ix}-${jx}`).className = 'PreviewCircle';
                   }   
                }    
               }
               document.getElementById(`PreviewCircle-${this.state.previewRow}-${0}`).className = 'PreviewCircle  circle-choosen'
           }
         }
        //row
        if(row > 0 && row <= gridRow){
            //gridRow = row;
            //reset previous green choosen row
            if(previousCol){
                document.getElementById(`PreviewCircle-${previousCol.row}-${previousCol.col}`).className = 'PreviewCircle  circle-choosable'
            }

            for(let  ix  =  1;  ix < gridRow; ix++) {
             for (let jx = 0; jx < gridCol; jx++) {
                if(ix<=row && jx<=this.state.previewCol){
                 document.getElementById(`PreviewCircle-${ix}-${jx}`).className = 'PreviewCircle circle-choosable';
                }else{
                    document.getElementById(`PreviewCircle-${ix}-${jx}`).className = 'PreviewCircle';
                }   
             }    
            }

            previousCol = ({row:row,col:col});
            this.setState({previewRow: row})
            document.getElementById(`PreviewCircle-${row}-${col}`).className = 'PreviewCircle  circle-choosen'
        }
    }

    setCircle(clickedRow,clickedCol){
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
   }

       resetGrid(){
        //Start row and col set to null
        start_circle_row = null;
        start_circle_col = null;
        //finish row and col set to null
        finish_circle_row = null;
        finish_circle_col = null;

             //remove all classes if there are walls also
             for (let row = 0; row < this.state.grid.length; row++) {
                for (let col = 0; col < this.state.grid[0].length; col++) {
                document.getElementById(`circle-${row}-${col}`).className = 'circle'
            }
        }
        const initialGrid = this.getGrid();
        this.setState({grid:initialGrid})
        //-------------------------------------------FIX disable navbar LI
       // enableAlgoritms();
       // enableButtons();
        return true;
    
    }
    openPreivew(){
        this.setState({isOpen:true})
        this.calculateScreenDimensions();
        this.setGrid();
    }
    closeModal(){
        //acctually sets rows and col
        gridRow = this.state.previewRow;
        gridCol = this.state.previewCol;
        this.setGrid()
        this.setState({isOpen:false})
    }
     calculateScreenDimensions(){
         ScreenWidth  =  window.screen.availWidth;
         ScreenHeight =  window.screen.availHeight;
        //calculate how many is the maximum amount of circles in width and height
        const maxWidth = Math.floor(ScreenWidth/25); //col
        const maxHeight = Math.floor(ScreenHeight/25)-7; //row
       //set this to a variable to show the max width possible and height
       gridRow = maxHeight;
       gridCol = maxWidth;
       //set initialValues to max allowed col and row 
       //TODO how do i want this?--------------------------------------------------------------
      //this.setState({previewRow: gridRow-1,previewCol:gridCol-1})

       //acctually sets the initialgrid with values above (maxHeight and maxWidth)
       this.setGrid();
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

     getGrid (){
        const grid = [];
        for (let row = 0; row <gridRow; row++) {
            const createRow = [];
            for (let col = 0; col <gridCol; col++) {
            createRow.push(createCircleData(col,row));
            }
            grid.push(createRow);
        }
        return grid;
    }

    render() {
        const {grid} = this.state;
        return (
            <>
            <TopNavBar/>
            <SideNavbar 
            setGrid={() => this.openPreivew()}
            startPos={() => this.setStartBtn()}
            finishPos={() => this.setFinishBtn()}
            wall={() => this.setWallBtn()}
            eraseBtn={() => this.setEraseBtn()}
            recursiveDivision={() => this.recursiveDivision()}
            Dijkstra={() => this.Dijkstra()}
            Dfs={() => this.dfs()}
            Bfs={() => this.breathFirstSearch()}
            resetGrid={() => this.resetGrid()}
            />     
            {/*onRequestClose={() => this.setState({isOpen: false})} */}
            <Modal
            className="Modal"  
            isOpen={this.state.isOpen} 
            style={customStyles()}  >
            <div className="modal-text">
            <h2>Screen Height: {ScreenHeight} px</h2>
            <h2>Screen Width: {ScreenWidth} px</h2>
            <h3>Maximum rows possible: <span>{gridRow-1}</span></h3>
            <h3>Maximum column possible: <span>{gridCol-1}</span></h3>
            <h3>Choosen number of rows: {this.state.previewRow}</h3>
            <h3>Choosen number of cols: {this.state.previewCol}</h3>
            </div>
            <div className="previewGrid">
            {grid.map((row,index)=>{
                    return(
                        <div key={index}>
                          {row.map((circle,CircleIndex)=>{
                              const {row, col } = circle;
                              return (
                             <>
                             {previewIsChoosable(row,col)? 
                             <PreviewCircle
                             key={CircleIndex}
                             isChoosable={true}
                             row={row}
                             col={col}
                             onClick={() => this.setPreviewCircle(row,col)}
                             isChoosen={false}
                             >
                             </PreviewCircle>
                             :
                             <PreviewCircle
                             isChoosable={false}
                             row={row}
                             col={col}
                             onClick={() => console.log()}
                             >
                             </PreviewCircle>
                             }
                               </>         
                              );
                          })}  
                        </div>
                   );
                })}
            </div>
            <button className='modal-nextBtn' onClick={() =>this.closeModal()} >
                NEXT
            </button>
            </Modal>
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
   
    const algorithms = ['breathFirstSearch-button','maze-recursive-division','depthFirstSearch-button','djikstra-button'];
    for (let i = 0; i < algorithms.length; i++) {
     document.getElementById(algorithms[i]).disabled = true;
    }
}

const disableButtons = ()=>{
    const positions = ['start-button','finish-button','wall-button','erase-button','setGridSize'];
    for (let i = 0; i < positions.length; i++) {
       document.getElementById(positions[i]).disabled = true;
    }
}

// ENABLE
const enableAlgoritms = ()=>{
    const algorithms = ['breathFirstSearch-button','maze-recursive-division','depthFirstSearch-button','djikstra-button'];
    for (let i = 0; i < algorithms.length; i++) {
     document.getElementById(algorithms[i]).disabled = false;
    }
}

const enableButtons = ()=>{
    const positions = ['start-button','finish-button','wall-button','erase-button','setGridSize'];
    for (let i = 0; i < positions.length; i++) {
       document.getElementById( positions[i]).disabled = false;
    }
  }
// ANIMATE
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

const previewIsChoosable = (row,col)=>{
    if(row >= 0 && row <= gridRow){
        if(row === 0 && col >= 0 && col <= gridCol){
            return true
        }
        if(col === 0){
            return true
        }
        return false; 
    }else{
        return false;
    }
}

const customStyles =() => {
    return{
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
}
  };

  