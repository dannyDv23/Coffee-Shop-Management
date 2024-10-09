const express = require("express");
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
const reportRoutes = require("./routes/report.route");
const equipmentRouter = require("./routes/equipment.route");
const salesRouter = require("./routes/sales.route");

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const whiteList = config.whiteList ? config.whiteList.split(",") : [];
      if (!origin || whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })
);

app.use(cookieParser());
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
rootRouter.use("/sales", salesRouter);
rootRouter.use("/employee", auth(["Admin"]), manageEmployeeRouter);
rootRouter.use("/report", reportRoutes);// Report routes 

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
