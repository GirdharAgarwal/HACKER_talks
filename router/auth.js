const jwt=require("jsonwebtoken");
const express = require('express');
const router=express.Router();
const bcrypt=require("bcryptjs");
const multer=require("multer");
const randomstring=require("randomstring");
const cookieParser = require('cookie-parser');
require("../db/conn");

const User=require("../models/userSchema");
const Post=require("../models/postSchema");
const Ques=require("../models/quesSchema");
const Ans=require("../models/ansSchema");
const mailer=require("../misc/mailer");
router.use(cookieParser());
const authenticate= require("../middleware/authenticate");
// const storage=multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,"./client/public/uploads");
//     },
//     filename:(req,file,callback)=>{
//         callback(null,file.originalname);
//     }
// });
// const upload=multer({storage:storage});

router.get("/getData",authenticate,async (req,res)=>{
    // console.log(req.rootUser);
    const user=req.rootUser.username;
    try{
        const p=await Post.find({username:user});
        const q=await Ques.find({ $or:[ {username:user},{"answers.username":user}]});
        res.send({posts:p,ques:q});
    }
    catch(err){
        res.send({});
    }
});

router.post("/verifyOtp",async(req,res)=>{
    try{
        const otp=req.body.otp;
        const userExists=await User.findOne({username:req.body.username});
        // console.log(userExists);
        const verifyOtp=await bcrypt.compare(otp,userExists.otp);
        // console.log(verifyOtp);
        if(verifyOtp)
        {
            return res.status(201).json({message:"User Signup successful"});
        }
        else
        {
            User.deleteOne({username:req.body.username}).exec();
            return res.status(422).json({error:"Wrong OTP entered"});
        }
    }
    catch(err){
        User.deleteOne({username:req.body.username}).exec();
        return res.status(422).json({error:"Wrong OTP entered"});
    }
});

router.post("/signup",async function (req,res){
    const {username,name,about,email,pwd,cpwd}=req.body;
    if(!username || !name || !email || !pwd || !cpwd)
    {
        return res.status(422).json({error:"Please fill the fields properly"});
    }
    if(pwd!=cpwd)
    {
        return res.status(422).json({error:"Passwords does not match"});
    }
    try{
    const emailExists=await User.findOne({email:email});
    if(emailExists)
        return res.status(422).json({error:"User Exists"});
        
    let userExists=await User.findOne({username:username});
    if(userExists)
        return res.status(422).json({error:"Username exists"});
    let imagename="Unknown.jpg";
    const user=new User({
            username,name,about,email,pwd,image:imagename
        });
    const isSuccess=await user.save();
    if(isSuccess)
    {
        const otp=randomstring.generate({
            length:6,
            charset:'numeric'
        });
        userExists=await User.findOne({username:username});
        const Otp=await userExists.generateOTP(otp);
        const html=`It is good to see you. Please enter this otp to verify account:- <b>${otp}</b>`;
        await mailer.sendEmail('noreply@gmail.com',email,"OTP VERIFICATION",html);
        res.status(201).json({message:"Please check your email for OTP"});
    }
    }
    catch(err){
        console.log(err);
    }
});

router.post("/signin",async function(req,res){
    try{
        const {id,pwd}=req.body;
        if(!id|| !pwd)
            return res.status(400).json({error:"Please fill the fields properly"});
        const emailExists=await User.findOne({email:id});
        const idExists=await User.findOne({username:id});
        if(emailExists)
        {
            // console.log(await bcrypt.hash(pwd,12));
            const userExists=await bcrypt.compare(pwd,emailExists.pwd);
            // const userExists=await User.findOne({email:id,pwd:await bcrypt.hash(pwd,12)});  //this will not work
            if(userExists)
            {
                const token=await emailExists.generateAuthToken();
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now + 86400000),
                    httpOnly:false
                });
                return res.status(201).json({message:"User Login successful"});
            }
            else
            return res.status(400).json({error:"Invalid details entered"});
        }
        else if(idExists)
        {
            // console.log(await bcrypt.hash(pwd,12));
            const userExists=await bcrypt.compare(pwd,idExists.pwd);
            // const userExists=await User.findOne({username:id,pwd:await bcrypt.hash(pwd,12)});  //this will not work
            if(userExists)
            {
                const token=await idExists.generateAuthToken();
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now + 86400000),
                    httpOnly:false
                });
                // console.log(req.cookies.jwtoken);
                return res.status(201).json({message:"User Login successful"});
            }
            else
            return res.status(400).json({error:"Invalid details entered"});
        }
        else
            res.status(400).json({error:"Invalid details entered"}).redirect("signup");
    }
    catch(err){
            console.log(err);
        }
});

