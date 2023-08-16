const Sequelize = require("sequelize");
const sequelize = require("../Database");
const User = require("./Users");
const OrderItem = require("./OrderItem");

const Order = sequelize.define("order", {
  totalPrice: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = Order;
