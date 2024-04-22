//const Comment = require('../models/Cproduct');
const userModel = require('../model/user');
const marketModel = require('../model/market');
const { hashPW, comparePW } = require('../utils/crypto');
const { upload, deleteProfileImg } = require('../utils/imgUploader');
const { makeToken, makeRefreshToken, verifyToken } = require('../utils/token');
const { loginCheck } = require('../utils/loginCheck');

//메인
exports.main = async (req, res) => {
	const token = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;
	const result = await marketModel.find().populate('userid').sort({ hit: -1 });

	if (!token || !refreshToken) {
		res.render('index', {
			userid: undefined,
			result,
		});
	} else {
		try {
			const decodedjwt = await verifyToken(token, refreshToken);
			if (decodedjwt.token != undefined) {
				res.header('Access-Control-Allow-Origin', '*');
				res.render('index', {
					userid: decodedjwt.userid,
					result,
				});
			} else {
				res.render('index', { userid: undefined, result });
			}
		} catch (err) {
			console.error('마이페이지 랜딩 에러', err);
		}
	}
};

//로그인
exports.getLogin = (req, res) => {
	res.render('login');
};
//로그아웃
exports.getLogout = (req, res) => {
	console.log('로그아웃 요청 받음');
	res.cookie('accessToken', '', { expires: new Date(0) });
	res.cookie('refreshToken', '', { expires: new Date(0) });
	res.redirect('/');
};
//회원가입
exports.getRegister = (req, res) => {
	res.render('register');
};
//마이페이지
exports.getMypage = async (req, res) => {
	console.log('마이페이지 랜딩');
	const token = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	if (!token || !refreshToken) {
		res.render('login');
	} else {
		try {
			const decodedjwt = await verifyToken(token, refreshToken);

			if (decodedjwt.token != undefined) {
				const user_id = decodedjwt.userid;

				const user = await userModel.findOne({ userid: user_id }).exec();

				console.log('유저 오브젝트 아이디', user._id);

				const sellobject = await marketModel.find({ userid: user._id, state: 1 });

				const sellobject1 = await marketModel.find({
					userid: user._id,
					$or: [{ state: 2 }, { state: 3 }],
				});

				const buyobject = await marketModel.find({
					buyer: decodedjwt.userid,
					$or: [{ state: 2 }, { state: 3 }],
				});

				res.render('mypage', {
					userid: user.userid,
					usernickname: user.nick,
					image: user.image,
					sellobj: sellobject,
					sellobj1: sellobject1,
					buyobj: buyobject,
				});
			} else {
				res.render('login');
			}
		} catch (err) {
			console.error('메인 페이지 랜딩 에러', err);
		}
	}
};
//프로필(정보수정)
exports.getProfile = async (req, res) => {
	const token = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	if (!token || !refreshToken) {
		res.render('login');
	} else {
		try {
			const decodedjwt = await verifyToken(token, refreshToken);

			if (decodedjwt.token != undefined) {
				const user_id = decodedjwt.userid;

				const user = await userModel.findOne({ userid: user_id }).exec();

				console.log('user 정보', user);
				const userid = user.userid;
				const userpw = user.pw;
				const username = user.nick;
				const email = user.email;
				const contact = user.contact;
				const address = user.address;

				console.log('프로필 페이지 랜딩 전 디버깅', userid, username, email, contact, address);

				res.render('profile', {
					userid,
					username,
					email,
					contact,
					address,
					image: user.image,
				});
			} else {
				res.render('login');
			}
		} catch (err) {
			console.error('메인 페이지 랜딩 에러', err);
		}
	}
};
//통합검색
exports.getSearch = async (req, res) => {
	const { searchWord } = req.query;
	console.log('searchWord', searchWord);
	const searchResult = await marketModel.find({
		subject: { $regex: searchWord, $options: 'i' },
	});
	// console.log(searchResult);
	res.render('search', { searchResult });
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
exports.getReviewPost = async (req, res) => {
	const token = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	if (!token || !refreshToken) {
		res.render('login');
	} else {
		try {
			const decodedjwt = await verifyToken(token, refreshToken);

			if (decodedjwt.token != undefined) {
				const user_id = decodedjwt.userid;

				const user = await userModel.findOne({ userid: user_id }).exec();

				const sellobject = await marketModel.find({ userid: user._id.toString() }).populate('userid');

				const buyobject = await marketModel.find({ buyer: decodedjwt.userid });

				console.log('user 정보', user.userid, user.nick, user.image);
				console.log('이미지 확인', typeof user.image);
				console.log('해당 유저 판매 목록', sellobject);
				console.log('해당 유저 구매 목록', buyobject);

				res.render('reviewPost', { userid: user.userid, usernickname: user.nick, image: user.image });
			} else {
				res.render('login');
			}
		} catch (err) {
			console.error('메인 페이지 랜딩 에러', err);
		}
	}
};
//받은 후기
exports.getReviewReceive = async (req, res) => {
	const token = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	if (!token || !refreshToken) {
		res.render('login');
	} else {
		try {
			const decodedjwt = await verifyToken(token, refreshToken);

			if (decodedjwt.token != undefined) {
				const user_id = decodedjwt.userid;

				const user = await userModel.findOne({ userid: user_id }).exec();

				const sellobject = await marketModel.find({ userid: user._id.toString() }).populate('userid');

				const buyobject = await marketModel.find({ buyer: decodedjwt.userid });

				console.log('user 정보', user.userid, user.nick, user.image);
				console.log('이미지 확인', typeof user.image);
				console.log('해당 유저 판매 목록', sellobject);
				console.log('해당 유저 구매 목록', buyobject);

				res.render('reviewReceive', { userid: user.userid, usernickname: user.nick, image: user.image });
			} else {
				res.render('login');
			}
		} catch (err) {
			console.error('메인 페이지 랜딩 에러', err);
		}
	}
};
exports.postRegister = async (req, res) => {
	try {
		const { userid, userpw, nickname, email, contact, address } = req.body;

		console.log({ userid, userpw, nickname, email, contact, address });

		const User_pw = hashPW(userpw);
		await userModel
			.create({
				userid: userid,
				pw: User_pw,
				nick: nickname,
				email: email,
				contact: contact,
				address: address,
				image: '',
			})
			.then((newUser) => {
				console.log(newUser);
				res.send(newUser);
			});
	} catch (err) {
		console.error('유저 생성 중 오류', err);
		if (err.code == 11000) {
			res.send({ existUser: true });
		} else {
			res.send({ existUser: false });
		}
	}
};

exports.postlogin = async (req, res) => {
	try {
		const { userid, userpw } = req.body;
		console.log(userid, userpw);
		const user = await userModel.findOne({ userid: userid }).exec();

		console.log('Users:', user);

		if (user) {
			const isPasswordMatch = comparePW(userpw, user.pw);
			console.log(isPasswordMatch);

			if (isPasswordMatch) {
				const token = makeToken(userid);
				const refreshToken = makeRefreshToken(userid);
				console.log('토큰 생성 정보', token, refreshToken);
				res.cookie('accessToken', token, {
					maxAge: 7200000,
					httpOnly: true,
					sameSite: 'lax'
				});
				res.cookie('refreshToken', refreshToken, {
					maxAge: 604800000,
					httpOnly: true,
					sameSite: 'lax'
				});
				res.send({ result: true });
			} else {
				res.send({ result: false });
			}
		} else {
			res.send({ result: false });
		}
	} catch (err) {
		console.error(err);
	}
};

exports.checklogin = async (req, res) => {
	const token = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	try {
		const chklogin = await loginCheck(token, refreshToken);

		console.log('login 정보 헤더 Response', chklogin);

		res.send(chklogin);
	} catch (err) {
		console.err('로그인 정보 확인 중 에러', err);
	}
};

exports.user_withdraw = async (req, res) => {
	try {
		const { userid, userpw } = req.body;

		const user = await userModel.findOne({ userid: userid }).exec();

		const isPasswordMatch = comparePW(userpw, user.pw);

		if (isPasswordMatch) {
			const result = await userModel.findOneAndDelete({ userid: userid });

			if (result) {
				console.log('사용자 탈퇴', userid);
				res.cookie('accessToken', '', { expires: new Date(0) });
				res.cookie('refreshToken', '', { expires: new Date(0) });
				res.send({ result: true });
			}
		} else {
			res.send({ result: false, msg: '비밀번호가 일치하지 않습니다.' });
		}
	} catch (err) {
		console.error('회원 탈퇴 중 에러', err);
	}
};

exports.userInfo_edit = async (req, res) => {
	const { userid, userpw, newpw, usernick, email, contact, addr } = req.body;
	const User = await userModel.findOne({ userid: userid });

	const isPasswordMatch = comparePW(userpw, User.pw);

	if (isPasswordMatch) {
		if (newpw == '') {
			const editUser = await userModel.updateOne(
				{ userid: userid },
				{
					nick: usernick,
					email: email,
					contact: contact,
					address: addr,
				}
			);
			console.log('비밀번호 변경 x', editUser);
			res.send({ result: true, msg: '회원 정보 수정 완료!' });
		} else {
			const newpass = hashPW(newpw);
			const editUser = await userModel.updateOne(
				{ userid: userid },
				{
					pw: newpass,
					nick: usernick,
					email: email,
					contact: contact,
					address: addr,
				}
			);
			console.log('비밀번호 변경 O', editUser);
			res.send({ result: true, msg: '회원 정보 수정 완료!' });
		}
	} else {
		res.send({ result: undefined, msg: '비밀번호가 일치하지 않습니다.' });
	}
};

exports.userInfo_edit_withImg = async (req, res) => {
	upload.array('image')(req, res, async (err) => {
		if (err) {
			console.error('Error uploading files:', err);
			return res.status(500).send('Error uploading files');
		}
		console.log('파일 등록 req', req.files[0].location, req.body);

		const { userid, userpw, newpw, usernick, email, contact, addr } = req.body;
		const imgUrl = req.files[0].location;
		const User = await userModel.findOne({ userid: userid });

		const isPasswordMatch = comparePW(userpw, User.pw);

		if (isPasswordMatch) {
			if (newpw == '') {
				const editUser = await userModel.updateOne(
					{ userid: userid },
					{
						nick: usernick,
						email: email,
						contact: contact,
						address: addr,
						image: imgUrl,
					}
				);
				console.log('비밀번호 변경 x', editUser);
				res.send({ result: true, msg: '회원 정보 수정 완료!' });
			} else {
				const newpass = hashPW(newpw);
				const editUser = await userModel.updateOne(
					{ userid: userid },
					{
						pw: newpass,
						nick: usernick,
						email: email,
						contact: contact,
						address: addr,
						image: imgUrl,
					}
				);
				console.log('비밀번호 변경 O', editUser);
				res.send({ result: true, msg: '회원 정보 수정 완료!' });
			}
		} else {
			res.send({
				result: undefined,
				msg: '비밀번호가 일치하지 않습니다.',
			});
		}
	});
};
