import react from "react";
import reactDom from "react-dom";
function home(props){
    const {username,name,email,about,tokens}=props;
    return(
        <>
        <div className="profile-box">
        <div className="container">
           <div className="row">
               <div className="col-2">
                   <img className="profile-img" src={`/public/uploads/Unknown.jpg`} alt={username}/>
               </div>
               <div className="col-10">
                    <p className="h-profile">{username}</p>
                    <p className="c-profile">{name}</p>
                    <p className="c-profile">{about}</p>
               </div>
            </div>
        </div>
        </div>
        </>
    );
}

export default home;