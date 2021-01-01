import './topNavbar.css'
//img
import unvisited from '../../assets/unvisited.jpg';
import visited from '../../assets/visited.jpg';
import startPosition from '../../assets/startPosition.jpg';
import finishPosition from '../../assets/finishPosition.jpg';
import wall from '../../assets/wall.jpg';


export default function topNavbar(){
return(
    <div class="box">

      <div>
    <h4 className="left">Not visited</h4>
    <img src={unvisited}></img>
      </div>

      <div>
    <h4 className="left">Visited</h4>
    <img src={visited}></img>  
      </div>

      <div>
    <h4 className="left">Start position</h4>
    <img src={startPosition}></img>
      </div>

      <div>
    <h4 className="left">Finish position</h4>
    <img src={finishPosition}></img>
      </div>

      <div>
    <h4 className="left">Wall</h4>
    <img src={wall}></img>  
      </div>

     
   </div>
)
}
