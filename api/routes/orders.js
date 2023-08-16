var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  getPastOrders,
  getOrderDetailById,
  completeOrder,
  reOrder,
} = require("../controllers/orders");

const checkCartMiddleware = require("../lib/cart");

router.all("*", authLib.authenticate(), (req, res, next) => {
  next();
});

router.get("/", getPastOrders);
router.get("/:id", getOrderDetailById);

router.post("/", checkCartMiddleware, completeOrder);
router.post("/:id", reOrder);

module.exports = router;
