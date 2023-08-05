const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("./routes/router");

const app = express();

const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${API_PREFIX}`, Router);

app.listen(PORT, () => console.log(`Server is listening on port:${PORT}`));
