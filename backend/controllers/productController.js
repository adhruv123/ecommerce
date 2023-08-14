const Product=require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeature");

//Create Product --Admin
exports.createProduct=catchAsyncError(async(req,res,next)=>{
   
    req.body.user=req.user.id;
     
   
    
    const product=await Product.create(req.body);
    
    res.status(201).json({
        success:true,
        product
    })
});

//Get Product Detail
exports.getProductDetails=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id)

    if(!product){
        return next(new Errorhandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        product
    });
});

//Get All Product
exports.getAllProducts= catchAsyncError(async(req,res)=>{
   
    
    const resultPerPage=5;
    const productCount=await Product.countDocuments()
   const apifeature= new ApiFeatures(Product.find(),req.query)
   .search()
   .filter()
   .pagination(resultPerPage);
    const products=await apifeature.query;
    
    res.status(200).json({
        success:true,
        products,
        productCount,
    });
});

//Update Product --Admin
exports.updateProduct=catchAsyncError(async(req,res,next)=>{

    let product=await Product.findById(req.param.id);
    if(!product)({
        success:false,
        message:"Product not found"
    })
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
});


//Delete Product

exports.deleteProduct= catchAsyncError(async(req,res,next)=>{
   
    const product = await Product.findByIdAndDelete(req.params.id);

    // if(!product){
    //     return res.status(500).json({
    //         success:false,
    //         message:"Product not found"
    //     })
    // }

    res.status(200).json({
        success:true,
        message:"Product Delete Successfukky"
    });

});






