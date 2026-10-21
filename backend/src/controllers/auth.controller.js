const userModel=require("../models/user.model")
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")

async function registerUser(req,res){
    try{
        const {username,email,password}=req.body

        const userAlreadyExist= await userModel.findOne({email})

        if(userAlreadyExist){
           return res.status(409).json({
            message:"User Already Exists"
           })
        }
        
        const hashedpass = await bcrypt.hash(password,10)
        //create new user

        const user=await userModel.create({
           username,email,
           password:hashedpass
         })

         return res.status(201).json({
            message:"User Registered Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
         });
    }
    catch(err){
       return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function loginUser(req,res){
   try{
        const {email,password}=req.body

        const user= await userModel.findOne({email})

        if(!user){
           return res.status(401).json({
            message:"Invalid Email or Password"
           })
        }
        
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token=jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
});

         return res.status(201).json({
            message:"Login Successfull",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
         });
    }
    catch(err){
       console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports={registerUser,loginUser}