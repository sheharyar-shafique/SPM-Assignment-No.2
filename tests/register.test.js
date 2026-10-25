'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createDatabase}=require('../server/db');
const {createApp}=require('../server/app');
test('CSRBS-7 registration saves password hashes, rejects invalid and duplicate emails',async()=>{
  const db=createDatabase(':memory:');
  const server=createApp(db).listen(0);
  const url='http://127.0.0.1:'+server.address().port+'/api/auth/register';
  const post=data=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  try{
    const input={name:'Student One',email:'Student@campus.edu',password:'GoodPassword123'};
    const res=await post(input);
    assert.equal(res.status,201);
    const user=await res.json();
    assert.equal(user.email,'student@campus.edu');
    assert.equal(user.name,'Student One');
    assert.equal('password' in user,false);
    const row=db.prepare('SELECT password_hash FROM users WHERE email=?').get('student@campus.edu');
    assert.ok(row.password_hash && !row.password_hash.includes(input.password));
    assert.equal((await post(input)).status,409);
    assert.equal((await post({...input,email:'not-an-email'})).status,400);
    assert.equal((await post({...input,password:'123'})).status,400);
  }finally{await new Promise(resolve=>server.close(resolve));db.close();}
});
