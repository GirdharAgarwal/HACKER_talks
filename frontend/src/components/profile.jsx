import react,{useEffect,useState,useContext} from "react";
import {useHistory} from "react-router-dom";
import Disp from "./disp_user";
import Dispp from "./disp_post_prof";
import Dispq from "./disp_ques_prof";
import {UserContext} from "../app";

function profile(){
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    const [userData,setuserData]=useState({});
    const [posts,setPosts]=useState([]);
    const [ques,setQues]=useState([]);

    const callProfilePage=async ()=>{
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
        if(!data)
        {
          const err=new Error(res.error);
          throw err;
        }
        else
        {
          setuserData(data);
          dispatch({type:"USER",payload:true});
        }
      }
      catch(err){
        console.log(err);
        history.push("/signin");
      }
    }
    const getData=async ()=>{
      try{
        const res=await fetch("/getData",{
          method:"GET",
            headers:{
                Accept:"application/json",
                "Content-Type":"application/json"
            },
            credentials:"include"  
            //so cookies/tokens can be share to backend
        });
        const data=await res.json();
        if(!data)
        {
          const err=new Error(res.error);
          throw err;
        }
        else
        {
          // console.log(data.posts);
          // console.log(data.ques);
          setPosts(data.posts);
          setQues(data.ques);
          // console.log(data);
        }
      }
      catch(err){
        console.log(err);
        history.push("/signin");
      }
    }
    async function call(){
      await callProfilePage();
      await getData();
    }
    useEffect(()=>{
        call();
    },[]);
    function Displaypost(post){
      let likec=false;
      let unlikec=false;
      let activeuser=userData.username;
      if(post.likeusers.includes(activeuser))
      likec=true;
      if(post.unlikeusers.includes(activeuser))
      unlikec=true;
      return(<Dispp
        key={post._id}
        id={post._id}
        subj={post.subj}
        content={post.content}
        username={post.username}
        like={post.like}
        unlike={post.unlike}
        date={post.date}
        likeusers={post.likeusers}
        unlikeusers={post.unlikeusers}
        likec={likec}
        unlikec={unlikec}
      />);
    }
    function Displayques(ques){
      let likec=false;
      let unlikec=false;
      let activeuser=userData.username;
      if(ques.likeusers.includes(activeuser))
      likec=true;
      if(ques.unlikeusers.includes(activeuser))
      unlikec=true;
      return(<Dispq
        key={ques._id}
        id={ques._id}
        subj={ques.subj}
        content={ques.content}
        username={ques.username}
        like={ques.like}
        unlike={ques.unlike}
        date={ques.date}
        likeusers={ques.likeusers}
        unlikeusers={ques.unlikeusers}
        activeuser={activeuser}
        likec={likec}
        unlikec={unlikec}
        answers={ques.answers}
      />);
    }
    return (
      <>
        <Disp username={userData.username} name={userData.name} 
        email={userData.email} tokens={userData.tokens} about={userData.about}/>
        {posts.length!=0 ? 
        <><p className="prof-heading">Posts:- </p>
        {posts.map(Displaypost)}</>:
        <></>
        }
        {ques.length!=0 ? 
        <><p className="prof-heading">Questions And Answers:- </p>
        {ques.map(Displayques)}</>:
        <></>
        }
      </>
    );
}
export default profile;