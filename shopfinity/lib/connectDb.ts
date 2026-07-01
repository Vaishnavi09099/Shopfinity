import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URI 

if(!mongodbUrl){
    throw new Error("MONGODB_URI is not defined in environment variables");
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn:null,promise:null}

}

const connectDb = async ()=>{
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise = mongoose.connect(mongodbUrl).then((conn)=>{
            return conn.connection;
        })
    }
    try{
        const conn = await cached.promise
        return conn;
    }catch(err){
        console.error("Error connecting to MongoDB:", err);
     
    }
}

export default connectDb;