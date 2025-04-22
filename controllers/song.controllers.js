const Song = require("../models/song.model");
module.exports.getListSinger = async (req, res) => {
    const song = await Song.find({
        deleted: false,
    })
    console.log(song);
    res.json({
        song: song,
    })
}