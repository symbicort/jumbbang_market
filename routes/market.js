const express = require("express");
const router = express.Router();

const controller = require("../controller/Cmarket");

router.get("/market", controller.market);
router.get("/marketsort", controller.marketsort);
router.get("/articles/:id", controller.getView);
router.get("/market/write", controller.getWrite);

router.post("/market/write", controller.addPost);
router.post("/market/bid", controller.enterbid);

module.exports = router;
