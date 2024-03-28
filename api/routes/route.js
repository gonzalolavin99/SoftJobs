const express = require("express");
const loggerMiddleware = require("../../logs/logger");
const { newUser, userLogin, getUserData } = require("../controllers/user_controller");

const router = express.Router();

router.use(loggerMiddleware);

router.post("/usuarios",newUser);
router.post("/login", userLogin);
router.get("/usuarios",getUserData);

module.exports = router;
