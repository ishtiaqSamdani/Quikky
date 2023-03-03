//authentication routes for the quikky application -----------------------------------------------------------

import express from 'express'
import * as dotenv from 'dotenv'
import user from '../mdb/models/user.js'
import bcrypt from "bcrypt";
import bodyParser from 'body-parser';

dotenv.config();
express().use(bodyParser);
const router = express.Router();



//signup which takes the request in json format which contains name, email,password, profile image .....----------------------

router.route('/signup').post(async (req,res)=>{

   try{
        const nameCheck=await user.find({name:req.body.name})
        const mailCheck=await user.find({mail:req.body.mail})
        if(nameCheck.length!=0){
         
            res.status(400).json({"message":"username already exsists"})
        }
       else if(mailCheck.length!=0)
        {
    
            res.status(400).json({"message":"mail is already taken"})
        }
        
      else{
        const shpassword=await bcrypt.hash(req.body.password,10);
          const newUser = await user.create({
           name:req.body.name,
            status:"online",
            profileImage:req.body.profileImage,
            mail:req.body.mail,
            password:shpassword,
        })
        res.status(200).json({
            "message":"successfully created account",
            "data":newUser
          })
         }
      }
  
   catch(err){
    res.status(500).json({"message":"signup failed"})
   }
})




//login route which takes the username and the password and validates the gives response accordingly---------------------------



router.route('/login').post(async (req,res)=>{
    try{
     const {mail,password}=req.body
     const account=await user.find({mail:mail})
     if(account.length==0)
     {
         res.status(400).json({"message":"invalid email"})
     }
     
   else if(await bcrypt.compare(password,account[0].password)){
    account[0]['status']="online";
     res.status(200).json({
         "message":`logged in as ${account[0]["name"]}`
       })
      }
      else{
        res.status(400).json({
            "message":"wrong password"
          })
      }
    }
    catch(err){
     res.status(500).json({"message":"login failed"})
    }
 })




//logout route which takes the name and sets the state of status to offline ------------------------------------------------------------




 router.route('/logout').post(async (req,res)=>{
  try{
   const {name}=req.body
   const account=await user.find({name:name})
  account[0]['status']="offline";
  await user.findOneAndUpdate(({name:name},{$set:{'status':account[0]['status']}}))
   res.status(200).json({
       "message":`logged out as ${account[0]["name"]}`
     })
  }
  catch(err){
   res.status(500).json({"message":"logout failed"})
  }
})




//changedp route is used to change the display picture of the certain user ....------------------------------------------------------




router.route('/changedp').post(async (req,res)=>{

   try{
       const {name,profileImage}=req.body
         await user.findOneAndUpdate(({name:name},{$set:{'profileImage':profileImage}}))
         const nameCheck=await user.find({name:name})
        res.status(200).json({
            "message":"successfully done",
            "data":nameCheck
          })
         }
   catch(err){
    res.status(500).json({"message":"signup failed"})
   }
})



//users route is used to know fetch all the users in the quikky database ----------------------------------------------------



router.route('/users').get(async (req,res)=>{
  try{
    const users=await user.find({}) 
    res.json(users)
  }
  catch(err){
    res.status(500).json({"status":"failed"})
  }
})
export default router;