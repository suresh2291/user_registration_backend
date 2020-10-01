const config = require('config.js');
const mongoose = require('mongoose');
const Logger = require('../_helpers/logger'),
logger = new Logger('database')
logger.info(`database URI ${config}`)
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true })
        .then(()=>console.log('connected to db'));
mongoose.Promise = global.Promise;
logger.info(`database URI ${mongoose}`)
module.exports = {
    User: require('../users/user.model'),
    mongoose
};