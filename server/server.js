const express = require('express');
const app = express();
const morgan = require('./config/morgan');
const httpStatus = require('http-status');
const ApiError = require('./utils/ApiError');
const { errorHandler, errorConverter } = require('./middlewares/error');

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(express.json());

// routes

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;