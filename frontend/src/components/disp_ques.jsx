import react, {useState,useEffect,useContext} from "react";
import useStateWithCallback from "use-state-with-callback";
import reactDom from "react-dom";
import {ImArrowUp} from "react-icons/im";
import {ImArrowDown} from "react-icons/im";
import { useParams } from "react-router";
import {useHistory} from "react-router-dom";
import Disp from "../components/disp_ans";
import {UserContext} from "../app"

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
            // console.log(data.username);
            // setUser(data.username);
            dispatch({type:"USER",payload:true});
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
        <button type="button" className="answer-button" name="Addanswer" onClick={addAnswer}>Add Answer</button>
        <AnswerForm/>
        {Ans.map(Display)}
        </div>
        </>
    );
}

export default home;