const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const User=require('../models/User.model');

const router=express.Router();

router.post('/register',async(req,res)=>{
    const {username,password}=req.body;

    try{
        const existing=await User.findOne({username})
        if(existing) return res.status(400).json({error:'Username already exists'});
        const hashed=await bcrypt.hash(password,10);
        const user=new User({username,password:hashed});
        //console.log(user+" 16")
        await user.save();
        res.status(200).json({message:'user registered'});
    }
    catch(err){res.status(500).json({error:'Server error'})};
});


router.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    try{

            const user=await User.findOne({username});
            if(!user) return res.status(400).json({error:'Invalid credentials'});
            const isMatch =await bcrypt.compare(password,user.password);
            if(!isMatch) return res.status(400).json({error:'Invalid Credentials'});

            const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
            res.json({token});

    }catch(err){res.status(400).json({message:'internal server error'})};
})

module.exports=router;