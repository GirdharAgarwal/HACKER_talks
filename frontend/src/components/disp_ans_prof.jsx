import react, { useState } from "react";
import reactDom from "react-dom";
import {ImArrowUp} from "react-icons/im";
import {ImArrowDown} from "react-icons/im";
import { useParams } from "react-router";
import {useHistory} from "react-router-dom";
import {MdDelete} from "react-icons/md";
import {BiEdit,BiWindows} from "react-icons/bi";

function ans(props){
    const history=useHistory();
    let {id,qid,content,username,like,unlike,date,likeusers,unlikeusers,likec,unlikec,activeuser}=props;
    var d=new Date(date);
    const [LikeCount,setLikeCount]=useState(like);
    const [UnlikeCount,setUnlikeCount]=useState(unlike);
    const [likeClicked,setLikeClicked]=useState(likec);
    const [unlikeClicked,setUnlikeClicked]=useState(unlikec);
    const [disp,setDisp]=useState(true);
    const [editdisp,setEditDisp]=useState(false);
    const [editData,setEditData]=useState({
        content:content
    })
    const [ansData,setAnsData]=useState({
        content:content
    });
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
    
    async function ansDelete(e){
        setDisp(false);
        try{
            const res=await fetch("/deleteAns",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({qid,id})
            });
            const data=await res.json();
            if(!data)
            {
                window.alert("Unauthorized Access");
                const err=new Error("Unauthorized Access");
                throw err;
            }
            else
            {
                window.alert([data.message]);
            }
        }
        catch(err){
            window.alert([data.error]);
            // console.log(err);
            history.push("/signin");
        }
    }
    function ansEdit(e){
        setEditData(ansData);
        setDisp(false);
        setEditDisp(true);
    }
    function handleChange(e){
        const name=e.target.name;
        const value=e.target.value;
        setEditData({...editData,[name]:value});
    }
    async function updateAns(e){
        e.preventDefault();
        try{
            const res=await fetch("/updateans",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        qid,id,
                        content:editData.content
                    })
                });
            const data=await res.json();
            if(!data||res.status!=201)
            {
                const err=new Error("Unauthorized Access");
                throw err;
                history.push("/signin");
            }
            else
            {
                window.alert(data.message);
                setAnsData(editData);
                setDisp(true);
                setEditDisp(false);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    
    return(
        <>
        {activeuser==username?
        <>
        {disp?
        <>
        <div className="disp-box">
           <div className="disp-content">
              {ansData.content}
               <button type="button" className="disp-button clicked" name="Delete" onClick={ansDelete}><MdDelete size={25}/></button>
               <button type="button" className="disp-button clicked" name="Edit" onClick={ansEdit}><BiEdit size={25}/></button>
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
                <p className="disp-user">-{username}({d.toDateString()})</p>
           </div>
        </div>
        </>:
        <></>}
        {editdisp?
        <>
        <div className="outer shadow">
        <form className="post-form">
            <div className="form-group mb-3">
                <label for="content" className="small-size">Content *</label>
                <textarea rows="6" type="text" name="content" className="form-control" id="content" value={editData.content} onChange={handleChange} autoComplete="off" required/>
            </div>
            <button type="submit" className="mb-3 mx-auto btn btn-primary" onClick={updateAns}>Update Ans</button>
            <button className="mb-3 mx-auto btn btn-primary" onClick={()=>
            {
                setDisp(true);
                setEditDisp(false);
            }}>Cancel</button>
        </form>
        </div>
        </>:
        <></>
        }
        </>:
        <></>
        }
        </>
    );
}

export default ans;