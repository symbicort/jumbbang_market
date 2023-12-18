//const Comment = require('../models/Cproduct');

exports.market = (req, res) => {
	res.render('market');
};

exports.getView = (req, res) => {
	res.render('marketView');
};

exports.getWrite = (req, res) => {
	res.render('marketWrite');
};
