const mongoose = require("mongoose");

const singerSchema = new mongoose.Schema(
    {
        fullName: String,
        avatar: String,
        status: String,
        slug: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);
const Singer = mongoose.model('Singer', singerSchema, "singers")

module.exports = Singer;