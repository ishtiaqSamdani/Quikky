import express from 'express'
import * as dotenv from 'dotenv'
import post from '../mdb/models/post.js'
dotenv.config();
const router = express.Router();
router.route("/").get(async(req,res)=>{
    try{
        const {name}=req.body;
        const posts =name? await post.find({name:name}): await post.find({})
        res.status(200).json({success:true ,data:posts})
    }catch(e){
    res.status(500).json({success:false,message:'error'})
    }
    })

    router.route("/").post(async(req,res)=>{
        try{
            const {name,mail,chats}=req.body;
        const newPost=await post.create({
           name,
           mail,
           recents:[Math.floor(Math.random()*10000)],
           chats
        })
        res.status(201).json({success:true,data:newPost})
        }
        catch(e){
            res.status(500).json({success:false,message:'errors'})
        }
    });


    router.route("/").put(async(req,res)=>{
        try{
            const {name,reciever,chats,image,emojis}=req.body;
     
            const getCount = (posts,name) =>{
                        let count=0;
                        let board=posts[name]
                        for(const key in board )
                        {
                            if(key[0]=='r' && board[key]["status"]!="seen")
                            {
                                count+=1;
                            }
                        }
            
                        return count;

            }
   

            const setRecents = (recents,name,count) =>{
                 let id=recents.findIndex((ele)=>{return ele.name==name});
                 if(id!=-1)
                 {
                    recents.splice(id,1);
                 }
                 recents.unshift({
                    "name":name,
                    "count":count
                 });
                 return recents;
            }


            const getTimeStamp = () =>{
                let date=new Date()
                let ts=`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} -- ${date.getDate()} / ${date.getMonth()+1} / ${date.getFullYear()}]`
                return ts;
            }

        const posts = await post.find({name:name})

        const posts2 = await post.find({name:reciever})

        if( posts[0]['chats']==undefined)
        {
        posts[0]['chats']={}
       }
    
        if( posts[0]['chats'][reciever]==undefined)
        {
        posts[0]['chats'][reciever]={}
       }

        posts[0]['chats'][reciever]['sent'+getTimeStamp()]={
            "message":{"image":image,"text":chats,"emoji":emojis},
            "status":"sent"
        }


        if( posts2[0]['chats']==undefined)
        {
        posts2[0]['chats']={}
       }

        if( posts2[0]['chats'][name]==undefined)
        {
        posts2[0]['chats'][name]={}
       }
  
       posts2[0]['chats'][name]['recieved'+getTimeStamp()]={
        "message":{"image":image,"text":chats,"emoji":emojis},
        "status":"sent"
    }

    let count1=getCount(posts[0]['chats'],reciever)

    let count2=getCount(posts2[0]['chats'],name)
    
    let recents1=setRecents(posts[0]['recents'],reciever,count1)
 
    let recents2=setRecents(posts2[0]['recents'],name,count2)

        await post.findOneAndUpdate({name:name},{$set:{'chats':posts[0]['chats']}})

        await post.findOneAndUpdate({name:name},{$set:{'recents':recents1}})

        await post.findOneAndUpdate({name:reciever},{$set:{'chats':posts2[0]['chats']}})

        await post.findOneAndUpdate({name:reciever},{$set:{'recents':recents2}})

        
        res.status(201).json({success:true})
        }
        catch(e){
            res.status(500).json({success:false,message:'errors'})
        }
    });
    router.route("/status").post(async(req,res)=>{
     try{
        const {name,sender,status}=req.body;

        const posts= await post.find({name:name})
        
        const posts2=await post.find({name:sender})
       if(status=="seen")
       {
        let id=posts[0]['recents'].findIndex((ele)=>{return ele.name==sender});

        posts[0]['recents'][id]['count']=0;

        await post.findOneAndUpdate({name:name},{$set:{'recents':posts[0]['recents']}})
       }
        const setStatus = (posts1,posts2,sender,name,status) =>{
              
         for(const key in posts1[0]['chats'][sender]){
             if(key[0]=='r')
             {
                if(status=='recieved' && posts1[0]['chats'][sender][key]['status']=="sent")
                  { 
                    posts1[0]['chats'][sender][key]['status']="recieved";
                  }
                else if(status=="seen" && posts1[0]['chats'][sender][key]['status']!="seen")
                { 
                      posts1[0]['chats'][sender][key]['status']="seen";
                  }
             }
         }
         for(const key in posts2[0]['chats'][name]){
            if(key[0]=='s')
             {
                if(status=='recieved' && posts2[0]['chats'][name][key]['status']=="sent")
                  { 
                    posts2[0]['chats'][name][key]['status']="recieved";
                  }
                else if(status=="seen" && posts2[0]['chats'][name][key]['status']!="seen")
                { 
                      posts2[0]['chats'][name][key]['status']="seen";
                  }
             }
         }
        return [posts1,posts2];
 
        }
        let postn=setStatus(posts,posts2,sender,name,status)
   
        await post.findOneAndUpdate({name:name},{$set:{'chats':postn[0][0]['chats']}})
         
         await post.findOneAndUpdate({name:sender},{$set:{'chats':postn[1][0]['chats']}})

         res.status(201).json({success:true})
     }
     catch(err){
      
        res.status(500).json({success:false,message:'errors'})
        
     }
    })

    

    export default router;