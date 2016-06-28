var mysql = require('mysql');
var dbPool = mysql.createPool({
    connectionLimit : 10,
    host: 'mysql.cl5zxklrqlb3.ap-northeast-1.rds.amazonaws.com',
    user: 'wewriter',
    password: '64156415',
    database : 'wewriter',
    charset : 'utf8',
    port: '3306'});

dbPool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

module.exports = dbPool;
