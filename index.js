const express = require("express");
const http = require('http');
require("dotenv").config();
const cors = require('cors');
const database = require("./config/database");
const systemRoute = require("./routes/index.routess");
const helperAPI = require("./helper/index");
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
    'http://localhost:3002',
    'https://music-font-end.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Session và flash
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Kết nối DB
database.connect();

// Các route
systemRoute(app);

// View engine (nếu dùng)
app.set("view engine", "ejs");
app.set("views", "./views");

// Khởi tạo helper
helperAPI(app);

// Khởi động server
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
