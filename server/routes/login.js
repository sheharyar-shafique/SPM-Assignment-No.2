'use strict';
const express=require('express');
const {verifyPassword,startSession,currentUser,clearSession}=require('../lib/security');
module.exports=function loginRouter(db){
  const router=express.Router();
  router.post('/login',(req,res)=>{
    const {email,password}=req.body||{};
    const mail=typeof email==='string'?email.trim().toLowerCase():'';
    if(!mail||typeof password!=='string') return res.status(400).json({error:'Email and password are required.'});
    const user=db.prepare('SELECT id,full_name,email,password_hash FROM users WHERE email=?').get(mail);
    if(!user||!verifyPassword(password,user.password_hash)) return res.status(401).json({error:'Incorrect email or password.'});
    startSession(db,user.id,res);
    return res.json({user:{id:user.id,name:user.full_name,email:user.email}});
  });
  router.get('/me',(req,res)=>{
    const user=currentUser(db,req);
    if(!user) return res.status(401).json({error:'Not logged in.'});
    return res.json({user:{id:user.id,name:user.full_name,email:user.email}});
  });
  router.post('/logout',(req,res)=>{
    clearSession(db,req,res);
    return res.json({message:'Logged out.'});
  });
  return router;
};
