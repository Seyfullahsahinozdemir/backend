const Sequelize = require("sequelize");
const sequelize = require("../Database");
const User = require("./Users");

const Address = sequelize.define("address", {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Address;
