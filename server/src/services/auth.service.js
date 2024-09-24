const { employeeService, authS } = require("./employee.service");
const tokenService = require("./token.service");
const httpStatus = require("http-status");
const ApiError = require("./../utils/ApiError");
const { tokenTypes } = require("./../config/tokens");
const Auth = require("../models/auth");
const login = async (username, password) => {
  const auth = await Auth.findOne({ username: username });
  if (!auth || !(await auth.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return auth;
};

const refreshAuthToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user.id);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

module.exports = {
  login,
  refreshAuthToken,
};
