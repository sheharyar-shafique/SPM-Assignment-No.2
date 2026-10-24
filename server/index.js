'use strict';
const path = require('node:path');
const { createDatabase } = require('./db');
const { createApp } = require('./app');
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'csrbs.sqlite');
const db = createDatabase(dbPath);
const port = Number(process.env.PORT) || 3000;
createApp(db).listen(port, () => console.log('CSRBS running at http://localhost:' + port));
