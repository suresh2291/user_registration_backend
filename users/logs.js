const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    loginDate:{type:Date, default:Date.now},
    logoutDate:{type:Date, default:Date.now},
    ipaddress: { type: String , default:null}
}, { collection: 'seessionlogs'});

schema.set('toJSON', { virtuals: true });

module.exports = Logs = mongoose.model('logs', schema)
