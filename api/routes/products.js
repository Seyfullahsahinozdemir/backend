var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getByCategoryId,
} = require("../controllers/products");

router.get("/", getProducts);
router.post("/getByCategoryId", getByCategoryId);
router.all("*", authLib.authenticate(), (req, res, next) => {
  next();
});

router.post("/", authLib.isAdmin(), addProduct);
router.put("/:id", authLib.isAdmin(), updateProduct);
router.delete("/:id", authLib.isAdmin(), deleteProduct);

module.exports = router;
