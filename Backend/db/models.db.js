import mongoose from "mongoose";


const UserSchema=new mongoose.Schema({
    email:{
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        minLength: 5,
        maxLength: 30,
        unique: true,
    },
    phoneNumber:{
        type:Number,
        required: true,
        trim: true,
        min: 1000000000,
        max: 9999999999,
        unique: true
    },
    password:{
        type:String,
        minLength: 6,
        required: true,

    },
    fullname:{
        type:String,
        minLength:3,
        required:true ,
        trim: true,

    }
})
export const User=new mongoose.model("User",UserSchema)


const AccountSchema=new mongoose.Schema({
    userid:{
    type:mongoose.Types.ObjectId,
    ref:User,
    required:true
    },
    balance:{
        type:Number,
        required: true
    }
})


export const Account=new mongoose.model("Account",AccountSchema)

