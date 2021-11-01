import react,{useEffect,useState,useContext} from "react";
import {useHistory} from "react-router-dom";
import {UserContext} from "../app";
function ques(){
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    const [quesData,setquesData]=useState({
        title:"",
        content:"",
        username:""
    });
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
          else
          {
            setquesData({...quesData,username:data.username});
            dispatch({type:"USER",payload:true});
          }
        }
        catch(err){
          console.log(err);
          history.push("/signin");
        }
    }
    useEffect(()=>{
          callVerifyPage();
      },[]);
    
    const addQues=async (e)=>{
        e.preventDefault();
        const {title,content,username}=quesData;
        const subj=title;
        try{
        const res=await fetch("/doubt",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                subj,content
            })
        });
        const data=await res.json();
        if(!data||res.status!=201)
        {
            const err=new Error("Unauthorized Access");
            throw err;
        }
        else
        {
            // console.log(data.message);
            window.alert(data.message);
            history.push("/qna");
        }
        setquesData({
           title:"",content:"",username:""
        });
        }
        catch(err){
            console.log(err);
            history.push("/signin");
        }
    }
    function handleChange(event)
    {
        const name=event.target.name;
        const value=event.target.value;
        setquesData({...quesData,[name]:value}); //see use of []
    }
    return (
        <>
        <div className="post-box">
        <form className="post-form">
            <div className="form-group mb-3">
                <label for="title" className="small-size">Subject</label>
                <input type="text" name="title" id="title" value={quesData.title} onChange={handleChange} autoComplete="off"/>
            </div>
            <div className="form-group mb-3">
                <label for="content" className="small-size">Query *</label>
                <textarea rows="6" type="text" name="content" className="form-control" id="content" value={quesData.content} onChange={handleChange} autoComplete="off" required/>
            </div>
            <button type="submit" className="mb-3 mx-auto btn btn-primary" onClick={addQues}>Post Question</button>
        </form>
        </div>
        </>
    );
}
export default ques;