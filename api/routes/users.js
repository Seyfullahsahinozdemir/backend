var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  register,
  login,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/users");

router.post("/register", register);
router.post("/login", login);

router.all("*", authLib.authenticate(), (req, res, next) => {
  next();
});

// Address End Points
router.get("/address", getAddresses);
router.post("/address", addAddress);
router.put("/address/:id", updateAddress);
router.delete("/address/:id", deleteAddress);

module.exports = router;
