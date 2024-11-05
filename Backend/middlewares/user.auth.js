import jwt from 'jsonwebtoken'

export const  authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ") ){
        res.status(403).json({message:"Unauthorized Access "})
        return
    }
    const authToken=authHeader.split(' ')[1]
    console.log(authToken)
    const response=jwt.verify(authToken,process.env.JWT_SECRET)
    if(!response){
        res.status(403).json({message:"Unauthorized Access"})
        return
    }
    const decoded=jwt.decode(authToken)
    console.log(decoded)
    req.email=decoded.email
    req.userid=decoded.userid
    next();
}