import react, {useContext,useEffect } from "react";
import {useHistory} from "react-router-dom";
import {UserContext} from "../app";

function signout(){
    //using promises

    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    useEffect(()=>{
        fetch("/signout",{
            method:"GET",
            headers:{
                Accept:"application/json",
                "Content-Type":"application/json"
            },
            credentials:"include"  
            //so cookies/tokens can be share to backend
        }).then((res)=>{
            dispatch({type:"USER",payload:false});
            history.push("/");
            if(res.status!= 200)
            {
                const err=new Error(res.error);
                throw err;
            }
        }).catch((err)=>{
            console.log(err);
        });
    });
    return(
        <>
        </>
    );
}

export default signout;