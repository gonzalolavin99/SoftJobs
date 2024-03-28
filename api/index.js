const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.listen(3000, console.log("SERVER ON"));
app.use(cors());
app.use(express.json());
const PORT = process.env.PGPORT || 3000;
const route = require("./routes/route.js");

app.use("/", route);

app.listen(PORT, console.log("SERVER ON!"));


