'use strict';
const path = require('node:path');
const express = require('express');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const roomsRouter = require('./routes/rooms');
function createApp(db) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.get('/api/health', (_req,res) => res.json({ok:true, project:'CSRBS'}));
  app.use('/api/auth',registerRouter(db));
  app.use('/api/auth',loginRouter(db));
  app.use('/api/rooms',roomsRouter(db));
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({error:'Invalid JSON'});
    console.error(err);
    return res.status(500).json({error:'Internal server error'});
  });
  return app;
}
module.exports = { createApp };
