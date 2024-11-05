import Router from "express"
import { authMiddleware } from "../middlewares/user.auth.js"
import { Account } from "../db/models.db.js";
import mongoose from "mongoose";


export const AccountRouter=Router()

AccountRouter.get("/balance",authMiddleware,async (req,res)=>{
    const userid=req.userid;
    const bal=await Account.findOne({userid})
    if(bal){
        res.status(200).json({message:"Balanced Fetched",balance:bal.balance})
        return
    }
    else{
        res.status(500).json({message:"Error fetching the balance"})
        return
    }
    
})

AccountRouter.post("/transfer",authMiddleware,async (req,res)=>{
    
    const from=req.userid

    const to=req.body.to
    const amount=req.body.amount

    try {
        const session=await mongoose.startSession();
        session.startTransaction();
        
        const acc=await Account.findOne({userid:from})
        if(!acc || acc.balance<amount){
            res.status(403).json({message:"Not Sufficient balance"})
            await session.abortTransaction()
        }
    
        const toacc=await Account.findOne({userid:to})
        if(!toacc ){
            res.status(403).json({message:"Invalid account"})
            await session.abortTransaction()
    
        }
        await Account.findOneAndUpdate({userid:from},{ $inc:{ balance:-amount}})
        await Account.findOneAndUpdate({userid:to},{  $inc:{ balance: amount}})
    
        await session.commitTransaction();
        res.status(200).json({message:"Transfer Complete"})
        return
    } catch (error) {
        res.status(400).json({
            message:"Transfer Failed",
            error: error
        })
    }
    
})