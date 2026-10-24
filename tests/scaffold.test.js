'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createDatabase}=require('../server/db');
const {createApp}=require('../server/app');
test('CSRBS scaffolding provides health check, seeded rooms, and pending endpoints',async()=>{
  const db=createDatabase(':memory:');
  const server=createApp(db).listen(0);
  const url='http://127.0.0.1:'+server.address().port;
  try {
    const response=await fetch(url+'/api/health');
    assert.equal(response.status,200);
    assert.deepEqual(await response.json(),{ok:true,project:'CSRBS'});
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM rooms').get().n,4);
    assert.equal((await fetch(url+'/api/rooms')).status,501);
  } finally {await new Promise(resolve=>server.close(resolve));db.close();}
});
