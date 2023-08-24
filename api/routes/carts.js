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
  getTotalPrice,
  updateCartItemQuantity,
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

router.put("/products/increase/:id", increaseCartItemByOne);
router.put("/products/decrease/:id", decreaseCartItemByOne);
router.delete("/products/:id", deleteCartItem);
router.put("/products/:id", updateCartItemQuantity)

//router.put("/menus/:id", increaseMenuCartItemByOne);
//router.put("/menus/:id", decreaseMenuCartItemByOne);
//router.delete("/menus/:id", deleteMenuCartItem);

router.get("/totalPrice", getTotalPrice);

module.exports = router;
