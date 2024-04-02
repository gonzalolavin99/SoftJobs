// Importamos el módulo 'pg' de PostgreSQL
const { Pool } = require("pg");

// Creamos una conexión a la base de datos PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  allowExitOnIdle: true, // Permite terminar el proceso si no hay conexiones activas
  port: 5432, // Puerto en el que se ejecuta la base de datos
});

// Probamos la conexión a la base de datos
try {
  pool.query("SELECT NOW()"); // Ejecutamos una consulta sencilla
  console.log("Database connection OK!"); // Si la consulta se ejecuta bien, mostramos un mensaje
} catch (e) {
  console.error(e); // Si hay un error, lo mostramos
}

// Exportamos la conexión para usarla en otros archivos
module.exports = { pool };
