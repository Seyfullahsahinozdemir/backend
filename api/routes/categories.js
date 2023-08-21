var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

router.get("/", getCategories);
router.all("*", authLib.authenticate(), (req, res, next) => {
  next();
});

router.post("/", authLib.isAdmin(), addCategory);
router.put("/:id", authLib.isAdmin(), updateCategory);
router.delete("/:id", authLib.isAdmin(), deleteCategory);

module.exports = router;
