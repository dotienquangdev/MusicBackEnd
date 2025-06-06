const mongoose = require("mongoose")

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_MUSIC)
        console.log("Connect success");
    } catch (error) {
        console.log("Connect fail with error code: " + error);
    }
}