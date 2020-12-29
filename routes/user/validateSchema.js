const Joi = require('joi');

exports.read = {

    params: Joi.object({
        id: Joi.string().required().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24),
    })
}

exports.retrieve = {    

    query: Joi.object({
        email: Joi.string().email(),
        offset: Joi.number(),
        limit: Joi.number(),
        sort_by: Joi.string(),
        order_by: Joi.string(),
        "createdAt.gte": Joi.string(),
        "createdAt.lte":Joi.string(),
        "email.ne":Joi.string(),
        "account_type.ne":Joi.string(),
        "email.or":Joi.string(),
        "account_type.or":Joi.string(),
    })
}

exports.update = {

    params: Joi.object({
        id: Joi.string().required().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24),
    }),

    body: Joi.object({
        email: Joi.string().email(),
    })
}

exports.delete = {
    
    params: Joi.object({
        id: Joi.string().required().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24),
    })
}