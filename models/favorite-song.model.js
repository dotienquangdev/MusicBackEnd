const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema(
    {
        userId: String,
        songId: String,
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
const FavoriteSong = mongoose.model('FavoriteSong', favoriteSchema, "favorite-songs");

module.exports = FavoriteSong;