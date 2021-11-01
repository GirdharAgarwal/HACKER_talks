import react,{createContext, useReducer} from "react";
import Header from "./components/header";
import Home from "./components/home";
import Ask from "./components/ask";
import Post from "./components/addpost";
import Profile from "./components/profile";
import Qna from "./components/qna";
import Notfound from "./components/notfound";
import Signup from "./components/signup";
import Signin from "./components/signin";
import Signout from "./components/signout";
import { reducer,initialState } from "./reducer/UseReducer";

import {BrowserRouter as Router,Route,Switch,Link} from "react-router-dom";

const UserContext=createContext();
function App() {
    const [state,dispatch]=useReducer(reducer,initialState);
    return (
        <>
        <UserContext.Provider value={{state,dispatch}}>
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/qna" component={Qna} />
                    <Route exact path="/ask" component={Ask} />
                    <Route exact path="/post" component={Post} />
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/signin" component={Signin} />
                    <Route exact path="/signout" component={Signout} />
                    <Route exact path="/profile" component={Profile} />
                    <Route component={Notfound} />
                </Switch>
            </Router>
        </UserContext.Provider>
        </>
    );
}
export default App;
export {UserContext};
// export UserContext;