router.get("/verify",authenticate,(req,res)=>{
    res.send(req.rootUser);
});

router.get("/getpostUpload",async function(req,res){
     try{
         console.log("hello");
         const p=await Post.find({}).sort({"date":-1,"like":-1,"unlike":1,"username":1});
         res.send(p);
     }
     catch(err){
        // console.log("ERROR - "+err);
        res.send([]);
     }
});

router.get("/getpostsortbyUpvotes",async function(req,res){
    try{
        const p=await Post.find({}).sort({"like":-1,"unlike":1,"date":1,"username":1});
        res.send(p);
    }
    catch(err){
        res.send([]);
    }
});

router.get("/getpostsortbyDownvotes",async function(req,res){
    try{
        const p=await Post.find({}).sort({"unlike":-1,"like":-1,"date":-1,"username":1});
        res.send(p);
    }
    catch(err){
        res.send([]);
    }
});

router.get("/getpostsortbyUsername",async function(req,res){
    try{
        const p=await Post.find({}).sort({"username":1,"like":-1,"unlike":1,"date":-1});
        res.send(p);
    }
    catch(err){
        res.send([]);
    }
});

router.get("/signout",async function(req,res){
    res.clearCookie("jwtoken",{path:"/"});
    res.status(200).send("Logout Successful");
});

router.post("/doubt",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized Access");
    let username=req.rootUser.username;
    let {subj,content}=req.body;
    if(!subj)
    subj="Untitled";
    const like=0;
    const unlike=0;
    const date=Date.now();
    const ques=new Ques({
        username,subj,content,like,unlike,date
    });
    // console.log(ques);
    const isSuccess=await ques.save();
    if(isSuccess)
    res.status(201).json({message:"Question added successfully"});
    else
    res.status(422).json({error:"Please try again"});
});



router.post("/deletePost",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    try{
        // console.log(req.body.id);
        Post.deleteOne({_id:req.body.id}).exec();
        res.status(201).json({message:"Post deleted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(422).json({error:"Please try again"});
    }
});

router.post("/deleteQues",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    try{
        // console.log(req.body.id);
        Ques.deleteOne({_id:req.body.id}).exec();
        res.status(201).json({message:"Ques deleted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(422).json({error:"Please try again"});
    }
});

router.post("/deleteAns",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    try{
        let {qid,id}=req.body;
        // console.log(qid);
        // console.log(id);
        const ques=await Ques.findOne({_id:qid});
        if(ques)
        {
            Ans.deleteOne({_id:id}).exec();
            const ans=await ques.Delanswer(id);
            res.status(201).json({message:"Ans deleted successfully"});
        }
        else
        {
            res.status(422).json({error:"Please try again"});
        }
    }
    catch(err){
        console.log(err);
        res.status(422).json({error:"Please try again"});
    }
});




router.post("/updatepost",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    let {id,subj,content}=req.body;
    try{
        Post.updateOne({_id:id},{$set:{subj,content}}).exec();
        res.status(201).json({message:"Post updated successfully"});
    }
    catch(err){
        console.log(err);
        res.status(422).json({error:"Please try again"});
    }
});

router.post("/updateques",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    let {id,subj,content}=req.body;
    try{
        Ques.updateOne({_id:id},{$set:{subj,content}}).exec();
        res.status(201).json({message:"Ques updated successfully"});
    }
    catch(err){
        console.log(err);
        res.status(422).json({error:"Please try again"});
    }
});

router.post("/updateans",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    let {qid,id,content}=req.body;
    try{
        const ques=await Ques.findOne({_id:qid});
        if(ques)
        {
            Ans.updateOne({_id:id},{$set:{content}}).exec();
            const ans=await ques.Updateanswer(id,content);
            res.status(201).json({message:"Ans updated successfully"});
        }
        else
        {
            res.status(422).json({error:"Please try again"});
        }
    }
    catch(err){
        console.log(err);
        res.status(422).json({error:"Please try again"});
    }
});



router.post("/addpost",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    let username=req.rootUser.username;
    let {subj,content}=req.body;
    if(!subj)
    subj="Untitled";
    const like=0;
    const unlike=0;
    const date=Date.now();
    const post=new Post({
            username,subj,content,like,unlike,date
        });
    const isSuccess=await post.save();
    if(isSuccess)
        res.status(201).json({message:"Post added successfully"});
    else
        res.status(422).json({error:"Please try again"});
});

