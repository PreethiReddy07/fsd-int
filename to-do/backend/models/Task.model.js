const mongoose=require('mongoose')

const taskSchema=new mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        require:true
    }
});

const taskModel=mongoose.model('Task',taskSchema);
module.exports=taskModel;

