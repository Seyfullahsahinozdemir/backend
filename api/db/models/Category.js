const Sequelize = require("sequelize");
const sequelize = require("../Database");

const Category = sequelize.define("category", {
  name: {
    type: Sequelize.STRING,
    unique: true,
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

module.exports = Category;
