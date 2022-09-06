import react, {useContext,useState,useEffect} from "react";
import reactDom from "react-dom";
import {ImArrowUp} from "react-icons/im";
import {ImArrowDown} from "react-icons/im";
import { useParams } from "react-router";
import {useHistory} from "react-router-dom";
import {UserContext} from "../app";

function home(props){
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    let {id,subj,content,username,like,unlike,date,likeusers,unlikeusers,likec,unlikec}=props;
    var d=new Date(date);
    const [LikeCount,setLikeCount]=useState(likeusers.length);
    const [UnlikeCount,setUnlikeCount]=useState(unlikeusers.length);
    const [likeClicked,setLikeClicked]=useState(likec);
    const [unlikeClicked,setUnlikeClicked]=useState(unlikec);
    const [activeuser,setUser]=useState();
    const handleLike=async (e)=>{
        try{
        const res=await fetch("/like",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({id})
          });
        const data=await res.json();
        //   console.log(data);
        if(!data||res.status!=200)
        {
            const err=new Error("Try again");
            throw err;
        }
        else{
            setLikeClicked(!likeClicked);
            setLikeCount(data.likeCount);
            if(UnlikeCount>data.unlikeCount)
            setUnlikeClicked(false);
            setUnlikeCount(data.unlikeCount);
        }
        }
        catch(err){
            history.push("/signin");
          console.log("Unsuccessful");
        }
    }
    async function handleUnlike(e) {
        try{
            const res=await fetch("/unlike",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({id})
              });
              const data=await res.json();
            //   console.log(data);
            if(!data||res.status!=200)
            {
                const err=new Error("Try again");
                throw err;
            }
            else{
                setUnlikeClicked(!unlikeClicked);
                setUnlikeCount(data.unlikeCount);
                if(LikeCount>data.likeCount)
                {setLikeClicked(false);}
                setLikeCount(data.likeCount);
            }
        }
        catch(err){
            history.push("/signin");
            console.log("Unsuccessful");
        }
    }
    const callVerifyPage=async ()=>{
        try{
          const res=await fetch("/verify",{
              method:"GET",
              headers:{
                  Accept:"application/json",
                  "Content-Type":"application/json"
              },
              credentials:"include"  
              //so cookies/tokens can be share to backend
          });
          const data=await res.json();
          if(res.status!=200)
          {
              const err=new Error(res.error);
              throw err;
          }
          else{
            dispatch({type:"USER",payload:true});
            // console.log(data.username);
            setUser(data.username);
          }
        }
        catch(err){
          console.log(err);
        }
    }
    useEffect(()=>{
            callVerifyPage();
        },[]);
    return(
        <>
        <div className="disp-box">
           <div className="head-content">
               {subj}
           </div>
           <div className="disp-content">
              {content}
           </div>
           <div>
                {likeClicked===true? 
                <button type="button" className="disp-button clicked" name="Like" onClick={handleLike}><ImArrowUp size={25}/></button> :
                <button type="button" className="disp-button" name="Like" onClick={handleLike}><ImArrowUp size={25}/></button>}
                <p className="bottom-content">{LikeCount}</p>
                {unlikeClicked===true?
                <button type="button" className="disp-button clicked" name="Unlike" onClick={handleUnlike}><ImArrowDown size={25}/></button> :
                <button type="button" className="disp-button" name="Unlike" onClick={handleUnlike}><ImArrowDown size={25}/></button>}
                <p className="bottom-content">{UnlikeCount}</p>
                <p className="disp-user">☞  {username}
                <p className="disp-date">({d.toDateString()})</p></p>
           </div>
        </div>
        </>
    );
}

export default home;