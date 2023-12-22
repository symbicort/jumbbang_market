const marketModel = require('../model/market');
const {postUpload, deleteProfileImg} = require('../utils/imgUploader');
const jwt = require('jsonwebtoken');

const {verifyToken } = require('../utils/token')

exports.market = async (req, res) => {
    marketModel.find()
    .exec()
    .then((result) => {
        console.log('Found data:', {postData: result});
        res.render('market', {postData: result});
    }).catch((error) => {
        console.error('Error finding data:', error);
});
};

exports.getView = (req, res) => {
	res.render('marketView');
};

exports.getWrite = (req, res) => {
	res.render('marketWrite');
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