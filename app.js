const dotenv=require("dotenv");
const express=require("express");
const mongoose=require("mongoose");

const app=express();

dotenv.config({path : './config.env'});
require("./db/conn");

app.use(express.json());
app.use(express.static("client"));
app.use(require("./router/auth"));

if(process.env.NODE_ENV === "production"){
    app.use(express.static('frontend/build'));
}
// const middleware=(req,res,next)=>{
//     console.log("Hello");
//     next();
// }
const PORT=process.env.PORT || 80;

app.listen(PORT,function(){
    console.log(`Server started successfully on port : ${PORT}`);
})