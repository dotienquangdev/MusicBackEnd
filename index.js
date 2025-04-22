const express = require("express")
const http = require('http')
require("dotenv").config()
const cors = require('cors');
const database = require("./config/database")
const systemRoute = require("./routes/index.routess");
const Singer = require("./models/singer.model");
const Song = require("./models/song.model");


const app = express();
const server = http.createServer(app)


database.connect();
app.use(cors());

const port = process.env.PORT;

systemRoute(app)
app.set("view engine", "ejs");
app.set("views", "./views");

systemRoute(app);


app.get("/api/singer", async (req, res) => {
    try {
        const singers = await Singer.find({});

        res.json(result);
    } catch (error) {
        console.error('Lỗi truy vấn dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

app.get("/api/song", async (req, res) => {
    try {
        const singers = await Song.find({});

        // // Chuyển _id thành chuỗi để dễ sử dụng trong frontend
        // const result = singers.map(singer => ({
        //     _id: singer._id.toString(),
        //     fullName: singer.fullName || 'Không có tên',
        //     avatar: singer.avatar || 'https://default-avatar.jpg',
        //     status: singer.status,
        //     slug: singer.slug,
        // }));

        res.json(result);
    } catch (error) {
        console.error('Lỗi truy vấn dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

server.listen(port, () => {
    console.log("localhost:" + port);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

