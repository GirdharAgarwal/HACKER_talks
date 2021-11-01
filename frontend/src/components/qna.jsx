import react,{useEffect,useState,useContext} from "react";
import {useHistory} from "react-router-dom";
import Disp from "./disp_ques";
import {UserContext} from "../app";

function qna(){
    const {state,dispatch}=useContext(UserContext);
    const [QuesData,setQuesData]=useState([]);
    const [sortOrder,setOrder]=useState("Upload Date");
    const [activeuser,setUser]=useState();
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
          setUser(data.username);
          dispatch({type:"USER",payload:true});
        }
      }
      catch(err){
        console.log(err);
      }
  }
  async function qna(){
    await callVerifyPage();
    await callQnaPage();
  }
  useEffect(()=>{
        qna();
    },[]);
  function Display(ques){
      let likec=false;
      let unlikec=false;
      if(ques.likeusers.includes(activeuser))
      likec=true;
      if(ques.unlikeusers.includes(activeuser))
      unlikec=true;
      return(<Disp
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
    const callQnaPage=async ()=>{
      try{
        const res=await fetch("/getquessortbyUploadDate");
        const data=await res.json();
        if(res.status!=200)
        {
          const err=new Error(res.error);
          throw err;
        }
        setQuesData(data);
      }
      catch(err){
        console.log(err);
      }
    }
    async function handleSort(e){
      setOrder(e.target.value);
      if(e.target.value==="Upload Date")
      {
        <callQuesPage/>
      }
      else if(e.target.value==="Upvotes")
      {
        try{
          const res=await fetch("/getquessortbyUpvotes");
          const data=await res.json();
          setQuesData(data);
          if(res.status!=200)
          {
              const err=new Error(res.error);
              throw err;
          }
        }
        catch(err){
          console.log(err);
        }
      }
      else if(e.target.value==="Username")
      {
        try{
          const res=await fetch("/getquessortbyUsername");
          const data=await res.json();
          setQuesData(data);
          if(res.status!=200)
          {
              const err=new Error(res.error);
              throw err;
          }
        }
        catch(err){
          console.log(err);
        }
      }
      else
      {
        try{
          const res=await fetch("/getquessortbyDownvotes");
          const data=await res.json();
          setQuesData(data);
          if(res.status!=200)
          {
              const err=new Error(res.error);
              throw err;
          }
        }
        catch(err){
          console.log(err);
        }
      }
    }
    return (
      <>
        <label htmlFor="sortby">Sort by </label>
        <select name="sortby" id="sortby" onChange={handleSort} value={sortOrder}>
          <option value="Upload Date">Upload Date</option>
          <option value="Upvotes">Upvotes</option>
          <option value="Downvotes">Downvotes</option>
          <option value="Username">Username</option>
        </select>
      {QuesData.map(Display)}
      </>
    );
}
export default qna;