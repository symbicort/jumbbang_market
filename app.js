const express = require("express");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, express.static(__dirname + "/static"));

app.use('/utils', express.static(__dirname + '/utils'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

dotenv.config();

app.use(cors());

// Swagger 설정 (해당 부분이 추가되었다고 가정)
const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 메인, 회원가입, 로그인, 회원탈퇴, 마이페이지, 고객센터,
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// 중고거래
const marketRouter = require("./routes/market");
app.use("/", marketRouter);

// 채팅
const chatRouter = require("./routes/chat");
app.use("/", chatRouter);

// Socket
const http = require("http");
const server = http.createServer(app);
const socketController = require("./controller/Csocket")(server);
// Socket 기능
app.use("/chatroom", socketController);

// TODO: 404 처리
app.get("*", (req, res) => {
    res.render("404");
});

// DB 연동
const connect = require("./model/index");
connect();

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
