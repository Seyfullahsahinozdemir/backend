const Sequelize = require("sequelize");
const sequelize = require("../Database");
const User = require("./Users");
const OrderItem = require("./OrderItem");

const Order = sequelize.define("order", {});

module.exports = Order;
