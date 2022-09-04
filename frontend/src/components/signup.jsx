import react,{useState} from "react";
import signup from "../img/sign-up.svg";
import {ImUser} from "react-icons/im";
import {FcAbout} from "react-icons/fc";
import {AiOutlineMail} from "react-icons/ai";
import {RiLockPasswordFill} from "react-icons/ri";
import {FaUserCircle} from "react-icons/fa";
import {NavLink,useHistory} from "react-router-dom";
function register(){
    const history=useHistory();
    const [user,setUser]=useState({
        name:"",about:"",username:"",email:"",pwd:"",cpwd:""
    });
    const [otp,setOtp]=useState("");
    const [otpwindow,setOtpwindow]=useState(false);
    let name,value;
    function handleChange(event)
    {
        name=event.target.name;
        value=event.target.value;
        setUser({...user,[name]:value}); //see use of []
        // console.log(user);  
    }
    function handleOtp(event){
        setOtp(event.target.value);
    }
    const verifyOTP=async(e)=>{
        e.preventDefault();
        const res=await fetch("/verifyOtp",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username:user.username,otp
            })
        });
        const data=await res.json();
        if(!data)
        {
            window.alert("Please fill the form correctly");
        }
        else if(res.status===201)
        {
            window.alert(data.message);
            history.push("/signin");
        }
        else
        {
            window.alert(data.error);
            setOtpwindow(false);
            setUser({
            name:"",about:"",username:"",email:"",pwd:"",cpwd:""
            });
            setOtp("");
            history.push("/signup");
        }
    }
    const Postdata=async(e)=>{
        e.preventDefault();
        const {name,about,username,email,pwd,cpwd}=user;
        const formData=new FormData();
        formData.append("name",name);
        formData.append("about",about);
        formData.append("username",username);
        formData.append("email",email);
        formData.append("pwd",pwd);
        formData.append("cpwd",cpwd);
        const res=await fetch("/signup",{
            method:"POST",
            body:formData
        });
        const data=await res.json();
        if(!data)
        {
            window.alert("Please fill the form correctly");
        }
        else if(res.status===201)
        {
            window.alert(data.message);
            setOtpwindow(true);
        }
        else
        {
            window.alert(data.error);
        }
    } 
    return(
        <>
        {otpwindow==false?
        <>
        <div className="row outer">
             <div className="col-md-7">
             <h2 className="form-heading fw-bolder mt-5 mx-5 pb-3">Sign up</h2>
             <form method="POST" encType="multipart/form-data">
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="name"><ImUser/></label>
                 <input type="text" name="name" id="name" autoComplete="nope" 
                 value={user.name} onChange={handleChange}  placeholder="Full Name"/>
                 </div>
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="about"><FcAbout/></label>
                 <input type="text" name="about" id="about" autoComplete="nope"  
                 value={user.about} onChange={handleChange} placeholder="Bio"/>
                 </div>
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="username"><FaUserCircle/></label>
                 <input type="text" name="username" id="username" autoComplete="nope" 
                 value={user.username} onChange={handleChange} placeholder="Username"/>
                 </div>
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="email"><AiOutlineMail/></label>
                 <input type="text" name="email" id="email" autoComplete="nope" 
                 value={user.email} onChange={handleChange} placeholder="Email address"/>
                 </div>
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="pwd"><RiLockPasswordFill/></label>
                 <input type="password" name="pwd" id="pwd" autoComplete="nope" 
                 value={user.pwd} onChange={handleChange} placeholder="Password"/>
                 </div>
                 <div className="form-group mb-3 mx-5">
                 <label htmlFor="cpwd"><RiLockPasswordFill/></label>
                 <input type="password" name="cpwd" id="cpwd" autoComplete="nope" 
                 value={user.cpwd} onChange={handleChange} placeholder="Confirm Password"/>
                 </div>
                 <button type="submit" className="btn btn-primary mx-5 mb-2" onClick={Postdata}>Sign up</button>
             </form>
             </div>
             <div className="col-md-5">
                 <img className="action-img" src={signup} alt="Sign-up"/>
                 <NavLink className="nav-link" exact to="/signin">Already have an account, Sign in</NavLink>
             </div>
        </div>
        </>:
        <>
            <form className="outer">
            <input name="otp" id="otp" autoComplete="nope" placeholder="Enter OTP" value={otp} onChange={handleOtp} maxLength="6"/>
            <button type="submit" className="btn btn-primary mx-5 mb-2" onClick={verifyOTP}>Submit</button>
            </form> 
        </>
        }
        </>
    );
}

export default register;