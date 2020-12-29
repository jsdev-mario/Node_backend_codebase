const Joi = require('joi');
const constants = require('../../utils/constants')

exports.register = {

    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().when('account_type', {is: constants.ACCOUNT_TYPE.STANDARD, then: Joi.required()}),
        social_id: Joi.string().when('account_type', {is: constants.ACCOUNT_TYPE.SOCIAL, then: Joi.required()}),
        account_type: Joi.string().required()
    })
}

exports.login = {

    body: Joi.object({
        email: Joi.string().email().when('account_type', {is: constants.ACCOUNT_TYPE.STANDARD, then: Joi.required()}),
        password: Joi.string().when('account_type', {is: constants.ACCOUNT_TYPE.STANDARD, then: Joi.required()}),
        social_id: Joi.string().when('account_type', {is: constants.ACCOUNT_TYPE.SOCIAL, then: Joi.required()}),
        account_type: Joi.string().required()
    })
}
