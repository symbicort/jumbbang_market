const marketModel = require('../model/market');
const userModel = require('../model/user');
const {postUpload} = require('../utils/imgUploader');
const jwt = require('jsonwebtoken');

const {verifyToken } = require('../utils/token')

exports.market = async (req, res) => {
    marketModel.find().populate('user_info')
    .exec()
    .then((result) => {
        console.log('DB 정보 추출', result);
        res.render('market', {postData: result});
    }).catch((error) => {
        console.error('Error finding data:', error);
    });
};

exports.getView = async (req, res) => {
	const postId = req.params.id;

	marketModel.findById(postId).exec()
	.then((result) => {
		// 결과를 처리하는 로직
		res.render('marketView', {postdata: result})
		console.log(result);
	}).catch((err) => {
	// 에러를 처리하는 로직
	console.error(err);
});
};

exports.getWrite = async (req, res) => {

	const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(!token){
		res.render('login');
    } else{
        try{
            const decodedjwt = await verifyToken(token, refreshToken) ;

            if(decodedjwt.token != undefined){
                res.render('marketWrite', {userid: decodedjwt.userid});
            } else{
                res.render('login');
            }
            
        } catch(err) {
            console.error('메인 페이지 랜딩 에러', err);
        }
    }
};

exports.addPost = async (req, res) => {
    // upload.array('files')를 사용하여 'files'라는 필드명으로 전송된 파일들을 처리
    postUpload.array('files')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }   
        console.log(req.files.length);
        console.log(req.body);

        let images = [];

        for (let i = 0; i < req.files.length; i++) {
            images.push(req.files[i].location)
        }
        
        console.log(images);

        const {subject, comment, category, state, priceFirst, priceDirect, dateLimit} = req.body

        console.log('글 작성 정보', subject, comment, state, priceFirst, priceDirect, dateLimit)
        
		const token = req.cookies.accessToken;
		console.log('글 작성 시 토큰', token);
        const decodedjwt = jwt.verify(token, process.env.JWT_ACCESS_KEY);
		console.log('유저 정보', decodedjwt.userId)
        const userId = decodedjwt.userId;

        const date = new Date();

        await marketModel.create({
            userid: userId, 
            category: category,
            state: state,
            subject: subject,
            content: comment,
            priceFirst: priceFirst,
            priceLast: priceFirst,
            priceDirect: priceDirect,
            dateLimit: dateLimit,
            images: images,
        }).then((res) => {
            console.log(userId,'이미지 등록 결과', res)
        })
        return res.status(200).json({ message: 'Upload successful' });
    });
};