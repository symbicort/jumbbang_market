const express = require('express');
const router = express.Router();

// controller
const controller = require('../controller/Cmain');

//Controller 연결
//경로를 컨트롤러와 연결지어 사용 가능
router.get('/', controller.main);
router.get('/login', controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/register', controller.getRegister);
router.get('/mypage', controller.getMypage);
router.get('/profile', controller.getProfile);
router.get('/search', controller.getSearch);
router.get('/cs', controller.getCs);
// router.get('/reviewPost/:id', controller.getReviewPost);
router.get('/reviewReceive/:id', controller.getReviewReceive);
// router.get('/reviewWrite', controller.getReviewWrite);
// router.get('/contact', controller.getContact);

// router.get('/bookmark', controller.getBookmark);
// router.get('/sales', controller.getSales);
// router.get('/purchase', controller.getPurchase);

// 회원 가입(POST)
router.post('/register', controller.postRegister);

// 로그인(POST)
router.post('/login', controller.postlogin);

// 로그인 유저 정보 확인(GET)
router.get('/chklogin', controller.checklogin);

// 회원탈퇴
router.post('/withdraw', controller.user_withdraw);

router.patch('/edit_user', controller.userInfo_edit);

router.patch('/edit_userI', controller.userInfo_edit_withImg);

// module.exports를 통해서 router를 등록해줘야 다른 모듈에서 사용 가능함함.
module.exports = router;
