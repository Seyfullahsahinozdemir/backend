const Sequelize = require("sequelize");
const sequelize = require("../Database");
const User = require("./Users");
const CartItem = require("./CartItem");

const Cart = sequelize.define("cart", {});

module.exports = Cart;
