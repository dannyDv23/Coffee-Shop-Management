const mongoose = require("mongoose");
const http = require("http");
const config = require("./src/config/config");
const app = require("./src/server");
const logger = require("./src/config/logger");
const createInitialData = require('./src/database/initDb');

mongoose
  .connect(config.dbConnection)
  .then(() => {
    // createInitialData();
    logger.info("Database connected");
  })
  .catch((error) => {
    logger.error(error);
  });

const httpServer = http.createServer(app);
const server = httpServer.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unExpectedErrorHandler);
process.on("unhandledRejection", unExpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
