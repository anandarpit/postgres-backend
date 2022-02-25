const Joi = require('@hapi/joi');

module.exports = {
    CreateUser: () => {
        return Joi.object({
            "name": Joi.string().required()
                .messages({
                    'string.empty': 'Name is required',
                    'any.required': 'Name is required'
                }),
            "email": Joi.string().email().required()
                .messages({
                    'string.email': 'Email must be a valid email address',
                    'string.empty': 'Email is required',
                    'any.required': 'Email is required'
                }),
            "username": Joi.string().required()
                .messages({
                    'string.empty': 'Username is required',
                    'any.required': 'Username is required'
                }),
            "password": Joi.string().min(4).required()
                .messages({
                    "string.base": `Password Should be a type of 'text'`,
                    "string.empty": `Password Cannot be an empty field`, 
                    "string.min": `Password Should have a minimum length of {#limit}`,
                    "any.required": `Password is Required!`
                })
        })
    },
}