const express = require("express");
const router = express.Router();
// 채팅 controller
const chats = require("../model/chats");
const chatrooms = require("../model/chatrooms");
const moment = require("moment");
const Socketcontrol = require("../controller/Csocket");

exports.getChats = async (req, res) => {
    const { postName, myName, productId } = req.query;
    console.log(postName, myName, productId);
    // productId를 기준으로 채팅방 검색
    const savedChatRooms = await chatrooms.find({
        productId: productId,
    });
    // console.log("savedChatRooms", savedChatRooms);
    let savedChats;
    if (savedChatRooms.length <= 0) {
        const newChatRoom = await chatrooms.create({
            sendId: myName,
            takeId: postName,
            productId: productId,
        });
        // 저장된 채팅 데이터
        savedChats = false;
        res.render("chats", {
            nowRoomId: newChatRoom._id,
            savedChats,
            myname: myName,
            yourname: postName,
        });
        // console.log("newChatRoom", newChatRoom);
    } else {
        console.log("savedChatRooms", savedChatRooms);
        savedChats = await chats.find({ roomId: savedChatRooms[0]._id });
        console.log("savedChats", savedChats);
        res.render("chats", {
            nowRoomId: savedChatRooms[0]._id,
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
    // console.log(mychatrooms);
    res.render("chatrooms", { mychatrooms });
    // res.render("chatrooms");
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

exports.chatExit = (req, res) => {
    const { myName } = req.query;
    res.send();
};
