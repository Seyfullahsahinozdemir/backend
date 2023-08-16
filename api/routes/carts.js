var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  getCartItems,
  addCartItem,
  deleteCartItem,
  clearCart,
  increaseCartItemByOne,
  decreaseCartItemByOne,
} = require("../controllers/carts");

const checkCartMiddleware = require("../lib/cart");

router.all(
  "*",
  authLib.authenticate(),
  checkCartMiddleware,
  (req, res, next) => {
    next();
  }
);
router.get("/", getCartItems);
router.post("/", addCartItem);
router.delete("/", clearCart);

router.put("/products/:id", increaseCartItemByOne);
router.put("/products/:id", decreaseCartItemByOne);
router.delete("/products/:id", deleteCartItem);

module.exports = router;
