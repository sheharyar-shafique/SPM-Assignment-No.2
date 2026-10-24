'use strict';
const express=require('express');
module.exports=function registerRouter() {
  const router=express.Router();
  router.post('/register',(_req,res)=>res.status(501).json({error:'CSRBS-7 registration pending'}));
  return router;
};
