const Joi = require('@hapi/joi');

module.exports = {
    FollowUser: () => {
        return Joi.object({
            id: Joi.number().required()
                .messages({
                    'number.base': 'Id must be a number',
                    'number.empty': 'Id is required',
                    'any.required': 'Id is required'    
                })
        })
    },

    UnfollowUser: () => {
        return Joi.object({
            id: Joi.number().required()
                .messages({
                    'number.base': 'Id must be a number',
                    'number.empty': 'Id is required',
                    'any.required': 'Id is required'    
                })
        })
    }
}