var mysql = require('mysql');
var setting = require('../setting');

var dbPool = mysql.createPool({
    connectionLimit : 20,
    queueLimit : 50,
    host: setting.host,
    user: setting.user,
    password: setting.password,
    database : setting.db,
    charset : 'utf8mb4',
    port: '3306'});

dbPool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

module.exports = dbPool;
