const express = require("express");
const router = express.Router();
const controller = require("../controllers/song.controllers");
const multer = require('multer');
const upload = multer();
const validate = require("../validates/products-category.validate");
const uploadCloud = require("../middlewares/uploadCloud.middlewares");

router.get("/", controller.getListSong);
router.get("/detail/:slugSong", controller.getDetailSong);
router.get("/:id", controller.getDetail);
router.get("/edit/:id", controller.editSong);
router.get("/create", controller.createSong);
router.post(
    "/create",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "audio", maxCount: 1 }
    ]),
    uploadCloud.upload,
    validate.createPost,
    controller.createPostSong
);
router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatchSong
);
router.delete("/delete/:id", controller.deleteSong);

module.exports = router;