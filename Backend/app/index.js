import express from 'express'
import 'dotenv/config.js'
import { mainRouter } from '../routes/index.routes.js'


const app=express()
const PORT=process.env.PORT
app.use(express.json())

app.use("/api/v1",mainRouter)


app.listen(PORT,()=>{
    console.log("Server listening on the Port :",PORT)
})

