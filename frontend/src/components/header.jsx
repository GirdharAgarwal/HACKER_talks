import react,{useContext} from "react";
import {NavLink} from "react-router-dom";
import {FaUserCircle} from "react-icons/fa";
import {UserContext} from "../app";

function head(){
   //use authenticate because if user deletes token then he/she is sign out but state is true,as state changes only when user clicks on "sign out" not on deleting the token ,which leds to wrong working
   const {state,dispatch}=useContext(UserContext);
   const RenderMenu=()=>{
      if(!state)
      {
         return(
            <>
             <li className="nav-item mx-1">
              <NavLink className="nav-link" exact to="/signup">Sign up</NavLink>
             </li>
             <li className="nav-item mx-1">
              <NavLink className="nav-link" exact to="/signin">Sign in</NavLink>
             </li>
            </>
         );
      }
      else
      {
         return(
            <>
            <li className="nav-item mx-1">
             <NavLink className="nav-link" exact to="/signout">Sign out</NavLink>
            </li>
            <li className="nav-item mx-1">
             <NavLink className="nav-link" exact to="/profile">
             <FaUserCircle size={24}/>   
            </NavLink>
            </li>
            </>
         );
      }
   }
    return (
      <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <h1 className="navbar-brand fw-bolder logo px-3 py-3">HACKER talks</h1>
        <ul className="navbar-nav ml-auto content">
          <li className="nav-item mx-1">
             <NavLink className="nav-link" exact to="/">Home</NavLink>
          </li>
          <li className="nav-item mx-1">
             <NavLink className="nav-link" exact to="/qna">QnA</NavLink>
          </li>
          <li className="nav-item mx-1">
             <NavLink className="nav-link" exact to="/ask">Post Question</NavLink>
          </li>
          <li className="nav-item mx-1">
             <NavLink className="nav-link" exact to="/post">Post Content</NavLink>
          </li>
          <RenderMenu/>
        </ul>
        </div>
      </nav>
    );
}

export default head;