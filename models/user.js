const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const constants = require('../utils/constants')


const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        select: false
    },

    social_id: {
        type: String,
    },

    account_type: {
        type: String,
        default: constants.ACCOUNT_TYPE.STANDARD
    }

}, {
    
    versionKey: false,
    timestamps: true,
});

userSchema.pre('save', function(next) {

    if (this.password) {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    next();
});

userSchema.pre('findOneAndUpdate', function(next) {

    if (this._update.password) {
        this._update.password = bcrypt.hashSync(this._update.password, 10);
    }

    next();
});

userSchema.methods.comparePassword = function(password) {
    
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("user", userSchema);