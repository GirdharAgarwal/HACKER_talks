import react,{useEffect,useState,useContext} from "react";
import {useHistory} from "react-router-dom";
import Disp from "./disp_post";
import {UserContext} from "../app";

function home(){
    const {state,dispatch}=useContext(UserContext);
    const [PostData,setPostData]=useState([]);
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
  async function home(){
    await callVerifyPage();
    await callHomePage();
  }
  useEffect(()=>{
        home();
    },[]);
    function Display(post){
      let likec=false;
      let unlikec=false;
      if(post.likeusers.includes(activeuser))
      likec=true;
      if(post.unlikeusers.includes(activeuser))
      unlikec=true;
      return(<Disp
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
    const callHomePage=async ()=>{
      try{
        const res=await fetch("/getpostsortbyUploadDate");
        const data=await res.json();
        setPostData(data);
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
    async function handleSort(e){
      setOrder(e.target.value);
      if(e.target.value==="Upload Date")
      {
        <callHomePage/>
      }
      else if(e.target.value==="Upvotes")
      {
        try{
          const res=await fetch("/getpostsortbyUpvotes");
          const data=await res.json();
          setPostData(data);
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
          const res=await fetch("/getpostsortbyUsername");
          const data=await res.json();
          setPostData(data);
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
          const res=await fetch("/getpostsortbyDownvotes");
          const data=await res.json();
          setPostData(data);
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
        <label for="sortby">Sort by </label>
        <select name="sortby" id="sortby" onChange={handleSort} value={sortOrder}>
          <option value="Upload Date">Upload Date</option>
          <option value="Upvotes">Upvotes</option>
          <option value="Downvotes">Downvotes</option>
          <option value="Username">Username</option>
        </select>
      {PostData.map(Display)}
      </>
    );
}
export default home;