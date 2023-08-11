const Sequelize = require("sequelize");
const sequelize = require("../Database");

const Product = require("./Product");
const Order = require("./Order");

const OrderItem = sequelize.define("orderItem", {
  quantity: Sequelize.INTEGER,
  price: Sequelize.DOUBLE,
});

module.exports = OrderItem;
