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

const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallBack(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => {
      req.role = req.user.role;
      next();
    })
    .catch((error) => next(error));
};

const roleFilter = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req, res, next) => {
    if (roles.length > 0 && !roles.includes(req.role)) {
      return next(
        new ApiError(httpStatus.FORBIDDEN, "Forbidden! Role not allowed")
      );
    }
    return next();
  };
};

module.exports = {
  auth,
  roleFilter,
};
