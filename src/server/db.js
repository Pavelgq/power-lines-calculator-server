const Pool = require('pg').Pool;

const dbConfig = require('../config/db-config');

const pool = new Pool(dbConfig);


module.exports = pool;