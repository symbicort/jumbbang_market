const express = require('express');
const router = express.Router();

const controller = require('../controller/Cmarket');

router.get('/market', controller.market);
router.get('/articles/:id', controller.getView);
router.get('/write', controller.getWrite);

module.exports = router;
