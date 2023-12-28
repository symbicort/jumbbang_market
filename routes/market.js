const express = require("express");
const router = express.Router();

const controller = require("../controller/Cmarket");

/**
 * @swagger
 * tags:
 *   name: Market
 *   description: 중고 거래 관련 작업
 */

/**
 * @swagger
 * /market:
 *   get:
 *     summary: 전체 중고 거래 게시물 가져오기
 *     tags: [Market]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 선택적인 카테고리 코드
 *     responses:
 *       '200':
 *         description: 중고 거래 게시물 목록
 *         content:
 *           application/json:
 *             example:
 *               postData: []
 */

/**
 * @swagger
 * /marketsort:
 *   get:
 *     summary: 중고 거래 게시물 정렬
 *     tags: [Market]
 *     parameters:
 *       - in: query
 *         name: selectedSort
 *         schema:
 *           type: string
 *         description: 선택된 정렬 옵션
 *     responses:
 *       '200':
 *         description: 정렬된 중고 거래 게시물
 *         content:
 *           application/json:
 *             example:
 *               postData: []
 */

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: 선택한 중고 거래 게시물 가져오기
 *     tags: [Market]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 중고 거래 게시물 ID
 *     responses:
 *       '200':
 *         description: 특정 중고 거래 게시물
 *         content:
 *           application/json:
 *             example:
 *               postdata: {}
 */

/**
 * @swagger
 * /market/write:
 *   get:
 *     summary: 중고 거래 게시물 작성 페이지 표시
 *     tags: [Market]
 */

/**
 * @swagger
 * /market/write:
 *   post:
 *     summary: 중고 거래 게시물 등록
 *     tags: [Market]
 *     requestBody:
 *       description: 중고 거래 게시물 데이터
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             subject: "예시 제목"
 *             comment: "예시 코멘트"
 *             category: "예시_카테고리"
 *             state: 1
 *             priceFirst: 100
 *             priceDirect: 150
 *             dateLimit: "2023-12-31"
 */

/**
 * @swagger
 * /market/bid:
 *   post:
 *     summary: 중고 거래 게시물에 입찰하기
 *     tags: [Market]
 *     requestBody:
 *       description: 입찰 데이터
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             bidprice: 120
 *             productId: "예시_상품_ID"
 */

/**
 * @swagger
 * /market/userchk:
 *   post:
 *     summary: 로그인한 사용자가 중고 거래 게시물 소유자인지 확인
 *     tags: [Market]
 *     requestBody:
 *       description: 상품 ID 데이터
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: "예시_상품_ID"
 *     responses:
 *       '200':
 *         description: 사용자가 중고 거래 게시물의 소유자입니다.
 *         content:
 *           application/json:
 *             example:
 *               islogin: true
 *               result: true
 */

/**
 * @swagger
 * /market/editArticle:
 *   patch:
 *     summary: 중고 거래 게시물 정보 수정
 *     tags: [Market]
 *     requestBody:
 *       description: 업데이트된 중고 거래 게시물 데이터
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             articleid: "예시_게시물_ID"
 *             subject: "업데이트된 제목"
 *             content: "업데이트된 내용"
 *             state: 2
 */

/**
 * @swagger
 * /market/directBuy:
 *   post:
 *     summary: 중고 거래 게시물에 직접 구매 요청
 *     tags: [Market]
 *     requestBody:
 *       description: 직접 구매 데이터
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: "예시_상품_ID"
 */


router.get("/market", controller.market);
router.get("/marketsort", controller.marketsort);
router.get("/articles/:id", controller.getView);
router.get("/market/write", controller.getWrite);

router.post("/market/write", controller.addPost);
router.post("/market/bid", controller.enterbid);
router.post("/market/userchk", controller.usercheck);
router.post("/market/directBuy", controller.directBuy)

router.patch('/market/editArticle', controller.editArticle);

module.exports = router;
