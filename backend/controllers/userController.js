const Errorhandler=require("../utils/errorhandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail.js");
const crypto=require("crypto");

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

    const message=`Your password reset token is:-\n \n ${resetPasswordUrl} \n\n If you have not requested this mail then please then, ignore it`;

    try{

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
    }
    catch(error){
        user.getResetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({ validateBeforeSave:false});

        return next(new Errorhandler(error.message,500));
    }
});

//Reset Password
exports.resetPassword=catchAsyncError(async(req,res,next)=>{


    //creating token hash
   const reserPasswordToken= crypto
    .createHash("sha256") //sha256 is algo which is convert number into hash
    .update(req.params.token)
    .digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now()},

    });
    if(!user){
        return next(new Errorhandler("Reset Password Token is invalid or has been expired",400));

    }
    if(req.body.password!==req.body.confirmPassword)
    {
        return next(new Errorhandler("Password does not password",400));

    }
    user.password=req.body.password;
    user.reserPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

});


//Get user Detail

exports.getUserDetails=catchAsyncError(async(req,res,next)=>{


    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    });

    
});

//update user password 

exports.updatePassword=catchAsyncError(async(req,res,next)=>{


    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new Errorhandler("Old password is incorrect",400));
    }

    if(req.body.newPassword!==req.body.confirmPassword)
    {
        return next(new Errorhandler("password does not match",400));
    }
        user.password=rq.body.newPassword;
        await user.save()
    
        sendToken(user,200,res);
});


//update user profile

exports.updateProfile=catchAsyncError(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,
    {
        new: true,
        runValidators:true,
        useFindAndModify:false,
    });
    
    //we will add cloudinary later
       res.status(200).json({
        success:true,
       });
});



       //Get all users
       exports.getAllUser=catchAsyncError(async(req,res,next)=>{
        const users=await User.find();
        res.status(200).json({
            success:true,
            users
        });
       });


       //Get single user (admin)
       exports.getSingleUser=catchAsyncError(async(req,res,next)=>{
        const user=await User.findById(req.params.id);
        
        if(!user){
            return next(new 
                Errorhandler (`User does not exist with Id:${req.params.id}`)
                );
        }
        
        res.status(200).json({
            success:true,
            user
        });
       });


       //update user Role --Admin

exports.updateProfile=catchAsyncError(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:read.body.role
    }

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,
    {
        new: true,
        runValidators:true,
        useFindAndModify:false,
    });
    
    //we will add cloudinary later
       res.status(200).json({
        success:true,
       });
});


exports.updateUserRole=catchAsyncError(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user= await User.findByIdAndUpdate(req.params.id,newUserData,
    {
        new: true,
        runValidators:true,
        useFindAndModify:false,
    });
    
    //we will add cloudinary later
       res.status(200).json({
        success:true,
       });
});


//Delete user --Admin

exports.deleteuser=catchAsyncError(async(req,res,next)=>{

  const user=await User.findById(req.params.id);

  if(!user)
  {
    return next(
        new Errorhandler(`User does not exist with Id:${req.params.id}`)
    );
  }

  await user.remove();
  

    
    //we will add cloudinary later
       res.status(200).json({
        success:true,
        message:"User Deleted successfully"
       });
});