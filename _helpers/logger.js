/**
 * Create a log file and format for the REST API called.It contains debug, success, error message with datetime 
 *  1- UTC Date and Time
    2- Type of the log (eg: Info, Debug, Error)
    3- The file the log belongs to
    4- The event that occurred
    5- Additional data of an event
    6. Log data (data used to distinguish or group events that occurred for a particular request)
 */

const winston = require('winston')
dateFormat = () => {
    return new Date(Date.now()).toLocaleString()
}

class LoggerService {
    constructor(route) {
        this.logData = null
        this.route = route
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: `./logs/${route}.log`,
                    prettyPrint: true,
                    json: true
                }),
            ],
            format: winston.format.combine(
                winston.format.printf((info) => {
                let message = `${dateFormat()} | ${info.level.toUpperCase().normalize()} | [ ${route}.log ] | ${info.message} | `
                message = this.logData ? message + `requestData:${JSON.stringify(this.logData)} ` : message
                return message
            }),
            )
        });
        this.logger = logger
    }

    setLogData(log_data) {
        this.logData = log_data
    }
    async info(message) {
        this.logger.log('info', message);
    }
    async info(message, obj) {
        this.logger.log('info', message, {
            obj
        })
    }
    async debug(message) {
        this.logger.log('debug', message);
    }
    async debug(message, obj) {
        this.logger.log('debug', message, {
            obj
        })
    }
    async error(message) {
        this.logger.log('error', message);
    }
    async error(message, obj) {
        this.logger.log('error', message, {
            obj
        })
    }
}
module.exports = LoggerService
