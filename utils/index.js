const jwt = require('jsonwebtoken');
const constants = require('./constants');


exports.generateToken = function (user){

    const token = jwt.sign({ id: user._id.toString() }, constants.SECRET, { expiresIn: '7d' })
    return token;
}