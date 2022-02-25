const Joi = require('@hapi/joi');

module.exports = {
    authenticate: () => {
        return Joi.object({
            email: Joi.string().email().required()
            .messages({
                'string.email': 'Email must be a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
            password: Joi.string().min(4).required()
            .messages({
                "string.base": `Password Should be a type of 'text'`,
                "string.empty": `Password Cannot be an empty field`,
                "string.min": `Password Should have a minimum length of {#limit}`,
                "any.required": `Password is Required!`,"string.base": `Password Should be a type of 'text'`,
              })
        })
    }
}