const express = require("express");
const app = express();
const morgan = require("./config/morgan");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const {errorHandler, errorConverter} = require("./middlewares/error");
const passport = require("passport");
const {jwtStrategy} = require("./config/passport");
const cors = require("cors");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const {auth} = require("./middlewares/auth");

// define routes
const authRouter = require("./routes/auth.route");
const tableRouter = require("./routes/table.route");
const manageEmployeeRouter = require("./routes/employee.route");
const menuRouter = require("./routes/menu.route");
const materialRouter = require("./routes/material.route");
const reportRoutes = require("./routes/report.route"); //report
const equipmentRouter = require("./routes/equipment.route");
const salesRouter = require("./routes/sales.route");
const BudgetRouter = require("./routes/budget.route"); //budget
const ExpenseRouter = require("./routes/addExpenses.route"); //expense
const BackupRouter = require("./routes/backupData.route"); //backup
const orderRouter = require("./routes/order.route");
const bookingRouter = require("./routes/booking.route");
const productRouter = require("./routes/product.route");
const profileRouter = require("./routes/whoami.route");

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

// parse json request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// root Route
const rootRouter = express.Router();
app.use(`/${config.rootRoute}`, rootRouter);

// routes
rootRouter.use(express.json());
rootRouter.use("/auth", authRouter);
rootRouter.use("/equipments", equipmentRouter);
rootRouter.use("/sales", salesRouter);
rootRouter.use("/employee", manageEmployeeRouter);
rootRouter.use("/menu", menuRouter);
rootRouter.use("/material", materialRouter);
rootRouter.use("/report", reportRoutes); // Report routes
rootRouter.use("/table", tableRouter);
rootRouter.use("/budget", BudgetRouter); // Budget routes
rootRouter.use("/expenses", ExpenseRouter); // Expense routes
rootRouter.use("/backup", BackupRouter); //Backup routes
rootRouter.use("/order", orderRouter);
rootRouter.use("/booking", bookingRouter);
rootRouter.use("/product", productRouter);
rootRouter.use("/profile", profileRouter);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
