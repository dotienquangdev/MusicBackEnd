const System = require("../models/system.model");
module.exports.system = async (req, res) => {
    const system = await System.findOne();
    res.json(system);
}