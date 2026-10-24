'use strict';
const express=require('express');
module.exports=function roomsRouter(){
  const router=express.Router();
  router.get('/',(_req,res)=>res.status(501).json({error:'CSRBS-9 room search pending'}));
  router.get('/:id',(_req,res)=>res.status(501).json({error:'CSRBS-11 room details pending'}));
  return router;
};
