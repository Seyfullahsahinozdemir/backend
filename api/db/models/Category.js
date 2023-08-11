const Sequelize = require("sequelize");
const sequelize = require("../Database");

const Category = sequelize.define("category", {
  name: Sequelize.STRING,
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Category;
