import mongoose from "mongoose";

async function ConnectDB(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("database connected");
    })
}

export default ConnectDB