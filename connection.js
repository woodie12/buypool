const mysql = require('mysql');

class Connection {

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit : 100,
      host     : '192.17.90.133',
      user     : 'webuypool_new',
      password : 'adminadmin',
      database : 'webuypool_general',
    });
  };

  acquire(callback) {
    this.pool.getConnection(function(err, connection) {
      if (err) throw err;
      callback(err, connection);
    });
  };
}

module.exports = new Connection();

