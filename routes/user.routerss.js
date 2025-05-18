const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controllers");
const validate = require("../validates/user.validate");
router.get("/login", controller.login);
router.get("/loginDeleted", controller.loginDeleted);

router.post("/login", controller.loginPost);
router.delete("/delete/:id", controller.deleteUser)

router.delete("/deleted/:id", controller.deleteUserDelete)


router.get("/register", controller.register);
router.post("/register", controller.registerPost);

router.post("/forgot",
    validate.forgotPasswordPost,
    controller.forgotPasswordPost
);
router.post("/otp", controller.otpPasswordPost);
router.post("/reset",
    (req, res, next) => {
        // console.log("chạy vào đây");
        next()
    },
    validate.resetPasswordPost,
    controller.resetPasswordPost
);

module.exports = router;