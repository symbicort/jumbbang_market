// 채팅 controller
const chats = require("../model/chats");
const chatrooms = require("../model/chatrooms");
const user = require("../model/user");
const market = require("../model/market");
const moment = require("moment-timezone");
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
                // 현재 로그인 id, nick 구하기
                const myid = decodedjwt.userid;
                const myinfo = await user.findOne({ userid: myid });
                const { postid, userid, productid, from } = req.query;
                let yourinfo;
                if (postid != myid) {
                    yourinfo = await user.findOne({ userid: postid });
                } else {
                    yourinfo = await user.findOne({ userid: userid });
                }
                console.log("chatrooms check", postid, userid, productid);
                // console.log("sendid check", userid, myid);

                // market모델에서 게시물 제목 데이터 가져오기
                let roominfo = await market.findOne({
                    _id: productid,
                });
                let roomname = roominfo.subject;
                // productid 기준으로 채팅방 검색
                const savedChatRooms = await chatrooms.findOne({
                    productId: productid,
                    $or: [
                        { takeId: userid, sendId: postid },
                        { takeId: postid, sendId: userid },
                    ],
                });
                let hasYourInfo;
                if (!yourinfo) {
                    hasYourInfo = false;
                } else {
                    hasYourInfo = true;
                }
                // 검색한 채팅방의 채팅 내역 저장 변수
                let savedChats;
                if (!savedChatRooms) {
                    const newChatRoom = await chatrooms.create({
                        sendId: userid,
                        takeId: postid,
                        productId: productid,
                    });
                    console.log("newChatRoom", newChatRoom);
                    savedChats = [];
                    // 저장된 채팅 데이터
                    res.render("chats", {
                        nowRoomId: newChatRoom._id,
                        savedChats,
                        from,
                        roomname,
                        myinfo,
                        yourinfo,
                        hasYourInfo,
                    });
                } else {
                    console.log("savedChatRooms", savedChatRooms);
                    savedChats = await chats.find({
                        roomId: savedChatRooms._id,
                    });
                    // 채팅방 날짜, 시간 형식 변환 및 저장
                    savedChats = savedChats.map((chat) => {
                        return {
                            ...chat._doc,
                            chatDate: moment(chat.createdAt)
                                .tz("Asia/Seoul")
                                .format("YYYY-MM-DD"),
                            chatTime: moment(chat.createdAt)
                                .tz("Asia/Seoul")
                                .format("a hh:mm"),
                        };
                    });
                    console.log("savedChats", savedChats);
                    res.render("chats", {
                        nowRoomId: savedChatRooms._id,
                        savedChats,
                        from,
                        roomname,
                        myinfo,
                        yourinfo,
                        hasYourInfo,
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
                const userid = decodedjwt.userid;
                const myinfo = await user.findOne({ userid: userid });
                console.log("userid", userid);
                try {
                    const fromMe = await chatrooms.find({
                        sendId: userid,
                    });
                    console.log("내가 보낸 채팅방", fromMe);
                    const toMe = await chatrooms.find({
                        takeId: userid,
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
                let yourNames = [];
                let yourProfileImgs = [];
                let yourNickNames = [];
                for (let i = 0; i < mychatrooms.length; i++) {
                    // console.log(mychatrooms[i].productId);
                    try {
                        if (mychatrooms[i].sendId != userid) {
                            yourNames.push(mychatrooms[i].sendId);
                            yourNickNames.push(
                                await getUsernameByUserid(mychatrooms[i].sendId)
                            );
                        } else {
                            yourNames.push(mychatrooms[i].takeId);
                            yourNickNames.push(
                                await getUsernameByUserid(mychatrooms[i].sendId)
                            );
                        }
                        const productName = await market.findOne({
                            _id: mychatrooms[i].productId,
                        });
                        if (productName) {
                            productNames.push(productName.subject);
                        } else {
                            productNames.push({});
                        }
                        const profileImg = await user.findOne({
                            userid: yourNames[i],
                        });
                        if (profileImg) {
                            yourProfileImgs.push(profileImg.image);
                        } else {
                            yourProfileImgs.push(
                                "https://d1unjqcospf8gs.cloudfront.net/assets/users/default_profile_80-c649f052a34ebc4eee35048815d8e4f73061bf74552558bb70e07133f25524f9.png"
                            );
                        }
                    } catch (error) {
                        console.log("상품 조회 오류 >", error);
                    }
                }
                console.log("mychatrooms length", mychatrooms.length);
                console.log("productNames length", productNames.length);
                console.log("productNames", productNames);
                console.log("yourNames", yourNames);
                console.log("myinfo.image", myinfo.image);
                console.log("yourProfileImgs", yourProfileImgs);
                res.render("chatrooms", {
                    mychatrooms,
                    productNames,
                    userid,
                    yourNames,
                    yourProfileImgs,
                    myimage: myinfo.image,
                    yourNickNames,
                });
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
    const result = await chatrooms.findOneAndDelete({ _id: roomid });
    const resultchat = await chats.deleteMany({ roomId: roomid });
    console.log("chatExit result", result, resultchat);
    res.send({ result });
};

// 현재 로그인 아이디 구하기
exports.getCurrentUserId = async (req, res) => {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!token) {
        res.render("login");
    } else {
        const decodedjwt = await verifyToken(token, refreshToken);
        const username = await getUsernameByUserid(decodedjwt.userid);
        const userid = decodedjwt.userid;
        if (decodedjwt.token != undefined) {
            console.log(userid, username);
            res.send({
                userid: userid,
                username: username,
            });
        } else {
            res.render("login");
        }
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

exports.socketConnection = (socket, io) => {
    // socket 연결
    console.log("Socket connection status:", socket.connected);

    console.log("socket 연결 > ", socket.id);
    socket.on("joinRoom", ({ userid, room }) => {
        let roomUsers = getRoomUsers(room);
        console.log("현재 room 인원", roomUsers);
        if (roomUsers.length >= 2) {
            socket.emit("roomFull");
            socket.disconnect();
            console.log("Socket connection status:", socket.connected);
            return;
        }
        const user = userJoin(socket.id, userid, room);
        socket.join(user.room);
        roomUsers = getRoomUsers(user.room);
        console.log("join후 room 인원", roomUsers);

        io.to(user.room).emit("roomUsers");
    });

    socket.on("chatMessage", (data) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit(
            "message",
            formatMessage(socket, data.msg, data.userid)
        );
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            console.log("삭제할 userid >", user.userid);
        }
    });
};

// 채팅 관련 함수
const users = [];

// 사용자 배열에 user 추가
function userJoin(id, userid, room) {
    const user = { id, userid, room };
    users.push(user);
    return user;
}

// 사용자 배열에서 id가 현재 socket.id인 본인 구하기
function getCurrentUser(id) {
    return users.find((user) => user.id === id);
}

// id로 나갈 사람의 index를 찾고 사용자 배열에서 빼기
function userLeave(id) {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//사용자 중 현재 room에 포함된 유저 반환
function getRoomUsers(room) {
    return users.filter((user) => user.room === room);
}

// 이름, 메시지에 입력 시간 추가
function formatMessage(socket, text, name) {
    return {
        id: socket.id,
        name,
        text,
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("a h:mm"),
    };
}
