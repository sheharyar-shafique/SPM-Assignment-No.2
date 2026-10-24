'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createDatabase}=require('../server/db');
const {createApp}=require('../server/app');
const {hashPassword}=require('../server/lib/security');
test('CSRBS-8 logs in, reads session, logs out, and blocks invalid credentials',async()=>{
  const db=createDatabase(':memory:');
  db.prepare('INSERT INTO users (full_name,email,password_hash) VALUES (?,?,?)').run('Student One','student@example.edu',hashPassword('GoodPassword123'));
  const server=createApp(db).listen(0);
  const root='http://127.0.0.1:'+server.address().port;
  const post=input=>fetch(root+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  try{
    assert.equal((await post({email:'student@example.edu',password:'wrong'})).status,401);
    const res=await post({email:'STUDENT@example.edu',password:'GoodPassword123'});
    assert.equal(res.status,200);
    assert.equal((await res.json()).user.name,'Student One');
    const cookie=res.headers.get('set-cookie');
    assert.ok(cookie.includes('HttpOnly'));
    const authCookie=cookie.split(';')[0];
    assert.equal((await fetch(root+'/api/auth/me',{headers:{cookie:authCookie}})).status,200);
    assert.equal((await fetch(root+'/api/auth/logout',{method:'POST',headers:{cookie:authCookie}})).status,200);
    assert.equal((await fetch(root+'/api/auth/me',{headers:{cookie:authCookie}})).status,401);
  }finally{await new Promise(resolve=>server.close(resolve));db.close();}
});
