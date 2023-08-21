var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  addMenu,
  getMenus,
  updateMenu,
  deleteMenu,
} = require("../controllers/menus");

router.get("/", getMenus);
router.all("*", authLib.authenticate(), (req, res, next) => {
  next();
});

router.post("/", authLib.isAdmin(), addMenu);
router.put("/:id", authLib.isAdmin(), updateMenu);
router.delete("/:id", authLib.isAdmin(), deleteMenu);

module.exports = router;
