const express=require('express');
const Task=require('../models/Task.model');
const User=require('../models/User.model');
const auth=require('../middleware/authMiddleware');

const router=express.Router();

router.get('/',auth,async(req,res)=>{
    try{
    const tasks=await Task.find({userId:req.user.userId});
    res.json(tasks);
    }catch(err){res.status(500).json({error:'internal server error'})};

})


router.post('/',auth,async(req,res)=>{
    try{
        const newTask=new Task({
            task:req.body.task,completed:false,userId:req.user.userId
        })
       // console.log(req.user.userId);
        //console.log(newTask+" 33");
        await newTask.save();

        await User.findByIdAndUpdate(
            req.user.userId,
            { $push: { tasks: savedTask._id } }
          );
      
        res.status(200).json("added");
    }
    catch(err){res.status(200).json({error:'internal server error'})};
})


router.put('/:id',auth,async(req,res)=>{

    try{
        const updated=await Task.findOneAndUpdate(
          {_id:req.params.id,userId:req.user.userId},
          req.body,{new:true}
        );
        if(!updated) return res.status(400).json({error:'Task not found'});
        //console.log(updated+" 455"+" **"+req.user.userId)
        res.json(updated);
    }
    catch(err){res.status(500).json("error")};
})

router.delete('/:id',auth,async(req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,userId:req.user.userId});
        if(!task) return res.status(200).json({error:'Task not found'});

        await User.findByIdAndUpdate(req.user.userId, {
            $pull: { tasks: task._id }
          });
        res.json({message:'Task deleted'});
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})
module.exports=router