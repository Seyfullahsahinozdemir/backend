const Sequelize = require("sequelize");
const sequelize = require("../Database");

const Category = require("./Category");

const Product = sequelize.define("product", {
  name: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
});

module.exports = Product;
