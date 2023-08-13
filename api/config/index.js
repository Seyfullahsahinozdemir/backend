module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  PORT: process.env.PORT || "3000",
  JWT: {
    SECRET: process.env.SECRET_KEY,
    EXPIRE_TIME: !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME))
      ? parseInt(process.env.TOKEN_EXPIRE_TIME)
      : 24 * 60 * 60,
  },
  DEFAULT_LANG: process.env.DEFAULT_LANG || "EN",
};
