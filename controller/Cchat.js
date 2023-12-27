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
                // 현재 로그인 id, nick 구하기
                const myid = decodedjwt.userid;
                const myinfo = await user.findOne({ userid: myid });
                const myrealname = myinfo.nick;
                const { postName, myName, productId, from } = req.query;

                let yourrealname;
                if (postName != myrealname) {
                    yourrealname = postName;
                } else {
                    yourrealname = myName;
                }
                const yourinfo = await user.findOne({ nick: yourrealname });
                console.log("chatrooms check", postName, myName, productId);
                console.log("sendid check", myrealname, myName);

                let roominfo = await market.findOne({
                    _id: productId,
                });
                let roomname = roominfo.subject;
                // productId를 기준으로 채팅방 검색
                const savedChatRooms = await chatrooms.findOne({
                    productId: productId,
                    $or: [
                        { takeId: myName, sendId: postName },
                        { takeId: postName, sendId: myName },
                    ],
                });
                let savedChats;
                if (!savedChatRooms) {
                    const newChatRoom = await chatrooms.create({
                        sendId: myName,
                        takeId: postName,
                        productId: productId,
                    });
                    console.log("newChatRoom", newChatRoom);
                    savedChats = [];
                    // 저장된 채팅 데이터
                    res.render("chats", {
                        nowRoomId: newChatRoom._id,
                        savedChats,
                        myname: myName,
                        yourname: postName,
                        from,
                        roomname,
                        myinfo,
                        yourinfo,
                    });
                } else {
                    console.log("savedChatRooms", savedChatRooms);
                    savedChats = await chats.find({
                        roomId: savedChatRooms._id,
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
                    console.log("myrealname", myrealname);
                    console.log("savedChats", savedChats);
                    res.render("chats", {
                        nowRoomId: savedChatRooms._id,
                        savedChats,
                        myname: myName,
                        yourname: postName,
                        from,
                        roomname,
                        myinfo,
                        yourinfo,
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
                const myinfo = await user.findOne({ nick: myName });
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
                let yourNames = [];
                let yourProfileImgs = [];
                for (let i = 0; i < mychatrooms.length; i++) {
                    // console.log(mychatrooms[i].productId);
                    try {
                        if (mychatrooms[i].sendId != myName) {
                            yourNames.push(mychatrooms[i].sendId);
                        } else {
                            yourNames.push(mychatrooms[i].takeId);
                        }
                        const productName = await market.findOne({
                            _id: mychatrooms[i].productId,
                        });
                        if (productName) {
                            productNames.push(productName);
                        } else {
                            productNames.push({});
                        }
                        const profileImg = await user.findOne({
                            nick: yourNames[i],
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
                console.log("myName", myName);
                console.log("myinfo.image", myinfo.image);
                console.log("yourProfileImgs", yourProfileImgs);
                res.render("chatrooms", {
                    mychatrooms,
                    productNames,
                    myName,
                    yourNames,
                    yourProfileImgs,
                    image: myinfo.image,
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

exports.socketConnection = (socket, io) => {
    // socket 연결
    console.log("Socket connection status:", socket.connected);

    console.log("socket 연결 > ", socket.id);
    socket.on("joinRoom", ({ username, room }) => {
        let roomUsers = getRoomUsers(room);
        console.log("현재 room 인원", roomUsers);
        if (roomUsers.length >= 2) {
            socket.emit("roomFull");
            socket.disconnect();
            console.log("Socket connection status:", socket.connected);
            return;
        }
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        roomUsers = getRoomUsers(user.room);
        console.log("join후 room 인원", roomUsers);

        // socket.emit(
        //     "message",
        //     formatMessage(socket, `${user.username}님 환영합니다!`, "notice")
        // );
        // socket.broadcast
        //     .to(user.room)
        //     .emit(
        //         "message",
        //         formatMessage(
        //             socket,
        //             `${user.username}님이 입장하셨습니다.`,
        //             "notice"
        //         )
        //     );

        io.to(user.room).emit("roomUsers");
    });

    socket.on("chatMessage", (data) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit(
            "message",
            formatMessage(socket, data.msg, data.username)
        );
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            // io.to(user.room).emit(
            //     "message",
            //     formatMessage(
            //         socket,
            //         `${user.username}님이 퇴장하셨습니다.`,
            //         "notice"
            //     )
            // );
            console.log("삭제할 username >", user.username);
        }
    });
};

// 채팅 관련 함수
const users = [];

// 사용자 배열에 user 추가
function userJoin(id, username, room) {
    const user = { id, username, room };
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
