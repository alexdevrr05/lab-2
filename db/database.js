const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'laboratorio',
});

function executeQuery(query, callback) {
  connection.connect((error) => {
    if (error) {
      callback(error);
    } else {
      connection.query(query, (error, results) => {
        connection.end(); // Cerrar la conexión después de ejecutar la consulta
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }
  });
}

function getConnection() {
  return connection;
}

module.exports = { executeQuery, getConnection };
