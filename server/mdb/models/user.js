import mongoose from 'mongoose'
const user = new mongoose.Schema({
    name:{type:String ,required:true},
    status:{type:String,required:true},
    profileImage:{type:String,required:true},
    mail:{type:String,required:true},
    password:{type:String,required:true}
});
const USchema = mongoose.model('user',user) ;

export default USchema;