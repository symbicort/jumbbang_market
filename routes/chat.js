const express = require("express");
const router = express.Router();
const controller = require("../controller/Cchat");
// const chatsController = require("../controller/Csocket");

// 채팅방 목록
router.get("/getchatrooms", controller.getChatrooms);
// '채팅' 버튼 클릭후, 바로 채팅방 이동
router.get("/chatroom", controller.getChats);
// 메시지 입력
router.post("/chatroom/post", controller.postChat);
// 채팅방 삭제
router.delete("/chatroom/delete", controller.chatExit);

module.exports = router;
