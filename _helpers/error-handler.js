module.exports = errorHandler;
const Logger = require('../_helpers/logger'),
logger = new Logger('errors')
function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        logger.error(`500 error ${err}`)
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        logger.error(`500 error ${err}`)
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        logger.error(`500 error ${err}`)
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    logger.error(`500 error ${err}`)
    return res.status(500).json({ message: err.message });
}