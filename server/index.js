import express from 'express'
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv'
import cors from 'cors'
import conn from './mdb/connect.js';
import  chatRoutes from './routes/chatRoutes.js'
import authRoutes from './routes/authRoutes.js'
dotenv.config();

const app=express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit:100000,limit:"500mb"}));
app.use('/api/v1/chats',chatRoutes);
app.use('/auth',authRoutes);
const start = async () => {
    try{
        conn(process.env.MONGODB_URL)
        app.get('/',async(req,res)=>{
            res.send('this is quikky')
        });
        app.listen('8080')
    }
    catch(err){
        console.log("app failed")
    }
}

start();