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
//프로필
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
