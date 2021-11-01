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

const quesSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    subj:String,
    content:{
        type:String,
        required:true
    },
    like:Number,
    unlike:Number,
    date:Date,
    likeusers:Array,
    unlikeusers:Array,
    answers:[ansSchema]
});

quesSchema.methods.Addanswer=async function(answer){
    try{
        this.answers=[...this.answers,answer];
        await this.save();
        return this.answers;
    }
    catch(err)
    {
        console.log(err);
    }
}

quesSchema.methods.Delanswer=async function(id){
    try{
        this.answers=this.answers.filter((e)=>{
            return e.id!= id;
        });
        await this.save();
        return this.answers;
    }
    catch(err)
    {
        console.log(err);
    }
}

quesSchema.methods.Updateanswer=async function(aid,content){
    try{
        // console.log(aid);
        // console.log(content);
        const ansIndex= this.answers.findIndex((ans)=>{
            return ans.id == aid});
        // console.log(ansIndex);
        this.answers[ansIndex].content=content;
        await this.save();
        return this.answers;
    }
    catch(err)
    {
        console.log(err);
    }
}

quesSchema.methods.Like=async function(user){
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

quesSchema.methods.Unlike=async function(user){
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

quesSchema.methods.Likea=async function(id,user){
    try{
        let l,u;
        // console.log(id);
        this.answers=this.answers.map(e => {
            // console.log(e.id);
            if(e.id===id)
            {
                // console.log("hello");
                let f=e.likeusers.indexOf(user) > -1;
                l=e.like;
                u=e.unlike;
                if(f)
                {
                   l=e.like-1;
                   e.like=l;
                   e.likeusers=e.likeusers.filter((val)=>{return val!=user});
                }
                else
                {
                   let f=e.unlikeusers.indexOf(user) > -1;
                   if(f)
                   {
                      u=e.unlike-1;
                      e.unlike=u;
                      e.unlikeusers=e.unlikeusers.filter((val)=>{return val!=user});
                   }
                   l=e.like+1;
                   e.like=l;
                   e.likeusers=[...e.likeusers,user];
                }
            }
            return e;
        });
        // console.log(this.answers);
        await this.save();
        return {likeCount:[l],unlikeCount:[u]};
    }
    catch(err)
    {
        console.log(err);
    }
};

quesSchema.methods.Unlikea=async function(id,user){
    try{
        let l,u;
        // console.log(id);
        this.answers=this.answers.map(e => {
            // console.log(e.id);
            if(e.id===id)
            {
                // console.log("hello");
                let f=e.likeusers.indexOf(user) > -1;
                l=e.like;
                u=e.unlike;
                if(f)
                {
                   l=e.like-1;
                   e.like=l;
                   e.likeusers=e.likeusers.filter((val)=>{return val!=user});
                   u=e.unlike+1;
                   e.unlike=u;
                   e.unlikeusers=[...e.unlikeusers,user];
                }
                else
                {
                   let f=e.unlikeusers.indexOf(user) > -1;
                   if(f)
                   {
                   u=e.unlike-1;
                   e.unlike=u;
                   e.unlikeusers=e.unlikeusers.filter((val)=>{return val!=user});
                   }
                   else
                   {
                   u=e.unlike+1;
                   e.unlike=u;
                   e.unlikeusers=[...e.unlikeusers,user];
                   }
                }
            }
            return e;
        });
        await this.save();
        return {likeCount:[l],unlikeCount:[u]};
    }
    catch(err)
    {
        console.log(err);
    }
};

const Ques=mongoose.model("question",quesSchema);

module.exports=Ques;