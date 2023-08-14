var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

router.get("/", getProducts);
router.all("*", authLib.authenticate(), (req, res, next) => {
  next();
});

// Address End Points
router.post("/", authLib.isAdmin(), addProduct);
router.put("/:id", authLib.isAdmin(), updateProduct);
router.delete("/:id", authLib.isAdmin(), deleteProduct);

module.exports = router;
