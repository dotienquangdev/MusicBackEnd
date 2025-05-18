const User = require("../models/user.model");
const md5 = require("md5");
const generateHelper = require("../helper/generate");
const sendMailHelper = require("../helper/sendMail");
const ForgotPassword = require("../models/forgot-password.model");
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            email,
            deleted: false,
            status: "active"
        });

        if (!user) {
            return res.status(401).json({ message: "Email không đúng." });
        }

        if (user.password !== md5(password)) {
            return res.status(401).json({ message: "Mật khẩu không đúng." });
        }
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                tokenUser: user.tokenUser,
                level: user.level
            }
        });
    } catch (err) {
        console.error(err); // log ra server để dễ debug
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Cái này để làm méo gì
module.exports.login = async (req, res) => {
    const user = await User.find({
        deleted: false,
        status: "active"
    });
    res.json({
        user: user,
    });
};

// Cái này để làm méo gì
module.exports.loginDeleted = async (req, res) => {
    const user = await User.find({
        deleted: true,
        status: "active"
    });
    res.json({
        user: user,
    });
};
module.exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await User.updateOne(
            { _id: id },
            {
                $set: {
                    deleted: true,
                    deletedAt: new Date(),
                }
            }
        );
        if (updated.modifiedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xoá." });
        }
        return res.json({ message: "Xoá người dùng thành công." });
    } catch (error) {
        console.error("Lỗi xoá người dùng:", error);
        return res.status(500).json({ message: "Lỗi server khi xoá người dùng." });
    }
};

module.exports.deleteUserDelete = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await User.updateOne(
            { _id: id },
            {
                $set: {
                    deleted: false,
                    deletedAt: new Date(),
                }
            }
        );
        if (updated.modifiedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xoá." });
        }
        return res.json({ message: "Xoá người dùng thành công." });
    } catch (error) {
        console.error("Lỗi xoá người dùng:", error);
        return res.status(500).json({ message: "Lỗi server khi xoá người dùng." });
    }
};

module.exports.registerPost = async (req, res) => {
    const exitEmail = await User.findOne({
        email: req.body.email,
    });
    if (exitEmail) {
        return res.status(400).json({ success: false, message: "Email đã tồn tại!" });
    }
    // Hash mật khẩu trước khi lưu
    const hashedPassword = md5(req.body.password);
    const user = new User({
        ...req.body,
        password: hashedPassword,
        level: 1
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: "Đăng ký thành công!",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            level: user.level,
            tokenUser: user.tokenUser // nếu cần dùng
        }
    });
};

// ??
module.exports.register = async (req, res) => {
    const users = await User.find({
        deleted: false,
        status: "active"
    });

    res.json({ user: users });
};

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email?.email || req.body.email;

    const user = await User.findOne({ email, deleted: false });
    if (!user) {
        return res.status(404).json({ success: false, message: "Email không tồn tại!" });
    }

    const otp = generateHelper.generateRandomNumber(4);

    // Lưu OTP + thời hạn 3 phút
    const forgotPassword = new ForgotPassword({
        email,
        otp,
        expiresAt: Date.now() + 3 * 60 * 10000 // 3 phút
    });
    await forgotPassword.save();

    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP là <b style="color:green">${otp}</b>. Có hiệu lực trong 3 phút.`;

    sendMailHelper.sendMail(email, subject, html);

    return res.status(200).json({
        success: true,
        message: "Mã OTP đã được gửi qua email."
    });
}

module.exports.otpPasswordPost = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const result = await ForgotPassword.findOne({ email, otp });

        if (!result) {
            return res.status(400).json({ success: false, message: "Mã OTP không hợp lệ" });
        }

        if (result.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn" });
        }

        // Tạo token ngẫu nhiên đơn giản hoặc dùng JWT nếu muốn
        const tokenUser = Math.random().toString(36).substring(2);

        // Lưu token tạm vào user (hoặc 1 bảng riêng nếu bảo mật cao)
        await User.updateOne({ email }, { tokenUser });

        return res.status(200).json({
            success: true,
            message: "OTP hợp lệ",
            tokenUser
        });
    } catch (err) {
        console.error("OTP check error:", err);
        return res.status(500).json({ success: false, message: "Lỗi server khi xác minh OTP" });
    }
}

module.exports.resetPasswordPost = async (req, res) => {
    try {
        const { email, password, tokenUser } = req.body;
        if (!email || !password || !tokenUser) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu đầu vào.",
            });
        }

        const user = await User.findOne({ email, tokenUser, deleted: false });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Token không hợp lệ hoặc người dùng không tồn tại.",
            });
        }

        const hashedPassword = md5(password);
        const result = await User.updateOne(
            { email, tokenUser },
            // { $set: { password: hashedPassword, tokenUser: null } }
            { $set: { password: hashedPassword, tokenUser: tokenUser } }
        );

        if (result.modifiedCount > 0) {
            return res.status(200).json({
                success: true,
                message: "Đặt lại mật khẩu thành công.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Cập nhật mật khẩu thất bại.",
            });
        }
    } catch (error) {
        console.error("Error in resetPasswordPost:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ, vui lòng thử lại sau.",
        });
    }
};


