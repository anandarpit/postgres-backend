const winston = require('winston');
const colorizer = winston.format.colorize();

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'dev'
  const isDevelopment = env === 'dev'
  return isDevelopment ? 'debug' : 'warn'
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)
const format = winston.format.combine(
  winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
  winston.format.simple(),
  winston.format.printf(msg => 
    colorizer.colorize(msg.level, `${msg.timestamp} - [${msg.level}] : ${msg.message}`)
  )
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
]

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

module.exports = Logger