const express = require("express");
const app = express();
const morgan = require("./config/morgan");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const { errorHandler, errorConverter } = require("./middlewares/error");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const authRouter = require("./routes/auth.roure");
const equipmentRouter = require("./routes/equipment.route");
const cors = require("cors");
const config = require("./config/config");

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// CORS
app.use(
  cors({
    origin: "http://localhost:4000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//jwt authentication
app.use(passport.initialize());
passport.use(jwtStrategy);

// root Route
const rootRouter = express.Router();
app.use(`/${config.rootRoute}`, rootRouter);

// routes
rootRouter.use(express.json());
rootRouter.use("/auth", authRouter);
rootRouter.use("/equipments", equipmentRouter);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
