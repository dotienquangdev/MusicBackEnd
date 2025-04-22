const route = require("./singer.routess")

module.exports = (app) => {
    app.use("/api/singer", route)
}