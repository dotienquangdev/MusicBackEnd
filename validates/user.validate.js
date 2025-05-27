// Callapi không res.redirect được đâu @@
module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", `Vui lòng nhập họ tên!`);
        res.redirect("back");
        // res.redirect("");
        return;
    }
    if (!req.body.email) {
        req.flash("error", `Vui lòng nhập email!`);
        res.redirect("back");
        // res.redirect("");
        return;
    }
    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập password!`);
        res.redirect("back");
        // res.redirect("");
        return;
    }
    next();
}

module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", `Vui lòng nhập email!`);
        res.redirect("back");
        // res.redirect("");
        return;
    }
    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập password!`);
        res.redirect("back");
        // res.redirect("");
        return;
    }
    next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {

        return res.status(400).json({});
    }
    next();
}


//Sau check lại đống này
module.exports.resetPasswordPost = (req, res, next) => {
    console.log("chạy vào đây");

    // if (!req.body.password) {
    //     return res.status(400).json({});

    // }
    // if (!req.body.confirmPassword) {
    //     return res.status(400).json({});

    // }
    // if (req.body.password != req.body.confirmPassword) {
    //     return res.status(400).json({});

    // }

    next();
}