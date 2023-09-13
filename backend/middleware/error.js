const Errorhandler=require("../utils/errorhandler")

module.exports=(err,req,res,next)=>{

    err.statusCode=err.statusCode || 500;
    err.message=err.message||"Internal Server Error";

//Wrong Mongodb Id error
if(err.name==="CastError"){
    const message=`Resource not found.Invalid: ${err.path}`;
    err=new Errorhandler(message,400);
}

//Mongoose duplicate key error
if(err.code===1000)
{
    const message=`Duplicate ${Object.keys(err.keyvalue)} Entered`;
    err=new Errorhandler(message,400);
}

//Wrong jwt error
if(err.code==="JsonWebTokenError")
{
    const message=`Json web Token is invalid,try again`;
    err=new Errorhandler(message,400);
}

//JWT EXPIRE  error
if(err.code==="TokenExpiredError")
{
    const message=`Json web Token is Expired,try again`;
    err=new Errorhandler(message,400);
}

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};