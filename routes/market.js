const express = require('express');
const router = express.Router();

const controller = require('../controller/Cmarket');

router.get('/market', controller.market);
router.get('/articles/:id', controller.getView);
router.get('/market/write', controller.getWrite);

router.post('/market/write', controller.addPost);

module.exports = router;
