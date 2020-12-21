import React, { Component } from 'react'
import './Circle.css';
export default class Pentagon extends Component {
    render() {
        const {
          isStart,
          isFinish,
          isVisited, 
          row,
          col,
          onClick,
          onMouseEnter,
          onMouseLeave, 

          onMouseDown,
          onMouseUp,

          isWall, 
        } = this.props;

        const typeClass = isStart ? 
        'start-circle' 
        : 
        isFinish? 
        'finish-circle' 
        :
        isVisited?
        'visited-circle' 
        :isWall? 
        'wall-circle'
        :'';

        return( 
        <div 
        id={`circle-${row}-${col}`}
        className={`circle ${typeClass}`}
        onMouseEnter={() => onMouseEnter(row, col)}
        onClick={() => onClick(row, col)}
        onMouseLeave={() => onMouseLeave(row, col)}

        onMouseDown={()=> onMouseDown(row,col)}
        onMouseUp={()=> onMouseUp()}

        ></div>
        ); 
    }
}
