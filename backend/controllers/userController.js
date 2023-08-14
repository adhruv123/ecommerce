const Errorhandler=require("../utils/errorhandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail.js");

//Register a user 
exports.registerUser=catchAsyncError(async(req,res,next)=>{

    const {name,email,password}=req.body;

    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl",
        },
    });

  sendToken(user,201,res);
});


//Login User
exports.loginUser=catchAsyncError(async(req,res,next)=>{

    const {email,password}=req.body
   //checking if user given  password and email both

   if(!email || !password){
    return next(new Errorhandler("Please Enter Email & password",400));

   }
   const user= await User.findOne({email}).select("+password");
   if(!user){
      return next(new Errorhandler("Invalid  email or password",400));

   }
   const isPasswordMatched=await user.comparePassword(password);

   if(!isPasswordMatched){
    return next(new Errorhandler("Invalid email or password",401));
   }

   sendToken(user,200,res);
});




//Logout User

exports.logout=catchAsyncError(async(req,res,next)=>{

        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true,
        });

        res.status(200).json({
            success:true,
            message:"Logged Out",
        });

});



//Forgot Password

exports.forgotPassword=catchAsyncError(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new Errorhandler("user not found",404));

    }
    //Get ResetPassword Token
   const resetToken= user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`http://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message=`Your password reset token is:-\n \n ${resetPasswordUrl} \n\n If you have not requested this mail then please then, ignore it`

    try{

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message
        })
    }catch(error){
        user.getResetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
    }
})