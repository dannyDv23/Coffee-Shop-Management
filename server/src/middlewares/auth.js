const ApiError = require("./../utils/ApiError");
const httpStatus = require("http-status");

const verifyCallBack = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  if (typeof user.then === "function") {
    user = await user;
  }
  req.user = user;
  resolve();
};

const passport = require("passport");

const auth =
  (roles = []) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallBack(req, resolve, reject)
      )(req, res, next);
    })
      .then(() => {
        const userRole = req.user.role;

        if (!roles.includes(userRole)) {
          return next(
            new ApiError(
              httpStatus.FORBIDDEN,
              "Forbidden, you don't have permission"
            )
          );
        }

        req.role = userRole;
        next();
      })
      .catch((error) => next(error));
  };

module.exports = {
  auth,
};
