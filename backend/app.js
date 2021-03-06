const dotenv=require("dotenv");
const express=require("express");
const mongoose=require("mongoose");

const app=express();

dotenv.config({path : './config.env'});
require("./db/conn.js");
app.use(express.json());
app.use(express.static("client"));
app.use(require("./router/auth"));

// const middleware=(req,res,next)=>{
//     console.log("Hello");
//     next();
// }
const PORT=process.env.PORT || 5000;

app.listen(PORT,function(){
    console.log(`Server started successfully on port : ${PORT}`);
})