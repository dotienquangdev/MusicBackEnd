const mongoose = require("mongoose");
const generate = require("../helper/generate");
const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(10)
        },
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active",
        },
        requestFriends: Array,
        acceptFriends: Array,
        statusOnline: String,
        friendList: [
            {
                user_id: String,
                room_chat_id: String,
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
        level: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);
const User = mongoose.model('User', userSchema, "users");

module.exports = User;