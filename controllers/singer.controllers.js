const Singer = require("../models/singer.model");
module.exports.getListSinger = async (req, res) => {
    const singer = await Singer.find({
        deleted: false,
    })
    console.log(singer);
    res.json({
        singer: singer,
    })
}