const express = require("express");
const router = express.Router();
const { downloadExcel } = require("../controllers/price.controller");

router.get("/price/downloadExcel", downloadExcel);

module.exports = router;
