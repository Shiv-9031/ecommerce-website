import mongoose from "mongoose";

const _database=()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>console.log(`database is connected:${data.connection.host}`)).catch((err)=>{console.log(err)});
}

export default _database;