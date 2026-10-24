'use strict';
const { scryptSync, randomBytes, createHash, timingSafeEqual } = require('node:crypto');
const MAX_AGE=60*60*24;
function hashPassword(password) {
  const salt=randomBytes(16).toString('hex');
  return salt+':'+scryptSync(password,salt,64).toString('hex');
}
function verifyPassword(password,stored) {
  if (typeof stored!=='string') return false;
  const parts=stored.split(':');
  if (parts.length!==2 || !/^[0-9a-f]{32}$/.test(parts[0]) || !/^[0-9a-f]{128}$/.test(parts[1])) return false;
  const actual=scryptSync(password,parts[0],64);
  return timingSafeEqual(actual,Buffer.from(parts[1],'hex'));
}
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function startSession(db,userId,res) {
  const token=randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash,user_id,expires_at) VALUES (?,?,?)')
    .run(sha256(token),userId,Math.floor(Date.now()/1000)+MAX_AGE);
  const secure=process.env.NODE_ENV==='production' ? '; Secure' : '';
  res.setHeader('Set-Cookie','csrbs_session='+token+'; HttpOnly; SameSite=Lax; Path=/; Max-Age='+MAX_AGE+secure);
}
function sessionToken(req) {
  const match=(req.headers.cookie||'').match(/(?:^|;\s*)csrbs_session=([0-9a-f]{64})(?:;|$)/);
  return match ? match[1] : null;
}
function currentUser(db,req) {
  const token=sessionToken(req);
  if (!token) return null;
  return db.prepare('SELECT users.id,users.full_name,users.email FROM sessions JOIN users ON users.id=sessions.user_id WHERE token_hash=? AND expires_at>?')
    .get(sha256(token),Math.floor(Date.now()/1000)) || null;
}
function clearSession(db,req,res) {
  const token=sessionToken(req);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(sha256(token));
  res.setHeader('Set-Cookie','csrbs_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
}
module.exports={hashPassword,verifyPassword,startSession,currentUser,clearSession};
