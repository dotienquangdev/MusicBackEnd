const express = require("express");
const router = express.Router();
const controller = require("../controllers/singer.controllers");

router.get("/", controller.getListSinger);

module.exports = router