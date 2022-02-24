const express = require("express");
var app = express();
const createError = require(`http-errors`);
var cookieParser = require("cookie-parser");
const logger = require("./config/logger");
const httpLogger = require("./config/httpLogger");
const helmet = require("helmet");

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
  const errorType = createError.isHttpError(err);
  if (!errorType) {
    console.log(`Programatic Error, Shutting down due to ${err.stack}`);
    process.exit(1);
  }

  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT || 3000, () => {
  logger.info("listening on port 3000");
});
