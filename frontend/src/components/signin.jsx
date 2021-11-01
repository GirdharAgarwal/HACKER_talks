import react,{useContext, useState} from "react";
import signin from "../img/signin.jpg";
import {RiLockPasswordFill} from "react-icons/ri";
import {FaUserCircle} from "react-icons/fa";
import {NavLink,useHistory} from "react-router-dom";
import {UserContext} from "../app";

function login(){

    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    const [user,setUser]=useState({
        id:"",pwd:""
    });
    let name,value;
    function handleChange(event)
    {
        name=event.target.name;
        value=event.target.value;
        setUser({...user,[name]:value}); //see use of []
    }
    const SigninUser=async(e)=>{
        e.preventDefault();
        const {id,pwd}=user;
        
        const res=await fetch("/signin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id,pwd
            })
        });
        const data=await res.json();
        if(!data)
        {
            // console.log("error");
            window.alert("Please fill the details correctly");
        }
        else if(res.status===201)
        {
            dispatch({type:"USER",payload:true});
            // console.log(data.message);
            window.alert(data.message);
            history.push("/");
        }
        else
        {
            // console.log(data.error);
            window.alert(data.error);
        }
        setUser({
            id:"",pwd:""
        });
    }
    return(
        <>
        <div className="outer shadow row">
             <div className="col-md-5">
                 <img className="action-img" src={signin} alt="Sign-in"/>
                 <NavLink className="nav-link" exact to="/signup">Want to Create an account ?</NavLink>
             </div>
             <div className="col-md-7">
             <h2 className="form-heading fw-bolder mt-5 mx-5 pb-3">Sign in</h2>
             <form>
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="id"><FaUserCircle/></label>
                 <input type="text" name="id" id="id" autoComplete="none" 
                 value={user.id} onChange={handleChange} placeholder="Username or Email address"/>
                 </div>
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="pwd"><RiLockPasswordFill/></label>
                 <input type="password" name="pwd" id="pwd" autoComplete="none" 
                 value={user.pwd} onChange={handleChange} placeholder="Password"/>
                 </div>
                 <button type="submit" className="btn btn-primary mx-5 mb-2" onClick={SigninUser}>Sign in</button>
             </form>
             </div>
        </div>
        </>
    );
}

export default login;