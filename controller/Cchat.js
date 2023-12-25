// 채팅 controller
const chats = require("../model/chats");
const chatrooms = require("../model/chatrooms");
const user = require("../model/user");
const market = require("../model/market");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/token");
require("moment/locale/ko");

exports.getChats = async (req, res) => {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!token) {
        res.render("login");
    } else {
        try {
            const decodedjwt = await verifyToken(token, refreshToken);
            if (decodedjwt.token != undefined) {
                const { postName, myName, productId, from } = req.query;
                console.log("chatrooms check", postName, myName, productId);
                let roominfo = await market.findOne({ _id: productId });
                let roomname = roominfo.subject;

                // productId를 기준으로 채팅방 검색
                const savedChatRooms = await chatrooms.find({
                    productId: productId,
                });
                let savedChats;
                if (savedChatRooms.length <= 0) {
                    const newChatRoom = await chatrooms.create({
                        sendId: myName,
                        takeId: postName,
                        productId: productId,
                    });
                    console.log("newChatRoom", newChatRoom);
                    savedChats = [];
                    // 저장된 채팅 데이터
                    res.render("chats", {
                        nowRoomId: newChatRoom.productId,
                        savedChats,
                        myname: myName,
                        yourname: postName,
                        from,
                        roomname,
                    });
                } else {
                    console.log("savedChatRooms", savedChatRooms);
                    savedChats = await chats.find({
                        roomId: savedChatRooms[0].productId,
                    });
                    // 채팅방 날짜 업데이트
                    savedChats = savedChats.map((chat) => {
                        return {
                            ...chat._doc,
                            chatDate: moment(chat.createdAt).format(
                                "YYYY-MM-DD"
                            ),
                            chatTime: moment(chat.createdAt).format("a hh:mm"),
                        };
                    });
                    console.log("savedChats", savedChats);
                    res.render("chats", {
                        nowRoomId: savedChatRooms[0].productId,
                        savedChats,
                        myname: myName,
                        yourname: postName,
                        from,
                        roomname,
                    });
                }
            } else {
                res.render("login");
            }
        } catch (err) {
            console.error("메인 페이지 랜딩 에러", err);
        }
    }
};
exports.getChatrooms = async (req, res) => {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!token) {
        res.render("login");
    } else {
        try {
            const decodedjwt = await verifyToken(token, refreshToken);

            if (decodedjwt.token != undefined) {
                let mychatrooms;
                const { myName } = req.query;
                console.log("myName", myName);
                try {
                    const fromMe = await chatrooms.find({
                        sendId: myName,
                    });
                    console.log("내가 보낸 채팅방", fromMe);
                    const toMe = await chatrooms.find({
                        takeId: myName,
                    });
                    console.log("내가 받은 채팅방", toMe);
                    mychatrooms = [...fromMe, ...toMe];
                } catch (error) {
                    console.log("find getChatrooms 오류 >", error);
                }
                if (mychatrooms.length > 0) {
                    // 내림차순 정렬
                    mychatrooms = mychatrooms.sort(function (a, b) {
                        return b.createdAt - a.createdAt;
                    });
                    // 업데이트 날짜 형식 변환
                    mychatrooms = mychatrooms.map((room) => {
                        return {
                            ...room._doc,
                            createdAt: moment(room.createdAt).format(
                                "YYYY-MM-DD HH:mm"
                            ),
                        };
                    });
                }
                console.log("mychatrooms", mychatrooms);
                let productNames = [];
                for (let i = 0; i < mychatrooms.length; i++) {
                    console.log(mychatrooms[i].productId);
                    try {
                        const productName = await market.findOne({
                            _id: mychatrooms[i].productId,
                        });
                        if (productName) {
                            productNames.push(productName);
                        } else {
                            productNames.push({});
                        }
                    } catch (error) {
                        console.log("상품 조회 오류 >", error);
                    }
                }
                console.log("mychatrooms length", mychatrooms.length);
                console.log("productNames length", productNames.length);
                console.log("productNames", productNames);
                res.render("chatrooms", { mychatrooms, productNames });
            } else {
                res.render("login");
            }
        } catch (err) {
            console.error("메인 페이지 랜딩 에러", err);
        }
    }
};

exports.postChat = async (req, res) => {
    const { roomid, sendid, sendmsg } = req.body;
    console.log(roomid);
    const newMsg = await chats.create({
        roomId: roomid,
        sendId: sendid,
        msg: sendmsg,
    });
    console.log("newMsg", newMsg);
    res.send({ newMsg });
};

exports.chatExit = async (req, res) => {
    const { roomid } = req.body;
    const result = await chatrooms.findOneAndDelete({ productId: roomid });
    const resultchat = await chats.deleteMany({ roomId: roomid });
    console.log("result", result, resultchat);
    res.send({ result });
};

// 현재 로그인 아이디 구하기
exports.getCurrentUserId = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if (!token) {
            res.render("login");
        } else {
            const decodedjwt = await verifyToken(token, refreshToken);
            const username = await getUsernameByUserid(decodedjwt.userid);
            if (decodedjwt.token != undefined) {
                res.send({
                    userid: decodedjwt.userid,
                    username: username,
                });
            } else {
                res.render("login");
            }
        }
    } catch (err) {
        console.error("getCurrentUserId 에러:", err);
        res.status(500).json({ error: "서버 에러" });
    }
};

const getUsernameByUserid = async function (userid) {
    const userRecord = await user.findOne({ userid: userid });
    if (userRecord) {
        console.log("사용자 닉네임", userRecord.nick);
        return userRecord.nick;
    }
    console.error("존재하지 않는 아이디입니다.");
};
