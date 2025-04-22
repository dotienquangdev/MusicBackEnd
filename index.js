const express = require("express")
const app = express()
const http = require('http')
require("dotenv").config()

const database = require("./config/database")
const systemRoute = require("./routes/index.routess");
const Singer = require("./models/singer.model")
const server = http.createServer(app)

database.connect()
const port = process.env.PORT

systemRoute(app)
app.set("view engine", "ejs");
app.set("views", "./views"); // folder chứa file index.ejs


app.get("/", async (req, res) => {
    const singer = await Singer.find({});
    console.log(singer)
    res.send("oke");
});

server.listen(port, () => {
    console.log("localhost:" + port);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
