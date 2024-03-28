// Importamos las funciones necesarias del modelo y el módulo jsonwebtoken
const {
  userRegister,
  checkEmail,
  getUserByEmail,
} = require("../models/user_models");
const jwt = require("jsonwebtoken");

// Función para registrar un nuevo usuario
const newUser = async (req, res) => {
  try {
    // Llamamos a la función userRegister con los datos del cuerpo de la solicitud
    const usuario = await userRegister(req.body);
    // Respondemos con un código 200 y los datos del nuevo usuario
    res.status(200).json({ usuario });
  } catch (e) {
    // Si ocurre un error, lo registramos en la consola y respondemos con un código 500
    console.error(e);
    res.status(500).send(e.message);
  }
};

// Función para iniciar sesión de un usuario
const userLogin = async (req, res) => {
  try {
    // Obtenemos el email y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;
    // Llamamos a la función checkEmail para verificar las credenciales
    const user = await checkEmail(email, password);

    if (user && user.email) {
      // Si las credenciales son válidas, generamos un token JWT con el email del usuario
      const token = jwt.sign({ email: user.email }, process.env.JWT_SIGN, {
        expiresIn: "1h",
      });
      // Respondemos con un código 200 y el token generado
      res.status(200).json({ token });
    } else {
      // Si las credenciales son inválidas, respondemos con un código 401
      res.status(401).json({ error: "Invalid user" });
    }
  } catch (e) {
    // Si ocurre un error, lo registramos en la consola y respondemos con un código 500
    console.error(e);
    res.status(500).json({ error: "Server error! :(" });
  }
};

const getUserData = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Token no válido" });
        }
    
        const token = authHeader.split(" ")[1];
        if (!token) {
          return res.status(401).json({ error: "Token no válido" });
        }
    
        // Verificar y decodificar el token
        const decodedToken = jwt.verify(token, process.env.JWT_SIGN);
    const { email } = decodedToken;

    // Obtener los datos del usuario desde la base de datos
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token no válido" });
    }
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Exportamos las funciones para ser utilizadas en otros archivos
module.exports = { userLogin, newUser, getUserData };
