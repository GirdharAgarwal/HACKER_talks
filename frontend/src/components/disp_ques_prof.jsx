import react, {useState,useEffect,useContext} from "react";
import useStateWithCallback from "use-state-with-callback";
import reactDom from "react-dom";
import {ImArrowUp} from "react-icons/im";
import {ImArrowDown} from "react-icons/im";
import { useParams } from "react-router";
import {useHistory} from "react-router-dom";
import Disp from "../components/disp_ans_prof";
import {UserContext} from "../app";
import {MdDelete} from "react-icons/md";
import {BiEdit,BiWindows} from "react-icons/bi";

function home(props){
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    let {id,subj,content,username,like,unlike,date,likeusers,unlikeusers,activeuser,likec,unlikec,answers}=props;
    var d=new Date(date);
    const [LikeCount,setLikeCount]=useState(likeusers.length);
    const [UnlikeCount,setUnlikeCount]=useState(unlikeusers.length);
    const [likeClicked,setLikeClicked]=useState(likec);
    const [unlikeClicked,setUnlikeClicked]=useState(unlikec);
    const [ansbtn,setansbtn]=useState(false);
    const [Ans,setanswers]=useState(answers);

    const [disp,setDisp]=useState(true);
    const [editdisp,setEditDisp]=useState(false);
    const [editData,setEditData]=useState({
        title:subj,
        content:content
    })
    const [quesData,setQuesData]=useState({
        title:subj,
        content:content
    });
    const handleLike=async (e)=>{
        try{
        const res=await fetch("/likeques",{
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
            const res=await fetch("/unlikeques",{
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
    function AnswerForm(){
        if(ansbtn)
        {
            const [anscontent,setcontent]=useState("");
            function handleChange(event)
            {
                const val=event.target.value;
                setcontent(val);
            }
            function close()
            {
                setansbtn(false);
            }
            async function postAnswer(e){
            e.preventDefault();
            try{
                const res=await fetch("/addanswer",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        qid:id,content:anscontent
                    })
                });
                const data=await res.json();
                // console.log(data.answers);
                // console.log(data.answers[0]);
                if(!data||res.status!=201)
                {
                    const err=new Error("Unauthorized Access");
                    throw err;
                    history.push("/signin");
                }
                else
                {
                    setanswers(data.answers[0]);//mark this,initially you are assigning data.answers which is not working
                    setansbtn(false);
                }
            }
            catch(err){
                    console.log(err);
                    history.push("/signin");
               }
            }
            return(
                <>
                <div className="outer shadow">
                <form className="post-form">
                   <div className="form-group mb-3">
                      <label htmlFor="content" className="small-size">Answer *</label>
                      <textarea rows="6" type="text" name="answer" className="form-control" id="answer" autoComplete="off" value={anscontent} onChange={handleChange} required/>
                   </div>
                   <button type="submit" className="mb-3 mx-auto btn btn-primary" onClick={postAnswer}>Post Content</button>
                   <button className="mb-3 mx-auto btn btn-primary" onClick={close}>Close</button>
                </form>
                </div>
                </>
            );
        }
        else
        {
            return(
                <>
                </>
            );
        }
    }
    function addAnswer(e){
        setansbtn(true);
    }
    function Display(data){
            let likec=false;
            let unlikec=false;
            if(data.likeusers && data.likeusers.includes(activeuser))
            likec=true;
            if(data.unlikeusers && data.unlikeusers.includes(activeuser))
            unlikec=true;
            return(<Disp
                key={data._id}
                qid={id}
                id={data._id}
                content={data.content}
                username={data.username}
                like={data.like}
                unlike={data.unlike}
                date={data.date}
                likeusers={data.likeusers}
                unlikeusers={data.unlikeusers}
                likec={likec}
                unlikec={unlikec}
                activeuser={activeuser}/>
            );
    }
    
    async function quesDelete(e){
        setDisp(false);
        try{
            const res=await fetch("/deleteQues",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({id})
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
    function quesEdit(e){
        setEditData(quesData);
        setDisp(false);
        setEditDisp(true);
    }
    function handleChange(e){
        const name=e.target.name;
        const value=e.target.value;
        setEditData({...editData,[name]:value});
    }
    async function updateQues(e){
        e.preventDefault();
        try{
            const res=await fetch("/updateques",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        id,
                        subj:editData.title,
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
                setQuesData(editData);
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
        {disp?
        <>
        <div className="disp-box">
           <div className="head-content">
               {quesData.title}
               {activeuser==username?
               <>
               <button type="button" className="disp-button clicked" name="Delete" onClick={quesDelete}><MdDelete size={25}/></button>
               <button type="button" className="disp-button clicked" name="Edit" onClick={quesEdit}><BiEdit size={25}/></button>
               </>:
               <></>
               }
           </div>
           <div className="disp-content">
              {quesData.content}
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
        <button type="button" className="answer-button" name="Addanswer" onClick={addAnswer}>Add Answer</button>
        </div>
        </>:
        <></>
        }
        {editdisp?
        <>
        <div className="post-box">
        <form className="post-form">
            <div className="form-group mb-3">
                <label for="title" className="small-size">Title</label>
                <input type="text" name="title" id="title" value={editData.title} onChange={handleChange} autoComplete="off"/>
            </div>
            <div className="form-group mb-3">
                <label for="content" className="small-size">Content *</label>
                <textarea rows="6" type="text" name="content" className="form-control" id="content" value={editData.content} onChange={handleChange} autoComplete="off" required/>
            </div>
            <button type="submit" className="mb-3 mx-auto btn btn-primary" onClick={updateQues}>Update Ques</button>
            <button className="mb-3 mx-auto btn btn-primary" onClick={()=>
            {
                setDisp(true);
                setEditDisp(false);
            }}>Cancel</button>
        </form>
        </div>
        </>:
        <>
        </>
        }
        <AnswerForm/>
        {Ans.map(Display)}
        </>
    );
}

export default home;