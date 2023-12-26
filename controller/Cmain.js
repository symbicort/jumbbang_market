//const Comment = require('../models/Cproduct');
const userModel = require("../model/user");
const marketModel = require("../model/market");
const { hashPW, comparePW } = require("../utils/crypto");
const { upload, deleteProfileImg } = require("../utils/imgUploader");
const { makeToken, makeRefreshToken, verifyToken } = require("../utils/token");
const { loginCheck } = require("../utils/loginCheck");

//메인
exports.main = async (req, res) => {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    const result = await marketModel
        .find()
        .populate("userid")
        .sort({ hit: -1 });
    console.log("DB 정보 추출", result);

    if (!token || !refreshToken) {
        res.render("index", {
            userid: undefined,
            result,
        });
    } else {
        try {
            const decodedjwt = await verifyToken(token, refreshToken);
            if (decodedjwt.token != undefined) {
                res.header("Access-Control-Allow-Origin", "*");
                res.render("index", {
                    userid: decodedjwt.userid,
                    result,
                });
            } else {
                res.render("index", { userid: undefined, result });
            }
        } catch (err) {
            console.error("메인 페이지 랜딩 에러", err);
        }
    }
};

//로그인
exports.getLogin = (req, res) => {
    res.render("login");
};
//로그아웃
exports.postLogout = (req, res) => {
    res.send("로그아웃 되었습니다"); // 예시
};
//회원가입
exports.getRegister = (req, res) => {
    res.render("register");
};
//마이페이지
exports.getMypage = (req, res) => {
    res.render("mypage");
};
//프로필(정보수정)
exports.getProfile = (req, res) => {
    res.render("profile");
};
//통합검색
exports.getSearch = (req, res) => {
    res.render("search");
};
//고객센터
exports.getCs = (req, res) => {
    res.render("cs");
};

//채팅 목록
exports.getChats = (req, res) => {
    res.render(`chats`);
};
//채팅 방
exports.getChatRoom = (req, res) => {
    res.render(`chatRoom`);
};
//채팅 나가기
exports.getChatLogout = (req, res) => {
    try {
        res.redirect("/chats");
    } catch (err) {
        console.log("err: ", err);
    }
};
//보낸 후기
exports.getReviewPost = (req, res) => {
    res.render(`reviewPost`);
};
//받은 후기
exports.getReviewReceive = (req, res) => {
    res.render(`reviewReceive`);
};
//후기 작성
exports.getReviewWrite = (req, res) => {
    res.render(`reviewWrite`);
};
//관심 목록
exports.getContact = (req, res) => {
    res.render("contact");
};
//관심 목록
exports.getBookmark = (req, res) => {
    res.render("bookmark");
};
//판매 내역
exports.getSales = (req, res) => {
    res.render("sales");
};
//구매 내역
exports.getPurchase = (req, res) => {
    res.render("purchase");
};

exports.postRegister = async (req, res) => {
    try {
        const { userid, userpw, nickname, email, contact, address } = req.body;

        console.log({ userid, userpw, nickname, email, contact, address });

        const User_pw = hashPW(userpw);
        await userModel
            .create({
                userid: userid,
                pw: User_pw,
                nick: nickname,
                email: email,
                contact: contact,
                address: address,
                image: "",
            })
            .then((newUser) => {
                console.log(newUser);
                res.send(newUser);
            });
    } catch (err) {
        console.error("유저 생성 중 오류", err.code);
        if (err.code == 11000) {
            res.send({ existUser: true });
        } else {
            res.send({ existUser: false });
        }
    }
};

exports.postlogin = async (req, res) => {
    console.log(req.body);
    try {
        const { userid, userpw } = req.body;
        console.log(userid, userpw);
        const user = await userModel.findOne({ userid: userid }).exec();

        console.log("Users:", user);

        if (user) {
            const isPasswordMatch = comparePW(userpw, user.pw);
            console.log(isPasswordMatch);

            if (isPasswordMatch) {
                const token = makeToken(userid);
                const refreshToken = makeRefreshToken(userid);
                console.log("토큰 생성 정보", token, refreshToken);
                res.cookie("accessToken", token, {
                    maxAge: 7200000,
                    httpOnly: true,
                });
                res.cookie("refreshToken", refreshToken, {
                    maxAge: 604800000,
                    httpOnly: true,
                });
                res.send({ result: true });
            } else {
                res.send({ result: false });
            }
        } else {
            res.send({ result: false });
        }
    } catch (err) {
        console.error(err);
    }
};

exports.checklogin = async (req, res) => {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
        const chklogin = await loginCheck(token, refreshToken);

        console.log("login 정보 헤더 Response", chklogin);

        res.send(chklogin);
    } catch (err) {
        console.err("로그인 정보 확인 중 에러", err);
    }
};
