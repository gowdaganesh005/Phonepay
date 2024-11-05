import { Router } from "express";
import { UserSignInZodSchema, UserSignUpZodSchema, UserUpdateZodSchema } from "../zod/types.js";
import {Account, User} from "../db/models.db.js"
import { DbConnect } from "../db/db.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { authMiddleware } from "../middlewares/user.auth.js";

const userRouter=Router();

DbConnect();


userRouter.post('/signup',async (req,res)=>{
    
    const userdata={
     email:req.body.email,
     phoneNumber:req.body.phoneNumber,
     password:req.body.password,
     fullname:req.body.fullname,
    }

    try {
        UserSignUpZodSchema.parse(userdata)
    } catch (error) {
        // console.log(error)
        res.json({message:error.errors[0].message})
        return
    }
    userdata.password=await bcrypt.hash(userdata.password,10)
    
    try{
    const response=await User.create(userdata)
    await Account.create({userid:response._id,balance:1+Math.random()*10000})
    if(response){
        res.status(200).json({message:"created the user"})
        return
    }}catch(error){
        
        console.log(error.errorResponse)
        if(error.errorResponse.code==11000){
            res.status(400).json({message:`${Object.keys(error.errorResponse.keyValue)[0]} already exists`})
        }
        else{
        res.status(500).json({message:"Internal error: cannot create the user"})
        }

    }
    

    // try{
    //     User.create(userdata)
    //     res.status(200).json({message:"created the user"})
    //      return

    // }catch(error){
    //     console.log(error)
    // }
    // res.status(500).json({message:"error: cannot create the user"})
})

userRouter.post("/signin",async(req,res)=>{
    const userdata={
        email:req.body.email,
        
        password:req.body.password,
    }

    try{
        UserSignInZodSchema.parse(userdata)
    }catch(error){
        res.status(400).json(error.errors[0].message)
        return
    }

    const user=await User.findOne({email:userdata.email})
    if(user){
        const isValidPassword=await bcrypt.compare(userdata.password,user.password)
        if(isValidPassword){
            const token= jwt.sign({email:user.email,userid:user._id},process.env.JWT_SECRET)
            res.status(200).json({message:"User logged in",
                token:token
            })
            return
        }
        else{
            res.status(401).json({message:"Password is incorrect"})
            return
        }
    }else{
        res.status(401).json({message:"user not found"})
        return
    }

    
    
    
})

userRouter.put("/update",authMiddleware,async (req,res)=>{
    const userdata={
        password:req.body.password,
        fullname:req.body.fullname,
    }
    try{
    UserUpdateZodSchema.parse(userdata)
    }catch(error){
        console.log(error)
    }
    userdata.password=await bcrypt.hash(userdata.password,10)
    console.log(req.email)

    const updatedUser=await User.findOneAndUpdate({email:req.email},{password:userdata.password,
        fullname:userdata.fullname})
        console.log(updatedUser)
    if(updatedUser){
        res.status(200).json({message:"User details updated"})
        return
    }
    else{
        res.status(400).json({message:"User not updated"})
        return
    }
    
    
})

userRouter.get("/bulk",async (req,res)=>{
    const filter=req.query.filter || ""
    const users=await User.find({
        fullname:{
            "$regex":filter
        }
    })

    res.json({
        user: users.map(user=>({
            id:user._id,
            email:user.email,
            fullname:user.fullname
        })
            
        )
    })
})



export default userRouter;