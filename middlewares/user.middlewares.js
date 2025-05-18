const User = require("../models/user.model.js");

const inforUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            deleted: false,
            status: "active",
        }).select("-password");

        if (user) {
            res.locals.user = user;
        }

        next();
    } catch (error) {
        console.error("Error in inforUser middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = inforUser;
