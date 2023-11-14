const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf, json } = format;

const DEV_LOGGER_PATH = process.env.DEV_LOGGER_PATH || 'src/logger/logger_dev.log';
const PROD_LOGGER_PATH = process.env.PROD_LOGGER_PATH || 'src/logger/logger_prod.log';

// Define log levels for prod and dev, log file max size
// And number of backup log files to keep
const DEV_LOG_LEVEL = 'debug';
const MAX_LOG_SIZE = 10485760;
const BACKUP_TO_KEEP = 3;
const PROD_LOG_LEVEL = 'info';

// custom format for dev
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
	level: process.env.NODE_ENV === 'production' ? PROD_LOG_LEVEL : DEV_LOG_LEVEL,
	format: combine(
    	timestamp(),
    	format.errors({ stack: true }),
    	logFormat
	),
	transports: [
    	new transports.Console({
		level: DEV_LOG_LEVEL,
	format: combine(
        timestamp(),
        format.colorize(),
        logFormat
		),
    }),
    new transports.File({
	filename: process.env.NODE_ENV === 'production' ? PROD_LOGGER_PATH : DEV_LOGGER_PATH,
	level: process.env.NODE_ENV === 'production' ? PROD_LOG_LEVEL : DEV_LOG_LEVEL,
	format: combine(
		timestamp(),
		logFormat
      ),
		maxsize: MAX_LOG_SIZE, // limit log file to 10 MB 
		maxFiles: BACKUP_TO_KEEP,       // limit backup log files to 3
    }),
  ],
});

// Log format for PRODUCTION: JSON
if (process.env.NODE_ENV === 'production') {
	logger.add(
	new transports.File({
		filename: PROD_LOGGER_PATH,
		level: PROD_LOG_LEVEL,
		format: combine(
			timestamp(),
			json()
		),
		maxsize: MAX_LOG_SIZE, // limit log file to 10 MB 
		maxFiles: BACKUP_TO_KEEP,       // limit backup log files to 3
		})
	);
}

module.exports = logger;
