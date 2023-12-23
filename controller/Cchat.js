// 채팅 controller
const chats = require("../model/chats");
const chatrooms = require("../model/chatrooms");
const market = require("../model/market");
const user = require("../model/user");
const moment = require("moment");

exports.getChats = async (req, res) => {
    const { postName, myName, productId } = req.query;
    const postname = await user.findOne({ _id: postName });
    console.log(postname);
    const postnick = postname.nick;
    console.log("chatrooms check", postnick, myName, productId);
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
        });
    } else {
        console.log("savedChatRooms", savedChatRooms);
        savedChats = await chats.find({ roomId: savedChatRooms[0].productId });
        console.log("savedChats", savedChats);
        res.render("chats", {
            nowRoomId: savedChatRooms[0].productId,
            savedChats,
            myname: myName,
            yourname: postName,
        });
    }
};
exports.getChatrooms = async (req, res) => {
    let mychatrooms;
    const { myName } = req.query;
    console.log("내 이름 >", myName);
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
                createdAt: moment(room.createdAt).format("YYYY-MM-DD HH:mm"),
            };
        });
    }
    console.log("mychatrooms", mychatrooms);
    let productNames = [];
    for (let i = 0; i < mychatrooms.length; i++) {
        try {
            const productName = await market.findOne({
                _id: mychatrooms[i].productId,
            });
            if (productName) {
                productNames.push(productName);
            } else {
                console.log("상품을 찾을 수 없습니다.");
            }
        } catch (error) {
            console.log("상품 조회 오류 >", error);
        }
    }
    console.log("productNames", productNames);
    res.render("chatrooms", { mychatrooms, productNames });
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
    console.log("result", result);
};
