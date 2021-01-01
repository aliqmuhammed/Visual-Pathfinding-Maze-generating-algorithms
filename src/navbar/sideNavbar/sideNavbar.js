import './sideNavbar.css';


export default function sideNavbar(props){
    return(
    <nav className="navbar">
     <ul className="navbar-nav">
    <li className="nav-item" onClick={props.setGrid}>
      <a href="#" className="nav-link">
          <span className="link-text" >Set grid size</span>
      </a>  
    </li>
     </ul>
     
     <ul className="navbar-nav">
    <li className="nav-item" onClick={props.startPos}>
      <a href="#" className="nav-link">
          <span className="link-text" >Start position</span>
      </a>  
    </li>
     </ul>

     <ul className="navbar-nav">
    <li className="nav-item" onClick={props.finishPos}>
      <a href="#" className="nav-link">
          <span className="link-text" >Finish position</span>
      </a>  
    </li>
     </ul>

     <ul className="navbar-nav">
    <li className="nav-item" onClick={props.wall}>
      <a href="#" className="nav-link">
          <span className="link-text" >Set wall</span>
      </a>  
    </li>
     </ul>

     <ul className="navbar-nav">
    <li className="nav-item" onClick={props.eraseBtn}>
      <a href="#" className="nav-link">
          <span className="link-text" >Erase Wall</span>
      </a>  
    </li>
     </ul>

     <ul className="navbar-nav">
    <li className="nav-item">
      <a href="#" className="nav-link">
          <span className="link-text" >Generate Maze</span>
      </a>  
      <div className="dropdown">
          <ul>
              <li className="dropdown-link"  onClick={props.recursiveDivision}>
                    <a href="#">Recursive Division</a>
              </li>
          </ul>
      </div>
    </li>
     </ul> 

    <ul className="navbar-nav">
    <li className="nav-item">
      <a href="#" className="nav-link">
          <span className="link-text" >Pathfinding Algorithms</span>
      </a>  
      <div className="dropdown">
          <ul>
              <li className="dropdown-link"  onClick={props.Dijkstra}>
                    <a href="#">Dijkstra</a>
              </li>
              <li className="dropdown-link"  onClick={props.Dfs}>
                    <a href="#">Depth First Search</a>
              </li>
              <li className="dropdown-link"  onClick={props.Bfs}>
                    <a href="#">Breadth First Search</a>
              </li>
          </ul>
      </div>
    </li>
     </ul>     

     <ul className="navbar-nav">
    <li className="nav-item" onClick={props.resetGrid}>
      <a href="#" className="nav-link">
          <span className="link-text" >Reset Grid</span>
      </a>  
    </li>
     </ul>
    </nav>
    );
    
}