router.post("/addanswer",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized:No token provided");
    let username=req.rootUser.username;
    let {qid,content}=req.body;
    const like=0;
    const unlike=0;
    const date=Date.now();
    let ans=new Ans({
            username,content,like,unlike,date
        });
    ans.id=ans._id;
    const answer=await ans.save();
    const ques=await Ques.findOne({_id:qid});
    if(answer&&ques)
    {
        const answers=await ques.Addanswer(answer);
        res.status(201).json({answers:[answers]});
    }
    else
        res.status(422).json({error:"Please try again"});
});

router.post("/unlike",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized access");
    let username=req.username;
    try{
        const id=req.body.id;
        const postExists=await Post.findOne({_id:id});
        const Count=await postExists.Unlike(username);
        res.status(200).json({likeCount:[Count.likeCount],unlikeCount:[Count.unlikeCount]});
    }
    catch(err){
        console.log(err);
    }
});

router.post("/like",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized access");
    let username=req.username;
    try{
        const id=req.body.id;
        const postExists=await Post.findOne({_id:id});
        const Count=await postExists.Like(username);
        res.status(200).json({likeCount:[Count.likeCount],unlikeCount:[Count.unlikeCount]});
    }
    catch(err){
        console.log(err);
    }
});

router.post("/unlikeques",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized access");
    let username=req.username;
    try{
        const id=req.body.id;
        const quesExists=await Ques.findOne({_id:id});
        const Count=await quesExists.Unlike(username);
        res.status(200).json({likeCount:[Count.likeCount],unlikeCount:[Count.unlikeCount]});
    }
    catch(err){
        console.log(err);
    }
});

router.post("/likeques",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized access");
    let username=req.username;
    try{
        const id=req.body.id;
        const quesExists=await Ques.findOne({_id:id});
        const Count=await quesExists.Like(username);
        res.status(200).json({likeCount:[Count.likeCount],unlikeCount:[Count.unlikeCount]});
    }
    catch(err){
        console.log(err);
    }
});

router.post("/unlikea",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized access");
    let username=req.username;
    try{
        const id=req.body.id;
        const qid=req.body.qid;
        const quesExists=await Ques.findOne({_id:qid});
        const Count=await quesExists.Unlikea(id,username);
        res.status(200).json({likeCount:[Count.likeCount],unlikeCount:[Count.unlikeCount]});
    }
    catch(err){
        console.log(err);
    }
});

router.post("/likea",authenticate,async function(req,res){
    if(!req.rootUser)
        res.status(401).send("Unauthorized access");
    let username=req.username;
    try{
        const id=req.body.id;
        const qid=req.body.qid;
        const quesExists=await Ques.findOne({_id:qid});
        const Count=await quesExists.Likea(id,username);
        res.status(200).json({likeCount:[Count.likeCount],unlikeCount:[Count.unlikeCount]});
    }
    catch(err){
        console.log(err);
    }
});

router.get("/getquessortbyUploadDate",async function(req,res){
    try{
        const p=await Ques.find({}).sort({"date":-1,"like":-1,"unlike":1,"username":1});
        res.send(p);
    }
    catch(err){
        res.send([]);
    }
});

router.get("/getquessortbyUpvotes",async function(req,res){
   try{
       const p=await Ques.find({}).sort({"like":-1,"unlike":1,"username":1,"date":1});
       res.send(p);
   }
   catch(err){
       res.send([]);
   }
});

router.get("/getquessortbyDownvotes",async function(req,res){
   try{
       const p=await Ques.find({}).sort({"unlike":-1,"like":-1,"date":-1,"username":1});
       res.send(p);
   }
   catch(err){
       res.send([]);
   }
});

router.get("/getquessortbyUsername",async function(req,res){
   try{
       const p=await Ques.find({}).sort({"username":1,"date":-1,"like":-1,"unlike":1});
       res.send(p);
   }
   catch(err){
       res.send([]);
   }
});

module.exports=router;


// using promises
// router.post("/signup",function (req,res){
//     const {username,fname,lname,about,email,pwd,cpwd}=req.body;
//     if(!username || !fname || !lname || !email || !pwd || !cpwd || pwd!=cpwd)
//     {
//         return res.status(422).json({error:"Please fill the fields properly"});
//     }
//     User.findOne({ $or: [ { username:username},{email:email} ] } )
//     .then((userExists)=>{
//         if(userExists)
//         return res.status(422).json({error:"User Exists"});

//         const user=new User({
//             username,fname,lname,about,email,pwd,cpwd
//         });

//         user.save().then(()=>{
//             res.status(201).json({message:"User signup successful"});
//         }).catch((err)=>{
//             res.status(500).json({error:"Failed to signup"});
//         })
//     }).catch((err)=>{
//       console.log(err);  
//     })
// });
