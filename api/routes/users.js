var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth");

const { register, login } = require("../controllers/users");

router.post("/register", register);
router.post("/login", login);

// router.all("*", authLib.authenticate(), (req, res, next) => {
//   next();
// });

module.exports = router;
