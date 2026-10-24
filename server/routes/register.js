'use strict';
const express=require('express');
const {hashPassword}=require('../lib/security');
module.exports=function registerRouter(db){
  const router=express.Router();
  router.post('/register',(req,res)=>{
    const {name,email,password}=req.body||{};
    const fullName=typeof name==='string'?name.trim():'';
    const mail=typeof email==='string'?email.trim().toLowerCase():'';
    if(fullName.length<2||fullName.length>100) return res.status(400).json({error:'Name must be 2–100 characters.'});
    if(mail.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return res.status(400).json({error:'Enter a valid email.'});
    if(typeof password!=='string'||password.length<8||password.length>128) return res.status(400).json({error:'Password must be 8–128 characters.'});
    if(db.prepare('SELECT id FROM users WHERE email=?').get(mail)) return res.status(409).json({error:'Account already exists.'});
    try {
      const result=db.prepare('INSERT INTO users (full_name,email,password_hash) VALUES (?,?,?)').run(fullName,mail,hashPassword(password));
      return res.status(201).json({id:Number(result.lastInsertRowid),name:fullName,email:mail});
    } catch(err) {
      if(String(err.code||'').includes('CONSTRAINT')) return res.status(409).json({error:'Account already exists.'});
      throw err;
    }
  });
  return router;
};
