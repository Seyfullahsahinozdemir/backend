const Sequelize = require("sequelize");

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
} = require("../config");

console.log(DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DIALECT);

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
});

module.exports = sequelize;
