const express = require("express");
const router = express.Router();
const controller = require("../controller/Cchat");

/**
 * @swagger
 * definitions:
 *   Chatrooms:
 *     type: object
 *     properties:
 *       sendId:
 *         type: string
 *         description: "채팅 요청을 보내는 사용자 ID"
 *       takeId:
 *         type: string
 *         description: "채팅 요청을 받는 사용자 ID"
 *       productId:
 *         type: string
 *         description: "중고거래 물품 ID (market 모델의 _id 참조)"
 *     required:
 *       - sendId
 *       - takeId
 *       - productId
 *
 *   Chats:
 *     type: object
 *     properties:
 *       roomId:
 *         type: string
 *         format: uuid
 *         description: "채팅방 ID(chatrooms 모델의 _id 참조)"
 *       sendId:
 *         type: string
 *         description: "메시지를 보낸 사용자 ID"
 *       msg:
 *         type: string
 *         description: "보낸 메시지 내용"
 *     required:
 *       - roomId
 *       - sendId
 *       - msg
 *
 * /getchatrooms:
 *   get:
 *     tags:
 *       - Chat
 *     summary: "채팅방 출력"
 *     parameters:
 *       - name: userid
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "userid가 포함된 모든 채팅방 최신순으로 출력"
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Chatrooms"
 *
 * /chatroom:
 *   get:
 *     tags:
 *       - Chat
 *     summary: "채팅방 입장"
 *     parameters:
 *       - name: postid
 *         in: query
 *         required: true
 *         type: string
 *       - name: userid
 *         in: query
 *         required: true
 *         type: string
 *       - name: productid
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "기존 DB에 저장된 채팅 내역 출력 / DB에 채팅방이 존재하지 않으면 채팅방 생성"
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Chats"
 *   post:
 *     tags:
 *       - Chat
 *     summary: "채팅 메시지 입력"
 *     responses:
 *       200:
 *         description: "채팅 입력시 id와 msg DB에 저장"
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Chats"
 *   delete:
 *     tags:
 *       - Chat
 *     summary: "채팅방 삭제"
 *     responses:
 *       200:
 *         description: "채팅방 id를 통해 DB에서 채팅방 삭제"
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Chatrooms"
 *
 * /getcurrentuserid:
 *   get:
 *     tags:
 *       - Chat
 *     summary: "로그인 userid 확인"
 *     responses:
 *       200:
 *         description: "token을 이용해서 현재 로그인된 userid 확인"
 */


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
