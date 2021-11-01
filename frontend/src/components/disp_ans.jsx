import react, { useState } from "react";
import reactDom from "react-dom";
import {ImArrowUp} from "react-icons/im";
import {ImArrowDown} from "react-icons/im";
import { useParams } from "react-router";
import {useHistory} from "react-router-dom";

function ans(props){
    const history=useHistory();
    let {id,qid,content,username,like,unlike,date,likeusers,unlikeusers,likec,unlikec,activeuser}=props;
    var d=new Date(date);
    const [LikeCount,setLikeCount]=useState(like);
    const [UnlikeCount,setUnlikeCount]=useState(unlike);
    const [likeClicked,setLikeClicked]=useState(likec);
    const [unlikeClicked,setUnlikeClicked]=useState(unlikec);
    const handleLike=async (e)=>{
        try{
        const res=await fetch("/likea",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({qid,id})
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
            const res=await fetch("/unlikea",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({qid,id})
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
    return(
        <>
        <div className="disp-ans-box">
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

export default ans;