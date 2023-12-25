const express = require("express");
const router = express.Router();
const controller = require("../controller/Cchat");

// 채팅방 목록
router.get("/getchatrooms", controller.getChatrooms);
// '채팅' 버튼 클릭후, 바로 채팅방 이동
router.get("/chatroom", controller.getChats);
// 메시지 입력
router.post("/chatroom", controller.postChat);
// 채팅방 삭제
router.delete("/chatroom", controller.chatExit);
// 현재 로그인 id 구하기
router.get("/getcurrentuserid", controller.getCurrentUserId);

module.exports = router;
