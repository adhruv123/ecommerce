const Errorhandler = require("../utils/errorhandler");
const catchAsyncErrors=require("./catchAsyncError");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
   if(!token){
    return next(new Errorhandler("Please Login to access this resource",401));
   }

   const decodedData=jwt.verify(token,process.env.JWT_SECRET);

   req.user=await User.findById(decodedData.id);
   next();
});

exports.authorizeRoles=(...role)=>{

    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(
            new Errorhandler(
                `Role: ${req.user.role} is not allowed to acess this resource`,
                 403
            )
            );

        }
        next();
    

    };
};