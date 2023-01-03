import app from "./app.mjs";
import {config} from'dotenv';
import _database from './databaseConnection/databaseConn.mjs'

//handling uncaught err

process.on("uncaughtException",(err)=>
{
    console.log(`error : ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Errror");
    process.exit(1);
})
//config

config({path:'./config/config.env'}); 

//connection to database
_database();

const Server=app.listen(process.env.PORT,()=>{console.log(`server is running on port no.${process.env.PORT}`)});
  
//Unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Error");
    Server.close(()=>{process.exit(1)});
})
