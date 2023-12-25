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
app.use("/static", express.static(__dirname + "/static"));
app.use('/utils', express.static(__dirname + '/utils'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

dotenv.config();

app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['ETag', 'x-amz-meta-custom-header', 'Content-Type'],
}));

// Preflight 요청에 대한 응답
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');  // 필요에 따라 추가
    res.status(204).send();
});


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
