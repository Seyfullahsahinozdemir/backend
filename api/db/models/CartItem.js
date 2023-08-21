const Sequelize = require("sequelize");
const sequelize = require("../Database");

const Product = require("./Product");
const Cart = require("./Cart");

const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: Sequelize.INTEGER,
  productId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  menuId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

module.exports = CartItem;
