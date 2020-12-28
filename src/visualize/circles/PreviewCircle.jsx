import React, { Component } from 'react'
import './PreviewCircle.css';
export default class PreviewCircle extends Component {
    render() {
        const {
          isChoosable,  
          isChoosen, 
          row,
          col,
          onClick,
        } = this.props;

        const typeClass = isChoosable?
        'circle-choosable' 
        : 
        "";
        const typeClass1 = isChoosen? 
        'circle-choosen':
        "";
        return( 
        <div 
        id={`PreviewCircle-${row}-${col}`}
        className={`PreviewCircle ${typeClass} ${typeClass1}`}
        onClick={() => onClick(row, col)}
        ></div>
        ); 
    }
}
