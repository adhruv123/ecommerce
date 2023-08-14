const app=require("./app");

const dotenv=require("dotenv");
const connectDatabase=require("./config/database")


//Handling uncaught Exception
process.on("uncaughtException",(err)=>{
    conslole.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`)

    server.close(()=>{
        process.exit(1);
    });
});

//Config
dotenv.config({path:"backend/config/config.env"});


//Connecting to database
connectDatabase();




app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})



//unhandled promise rejection meanss if server crash for some reasons like change the port,name so it will handle the exception
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to  unhandled promise Rejection`);

    server.close(()=>{
        process.exit(1);
    });
});