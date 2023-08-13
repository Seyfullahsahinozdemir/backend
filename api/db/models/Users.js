const Sequelize = require("sequelize");
const sequelize = require("../Database");
const Address = require("./Addresses");
const Cart = require("./Cart");
const Order = require("./Order");

const User = sequelize.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  birthDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
