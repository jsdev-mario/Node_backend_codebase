const userModel = require('../models/user');
const constants = require('../utils/constants')
const utils = require('../utils');

exports.register = async (req, res, next) => {

    try {

        let user = await userModel.findOne({
            email: req.body.email.toLowerCase()
        })
        if (user) {
            return res.status(409).json({
                message: "Account exists already"
            })
        }

        user = await userModel.create(req.body)
        const token = utils.generateToken(user);

        return res.status(200).json({
            data: user,
            token: token
        })

    } catch (error) {

        next(error)
    }
}

exports.login = async (req, res, next) => {

    try {

        let user = {}

        if (req.body.account_type === constants.ACCOUNT_TYPE.STANDARD) {

            user = await userModel.findOne({
                email: req.body.email.toLowerCase()
            }).select('+password')

            if (user && !user.comparePassword(req.body.password)) {
                return res.status(403).json({
                    message: 'Incorrect password. Please check again.'
                })
            }
        } else {

            user = await userModel.findOne({
                social_id: req.body.social_id
            })
        }

        if (!user) {
            return res.status(403).json({
                message: 'User does\'nt exist. Please register.'
            })
        }

        const token = utils.generateToken(user);

        return res.status(200).json({
            data: user,
            token: token
        })

    } catch (error) {

        next(error)
    }
}

exports.read = async (req, res, next) => {

    try {

        const user = await userModel.findById(req.params.id)

        return res.status(200).json(user)

    } catch (error) {
        
        next(error)
    }
}

exports.retrieve = async (req, res, next) => {

    try {

        const query = {}

        let sort_query = null

        if (req.query.sort_by) {

            sort_query = {}
            const sort_by_fields = req.query.sort_by.split(',').map(field => field.trim())
            let order_by_values = sort_by_fields.map(() => 'asc')

            if (req.query.order_by) {

                order_by_values = req.query.order_by.split(',').map(value => value.trim())
                if (sort_by_fields.length > order_by_values.length) {
                    order_by_values = sort_by_fields.map((field, index) => order_by_values[index] || 'asc')
                }
            }

            sort_by_fields.forEach((key, index) => {
                sort_query[key] = order_by_values[index]
            })
            
            delete req.query.sort_by
            delete req.query.order_by
        }

        const skip = Number(req.query.offset) || 0
        const limit = Number(req.query.limit) || 0
        delete req.query.offset
        delete req.query.limit

        let or_keys = []

        Object.keys(req.query).forEach(key => {
            if (key.includes('.')) {

                range_keys = key.split('.').map(rk => rk.trim())
                range_primary_key = range_keys.slice(0, range_keys.length - 1).join('.')
                range_secondary_key = range_keys[range_keys.length - 1]

                if (range_secondary_key === 'or') {
                    or_keys.push({key: key, primary: range_primary_key})
                }else{
                    query[range_primary_key] = query[range_primary_key] || {}
                    query[range_primary_key][`$${range_secondary_key}`] = Number(req.query[key]) ? Number(req.query[key]) : req.query[key]
                }
            }else{
                query[key] =  req.query[key]
            }
        })

        if (or_keys.length > 0) {

            query['$and'] = or_keys.map(or_key => {
                const or_query = {
                    $or: req.query[or_key.key].split(',').map(v => v.trim()).map(v => {

                        const sub_query = {}
                        sub_query[or_key.primary] = Number(v) ? Number(v) : v
                        return sub_query
                    })
                }
                return or_query
            })
        }

        const users = await userModel.find(query).skip(skip).limit(limit).sort(sort_query)

        return res.status(200).json(users)

    } catch (error) {

        next(error)
    }
}

exports.update = async (req, res, next) => {

    try {

        const user = await userModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true
        })

        if (!user) {
            return res.status(403).json({
                message: 'User does\'nt exist. Please register.'
            })
        }

        return res.status(200).json({
            data: user,
            message: 'User profile has been updated'
        })

    } catch (error) {

        next(error)
    }
}

exports.delete = async (req, res, next) => {

    try {

        await userModel.findOneAndRemove({ _id: req.params.id })

        return res.status(200).json({ 
            message: 'User has been deleted'
        })

    } catch (error) {

        next(error)
    }
}