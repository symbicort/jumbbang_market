const express = require('express');
const router = express.Router();

// controller
const controller = require('../controller/Cmain');

//Controller 연결
//경로를 컨트롤러와 연결지어 사용 가능
router.get('/', controller.main);
router.get('/login', controller.getLogin);
router.get('/logout', controller.postLogout);
router.get('/register', controller.getRegister);
router.get('/mypage', controller.getMypage);
router.get('/profile', controller.getProfile);
router.get('/search', controller.getSearch);
router.get('/cs', controller.getCs);
router.get('/chats', controller.getChats);
router.get('/chats/:id', controller.getChats);

// module.exports를 통해서 router를 등록해줘야 다른 모듈에서 사용 가능함함.
module.exports = router;
