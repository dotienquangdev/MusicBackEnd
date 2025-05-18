const Topic = require("../models/topic.model");
module.exports.index = async (req, res) => {
    const topic = await Topic.find({
        deleted: false,
    })
    // console.log(topic);
    res.json({
        topic: topic,
    })
}

module.exports.detail = async (req, res) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Không tìm thấy abum" });
    res.json(topic);
}