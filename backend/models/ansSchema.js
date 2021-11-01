const mongoose=require("mongoose");

const ansSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    id:String,
    like:Number,
    unlike:Number,
    date:Date,
    likeusers:Array,
    unlikeusers:Array
});
ansSchema.methods.Like=async function(user){
    try{
        let f=this.likeusers.indexOf(user) > -1;
        let u,l;
        l=this.like;
        u=this.unlike;
        if(f)
        {
            l=this.like-1;
            this.like=l;
            this.likeusers=this.likeusers.filter((val)=>{return val!=user});
        }
        else{
            let f=this.unlikeusers.indexOf(user) > -1;
            if(f)
            {
                u=this.unlike-1;
                this.unlike=u;
                this.unlikeusers=this.unlikeusers.filter((val)=>{return val!=user});
            }
            l=this.like+1;
            this.like=l;
            this.likeusers=[...this.likeusers,user];
        }
        await this.save();
        return {likeCount:[l],unlikeCount:[u]};
    }
    catch(err)
    {
        console.log(err);
    }
};

ansSchema.methods.Unlike=async function(user){
    try{
        let f=this.likeusers.indexOf(user) > -1;
        let l,u;
        l=this.like;
        u=this.unlike;
        if(f)
        {
            l=this.like-1;
            this.like=l;
            this.likeusers=this.likeusers.filter((val)=>{return val!=user});
            u=this.unlike+1;
            this.unlike=u;
            this.unlikeusers=[...this.unlikeusers,user];
        }
        else{
            let f=this.unlikeusers.indexOf(user) > -1;
            if(f)
            {
                u=this.unlike-1;
                this.unlike=u;
                this.unlikeusers=this.unlikeusers.filter((val)=>{return val!=user});
            }
            else
            {
                u=this.unlike+1;
                this.unlike=u;
                this.unlikeusers=[...this.unlikeusers,user];
            }
        }
        await this.save();
        return {likeCount:[l],unlikeCount:[u]};
    }
    catch(err)
    {
        console.log(err);
    }
};

const Ans=mongoose.model("answer",ansSchema);

module.exports=Ans;