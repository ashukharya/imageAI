const PORT = process.env.PORT || 8000
const express = require('express')
const cors = require('cors')
// const ejs = require("ejs")
const app = express()
app.use(cors())
app.use(express.json())
// app.set('view engine', 'ejs');
require('dotenv').config()
const fs=require('fs')
const multer=require('multer')
const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: process.env.API_KEY,
    }); 
const openai = new OpenAIApi(configuration)
const storage=multer.diskStorage({
    // destination:(req,file,cb)=>{  // to save in local storage
    //     cb(null,'public')
    // },
    filename:(req,file,cb)=>{
        console.log('file',file)
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload=multer({storage:storage}).single('file')
let filePath
app.post('/images', async (req, res) => {
    try{
        const response = await openai.createImage({
            prompt: req.body.message,
            n: 4,
            size: "512x512",
        })
        //console.log(response.data.data)
        res.send(response.data.data)
    }
    catch(error){
        console.log("Too many requests...")
        res.send("err")
    }
})

app.post("/upload",(req,res)=>{
    upload(req,res,(err)=>{
        if(err instanceof multer.MulterError){
            return res.status(500).json(err)
        }else if(err){
            return res.status(500).json(err)
        }
        filePath=req.file.path
    })
})

app.post('/variations', async(req,res)=>{
    try{
        const response = await openai.createImageVariation(
            fs.createReadStream(filePath),
            4,
            "512x512"
          )
          res.send(response.data.data)
    }catch(error){
        console.log("Too many requests...")
        res.send("err")
    }
})

app.listen(PORT, () => console.log('Server of imageAI...'))