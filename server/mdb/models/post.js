import mongoose from 'mongoose'
const post = new mongoose.Schema({
    name:{type:String ,required:true},
    mail:{type:String,required:true},
    recents:{type:[],required:true},
    chats:{type:{},required:true}
});
const PSchema = mongoose.model('post',post) ;

export default PSchema;