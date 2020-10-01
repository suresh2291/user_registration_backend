const config = require('config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const UserModel = require('../users/user.model')
var ipadress = require('../ipddress')
const Logger = require('../_helpers/logger')
module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAuditUsers,
    sessions
};

async function authenticate({ username, password }) {
    let logger = new Logger('authentic')
    const user = await User.findOne({ username });  
    logger.info(`authecticate user ${user}`)
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        logger.info(`authecticate token ${token}`)
        return {
            ...userWithoutHash,
            token
        };
    }
}



async function getAll() {
    return await User.find().select('-hash');
}

async function sessions(data) {
let logger = new Logger('sessions')  
UserModel.findByIdAndUpdate({_id:data}, { logoutDate: new Date() }, 
                             (err, docs)=> { 
    if (err){ 
        logger.error(`session error ${err}`) 
    } 
    else{ 
        logger.info(`session created ${docs}`)
        return docs
    } 
})
}
async function getAuditUsers(queryData) {
    //console.log('quesry',queryData)
    
    if(queryData === 'auditor'){
        return await User.find({role:queryData}).select({
            '-hash':true,
        'loginDate':1, 
        "logoutDate":1, 
        "ipaddress":1
    });
    }
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

 async function create(userParam) {
    let logger = new Logger('register')  
    logger.info(`getting user data from UI ${userParam}`)
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    logger.info(`hash password ${user.hash}, ${ipadress}`)
    await UserModel.create({
        firstName:userParam.firstName,
        lastName:userParam.lastName,
        username:userParam.username,
        role:userParam.role,
        ipaddress:ipadress,
        hash:bcrypt.hashSync(userParam.password, 10)

    })
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}