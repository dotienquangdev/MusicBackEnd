const express = require("express")
const http = require('http')
require("dotenv").config()
const cors = require('cors');
const database = require("./config/database")
const systemRoute = require("./routes/index.routess");
const helperAPI = require("./helper/index");
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const server = http.createServer(app)

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
    }
}));

app.use(session({
    secret: 'yourSecretKey', // đổi thành key bảo mật của bạn
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
// Kết nối đến cơ sở dữ liệu
database.connect();

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3002',  // URL frontend của bạn
    credentials: true                 // Cho phép chia sẻ thông tin xác thực (cookies)
}));

// Các route của hệ thống
systemRoute(app);

// Cấu hình view engine (nếu cần thiết)
app.set("view engine", "ejs");
app.set("views", "./views");

// Khởi tạo các helper API
helperAPI(app);

const port = process.env.PORT || 9000;  // Đảm bảo rằng port được thiết lập đúng

// Lắng nghe trên port
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
