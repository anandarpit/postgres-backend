const cors = require('cors');
const express = require("express");
require('dotenv').config();
var app = express();
const createError = require(`http-errors`);
var cookieParser = require("cookie-parser");
const logger = require("./config/logger");
const httpLogger = require("./config/httpLogger");
const helmet = require("helmet");

app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
app.options(
  "*",
  cors({ origin: true, optionsSuccessStatus: 200, credentials: true })
);

app.use(helmet());
app.use(httpLogger);

app.use(cookieParser());
app.use(express.json()); //this is needed to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", require("./routes"));

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

//Error Handler
app.use((err, req, res, next) => {
  logger.error(err);
  if (!isOperational(err)) {
    logger.error(`shutting down due to ${err.stack}`);
    process.exit(1);
  } else {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  }
});

isOperational = (err) => {
  const errorType = createError.isHttpError(err);

  if (errorType || err.isJoi) return true;
  else return false;
};


//Exposing port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
});
