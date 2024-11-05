import mongoose from "mongoose";

export function DbConnect(){
try {
    mongoose.connect(process.env.DBURL)
    
} catch (error) {
    console.log("Error connecting the database")
    
}
}



