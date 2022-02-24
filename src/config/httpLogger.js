const morgan = require('morgan');
const StreamOptions = require('morgan')

const Logger = require('./logger.js');

const stream = {
  write: (message) => Logger.http(message),
}

const skip = () => {
  const env = process.env.NODE_ENV || "dev";
  return env !== "dev";
};

const httpLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

module.exports = httpLogger;