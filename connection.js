const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'webuypool_admin',
    password : 'adminadmin',
    database : 'webuypool_general'
});

connection.connect();
console.log("mysql connected");

module.exports = connection;