
const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");  //decript the password
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({
    
    role:{
        type:String,
        default:"user",
    },
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"name cannot exceed 30 characters"],
        minlength:[4,"name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validator:[validator.isEmail,"please enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        maxLength:[8,"password should be greater than 8 characters"],
        select:false,
    },
  
    avatar:{
        
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
               
                
                resetPasswordToken: String,
                resetPasswordExpire: Date,
                
    }
});


userSchema.pre("save",async function(next){
     
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});


//JWT Token only user can login
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{    //this method is used to expired token so any one can not log in
        expiresIn:process.env.JWT_EXPIRE,
    });
};

//Compare Password
userSchema.methods.comparePassword=async function(enteredPassword)
{

    return await bcrypt.compare(enteredPassword,this.password);
}


//Generaating password to reset token
userSchema.methods.getResetPasswordToken=function()
{
    //Generating Token
    const resetToken=crypto.randomBytes(20).toString("hex");

    //Hashing and adding reserPasswordToken to userSchema
    this.resetPasswordToken=crypto
    .createHash("sha256") //sha256 is algo which is convert number into hash
    .update(resetToken)
    .digest("hex");

    this.resetPasswordToken=Date.now()+15*60*1000;
    return resetToken;


};




module.exports=mongoose.model("user",userSchema);


