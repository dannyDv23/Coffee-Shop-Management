const express = require('express');
const app = express();
const morgan = require("./config/morgan");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const { errorHandler, errorConverter } = require("./middlewares/error");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const cors = require("cors");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const { auth } = require("./middlewares/auth");

// define routes
const authRouter = require("./routes/auth.roure");
const manageEmployeeRouter = require("./routes/employee.route");
const materialRouter = require("./routes/material.route");

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

//jwt authentication
app.use(passport.initialize());
passport.use(jwtStrategy);

// routes
rootRouter.use(express.json());
rootRouter.use("/auth", authRouter);
rootRouter.use("/employee", auth(["Admin"]), manageEmployeeRouter);
rootRouter.use("/material", materialRouter);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;