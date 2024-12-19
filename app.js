const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const socketIO = require("socket.io");
const moment = require("moment");
const cors = require("cors");
const cron = require("node-cron");
const app = express();
const PORT = 8000;

dotenv.config();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(__dirname + "/static"));
app.use("/utils", express.static(__dirname + "/utils"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "*",
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["ETag", "x-amz-meta-custom-header", "Content-Type"],
    })
);

// AWS에 올라가는지 테스트

// Preflight 요청에 대한 응답
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true"); // 필요에 따라 추가
    res.status(204).send();
});


const { swaggerUi, specs } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// 중고거래
const marketRouter = require("./routes/market");
app.use("/", marketRouter);

// 채팅
const chatRouter = require("./routes/chat");
app.use("/", chatRouter);

// Socket
const socketCtrl = require("./controller/Cchat");
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);
io.on("connection", (socket) => socketCtrl.socketConnection(socket, io));

app.get("*", (req, res) => {
    res.render("404");
});

ß
const connect = require("./model/index");
connect();

const { processPosts } = require("./controller/Ccron");

cron.schedule("0 0 * * *", async () => {
    await processPosts();
});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
