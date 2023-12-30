const express = require('express');
const router = express.Router();

// controller
const controller = require('../controller/Cmain');

//Controller 연결
//경로를 컨트롤러와 연결지어 사용 가능

/**
 * @swagger
 * tags:
 *   name: Index
 *   description: 메인페이지, 로그인 등 유저 관련 작업
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: 메인 페이지 표시
 *     tags: [Index]
 *     parameters: []
//  *     responses:
//  *       '200':
//  *         description: 메인 페이지 render, 로그인 된 유저 정보 return
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: 로그인 페이지 표시
 *     tags: [Index]
 *     parameters: []
 */

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: 현재 접속중인 유저 로그아웃 처리
 *     tags: [Index]
 *     parameters: []
 */

/**
 * @swagger
 * /register:
 *   get:
 *     summary: 회원가입 페이지 표시
 *     tags: [Index]
 *     parameters: []
 */

/**
 * @swagger
 * /mypage:
 *   get:
 *     summary: 마이페이지 표시
 *     tags: [Index]
 *     parameters: []
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: 프로필 페이지 표시
 *     tags: [Index]
 *     parameters: []
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: 중고 거래 게시물 검색
 *     tags: [Index]
 *     parameters: []
 */

/**
 * @swagger
 * /cs:
 *   get:
 *     summary: 고객센터 페이지 이동
 *     tags: [Index]
 *
 *     parameters: []
 */

/**
 * @swagger
 *  /reviewReceive/{id}:
 *   get:
 *     summary: 리뷰 페이지 표시
 *     tags: [Index]
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Index]
 *     summary: 사용자 회원가입 요청
 *     description: 사용자 회원가입
 *     requestBody:
 *       description: 사용자 정보
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *               userpw:
 *                 type: string
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - userid
 *               - userpw
 *               - address
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Index]
 *     summary: 사용자 로그인
 *     description: 사용자 로그인을 위한 엔드포인트
 *     requestBody:
 *       description: 사용자 정보
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *               userpw:
 *                 type: string
 */

/**
 * @swagger
 * /chklogin:
 *   get:
 *     summary: 현재 브라우저에 접속한 유저가 로그인 상태인지 확인
 *     tags: [Index]
 *     parameters: []
 */

/**
 * @swagger
 * /withdraw:
 *   post:
 *     tags: [Index]
 *     summary: 회원 탈퇴
 *     description: 현재 접속중인 유저 회원탈퇴
 *     requestBody:
 *       description: 접속중인 유저 회원탈퇴
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *               userpw:
 *                 type: string
 */

/**
 * @swagger
 * /edit_user:
 *   patch:
 *     tags: [Index]
 *     summary: 사용자 정보 수정 요청
 *     description: 사용자 정보를 수정합니다.
 *     requestBody:
 *       description: 수정할 사용자 정보
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *               userpw:
 *                 type: string
 *               newpw:
 *                 type: string
 *               usernick:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *               addr:
 *                 type: string
 */

/**
 * @swagger
 * /edit_userI:
 *   patch:
 *     tags: [Index]
 *     summary: 사용자 정보 수정 요청(프로필 이미지 포함)
 *     description: 사용자 정보를 수정합니다.(프로필 이미지 포함)
 *     requestBody:
 *       description: 수정할 사용자 정보
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *               userpw:
 *                 type: string
 *               newpw:
 *                 type: string
 *               usernick:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *               addr:
 *                 type: string
 *               image:
 *                 type: file
 *       required:
 *         - userid
 *         - image
 */

router.get('/', controller.main);
router.get('/login', controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/register', controller.getRegister);
router.get('/mypage', controller.getMypage);
router.get('/profile', controller.getProfile);
router.get('/search', controller.getSearch);
router.get('/cs', controller.getCs);
router.get('/reviewReceive/:id', controller.getReviewReceive);

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
