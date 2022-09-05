const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please specify the username"]
    },
    name:{
        type:String,
        required:[true,"Please specify the first name"]
    },
    email:{
        type:String,
        required:[true,"Please specify the email"]
    },
    about:String,
    pwd:{
        type:String,
        required:[true,"Please specify the password"]
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    otp:{
        type:String
    },
    image:String
});

//hashing the password
userSchema.pre('save',async function(next){
    if(this.isModified('pwd')){
        this.pwd=await bcrypt.hash(this.pwd,12); //await is necessary
    }
    next();
});
userSchema.methods.generateOTP=async function(otp){
    try{
        this.otp=await bcrypt.hash(otp,12);
        await this.save();
        return this.otp;
    }
    catch(err)
    {
        console.log(err);
    }
}
userSchema.methods.generateAuthToken=async function(){
    try{
        let newtoken=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:newtoken});
        await this.save();
        return newtoken;
    }
    catch(err)
    {
        console.log(err);
    }
};
const User=mongoose.model("user",userSchema);

module.exports=User;


