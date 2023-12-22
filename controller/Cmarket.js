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
