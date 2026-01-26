// import { error } from "console";
// import mongoose from "mongoose";

// const MONGODB_URL=process.env.MONGODB_URL!;
//  if (!MONGODB_URL){
//     throw new Error("Please define mongo_uri in env variables")
//  }
// let cached=global.mongoose;
// if (!cached){
//     cached=global.mongoose={
//         conn:null,promise:null
//     }
// }

// export async function ConnectToDatabase(){
//     if (cached.conn){
//         return cached.conn
//     }
//     //agr connection ni ha,tu connection ki request ab bhj du
//     if (!cached.promise){
//         const options={
//             bufferCommands:true,maxPoolSize:10
//         }
//         mongoose.connect(MONGODB_URL,options  ).then(()=>{
//         mongoose.connection
//     })
//     }
//     try{
// cached.conn=await  cached.promise
//     }catch(err){
// cached.promise=null;
// throw error;
//     }
//     return cached.conn;
// }

import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in env variables");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function ConnectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        maxPoolSize: 10,
        bufferCommands: false, // ✅ important
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
