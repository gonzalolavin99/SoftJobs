// Importamos la conexión a la base de datos y el módulo bcryptjs
const { pool } = require("../database/connection.js");
const bcrypt = require("bcryptjs");

// Función para verificar las credenciales de un usuario
const checkEmail = async (email, password) => {
  // Consulta SQL para obtener un usuario por su email
  const query = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const { rows, rowCount } = await pool.query(query, values);

  if (rowCount > 0) {
    // Si se encuentra un usuario, obtenemos su contraseña encriptada
    const [usuario] = rows;
    const { password: encrpassword } = usuario;

    if (encrpassword) {
      // Comparamos la contraseña proporcionada con la contraseña encriptada
      const correctPassword = bcrypt.compareSync(password, encrpassword);

      if (correctPassword) {
        // Si las contraseñas coinciden, devolvemos el objeto del usuario
        return usuario;
      }
    }
  }

  // Si no se encuentra un usuario o la contraseña es incorrecta, devolvemos false
  return false;
};

// Función para registrar un nuevo usuario
const userRegister = async (user) => {
  // Obtenemos los datos del nuevo usuario
  const { email, password, rol, lenguage } = user;

  // Encriptamos la contraseña utilizando bcrypt
  const encrpassword = bcrypt.hashSync(password);

  const newUser = { email, password: encrpassword, rol, lenguage };

  // Definimos las columnas en las que se insertarán los valores
  const columns = ["email", "password", "rol", "lenguage"];

  // Preparamos los placeholders para los valores a insertar
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

  // Construimos la consulta SQL utilizando placeholders
  const query = `INSERT INTO usuarios (${columns.join(
    ", "
  )}) VALUES (${placeholders})`;

  const values = Object.values(newUser);

  await pool.query(query, values);
};

const getUserByEmail = async (email) => {
  const query = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const { rows, rowCount } = await pool.query(query, values);

  if (rowCount > 0) {
    const [user] = rows;
    return user;
  }
  return null;
};

module.exports = { userRegister, checkEmail, getUserByEmail };
