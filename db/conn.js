const mongoose=require("mongoose");

const CONNECTION_URL=process.env.CONNECTION_URL;
// console.log(CONNECTION_URL);

mongoose.connect("mongodb+srv://Ag_Girdhar12:lovesanudhar@cluster0.k7nf2.mongodb.net/Forum?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("Database connected"))
.catch((error) => console.log(error));