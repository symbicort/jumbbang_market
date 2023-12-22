//const Comment = require('../models/Cproduct');

//메인
exports.main = (req, res) => {
	res.render('index');
};

//로그인
exports.getLogin = (req, res) => {
	res.render('login');
};
//로그아웃
exports.postLogout = (req, res) => {
	res.send('로그아웃 되었습니다'); // 예시
};
//회원가입
exports.getRegister = (req, res) => {
	res.render('register');
};
//마이페이지
exports.getMypage = (req, res) => {
	res.render('mypage');
};
//프로필(정보수정)
exports.getProfile = (req, res) => {
	res.render('profile');
};
//통합검색
exports.getSearch = (req, res) => {
	res.render('search');
};
//고객센터
exports.getCs = (req, res) => {
	res.render('cs');
};

//채팅 목록
exports.getChats = (req, res) => {
	res.render(`chats`);
};
//채팅 방
exports.getChatRoom = (req, res) => {
	res.render(`chatRoom`);
};
//채팅 나가기
exports.getChatLogout = (req, res) => {
	try {
		res.redirect('/chats');
	} catch (err) {
		console.log('err: ', err);
	}
};
//보낸 후기
exports.getReviewPost = (req, res) => {
	res.render(`reviewPost`);
};
//받은 후기
exports.getReviewReceive = (req, res) => {
	res.render(`reviewReceive`);
};
//후기 작성
exports.getReviewWrite = (req, res) => {
	res.render(`reviewWrite`);
};
//관심 목록
exports.getContact = (req, res) => {
	res.render('contact');
};
//관심 목록
exports.getBookmark = (req, res) => {
	res.render('bookmark');
};
//판매 내역
exports.getSales = (req, res) => {
	res.render('sales');
};
//구매 내역
exports.getPurchase = (req, res) => {
	res.render('purchase');
};
