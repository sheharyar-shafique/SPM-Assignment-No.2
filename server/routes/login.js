'use strict';
const express=require('express');
module.exports=function loginRouter() {
  const router=express.Router();
  router.post('/login',(_req,res)=>res.status(501).json({error:'CSRBS-8 login pending'}));
  router.get('/me',(_req,res)=>res.status(501).json({error:'CSRBS-8 session pending'}));
  router.post('/logout',(_req,res)=>res.status(501).json({error:'CSRBS-8 logout pending'}));
  return router;
};
