const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const config = require("../config");
const CustomError = require("./Error");
const { HTTP_CODES } = require("../config/Enum");

module.exports = function () {
  let strategy = new Strategy(
    {
      secretOrKey: config.JWT.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        let user = await Users.findOne({ where: { id: payload.id } });

        if (user) {
          done(null, {
            id: user.id,
            isAdmin: user.isAdmin,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            exp: parseInt(Date.now() / 1000) * config.JWT,
          });
        } else {
          done(new Error("User Not Found", null));
        }
      } catch (error) {
        done(error, null);
      }
    }
  );

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", { session: false });
    },
    isAdmin: () => {
      return (req, res, next) => {
        const user = req.user;

        if (!user.isAdmin) {
          let response = Response.errorResponse(
            new CustomError(
              HTTP_CODES.UNAUTHORIZED,
              "Need Permission",
              "Need Permission"
            )
          );
          return res.status(response.code).json(response);
        }

        return next(); // admin
      };
    },
  };
};
