const express = require("express");
const router = express.Router();
const controller = require("../controllers/song.controllers");

router.get("/", controller.getListSinger);

module.exports = router;