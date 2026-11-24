require('dotenv').config({path:'.env'})
const express = require('express')
const fileUp = require('express-fileupload')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors({
    origin:'localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(fileUp())
app.use('/uploads',express.static(path.join(__dirname,'./uplaods')))

app.use((req,res)=> res.status({message:"Route not Found"}))
app.listen(3001,()=>{
    console.log("Server Running on Port 3001");
    
})