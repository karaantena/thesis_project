const mysql = require('mysql');

const poolConfig = {
  user: 'root',
  password: 'password',
  database: 'vista_db',
}


if (process.env.NODE_ENV == "production") {
  poolConfig.socketPath = process.env.VISTA_DB_SOCKET;
} else {
  poolConfig.host = "127.0.0.1";
}


const pool = mysql.createPool(poolConfig);



function testConnection() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');

    connection.release();
  });
}

module.exports = {
  pool,
  testConnection,
};
