const express= require("express")
const connection = require("./database/connect.js")
const cors =require("cors")

connection()

const app= express()
const port = process.env.PORT||4100

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const UserRoutes=require("./routes/userRouter.js")

app.use("/api/user",UserRoutes)

app.listen(port,()=>{
    console.log(`El puerto activo es  ${port}`);
    
})