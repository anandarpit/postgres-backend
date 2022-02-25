const Joi = require("@hapi/joi");

module.exports = {
  CreatePost: () => {
    return Joi.object({
      title: Joi.string().min(3).required().messages({
        "string.base": `Title Should be a type of 'text'`,
        "string.empty": `Title Cannot be an empty field`,
        "string.min": `Title Should have a minimum length of {#limit}`,
        "any.required": `Title is Required!`,
      }),
      description: Joi.string().min(3).messages({
        "string.base": `Description Should be a type of 'text'`,
      }),
    });
  },

  DeletePost: () => {
    return Joi.object({
      postId: Joi.number().required().messages({
        "number.base": `PostId must be a number`,
        "number.empty": `PostId is required`,
        "any.required": `PostId is required`,
      }),
    });
  },
  LikePost: () => {
    return Joi.object({
      postId: Joi.number().required().messages({
        "number.base": `PostId must be a number`,
        "number.empty": `PostId is required`,
        "any.required": `PostId is required`,
      }),
    });
  },
  UnlikePost: () => {
    return Joi.object({
      postId: Joi.number().required().messages({
        "number.base": `PostId must be a number`,
        "number.empty": `PostId is required`,
        "any.required": `PostId is required`,
      }),
    });
  },
  AddComment: () => {
    return Joi.object({
      postId: Joi.number().required().messages({
        "number.base": `PostId must be a number`,
        "number.empty": `PostId is required`,
        "any.required": `PostId is required`,
      }),
      comment: Joi.string().min(3).required().messages({
        "string.base": `Comment Should be a type of 'text'`,
        "string.empty": `Comment Cannot be an empty field`,
        "string.min": `Comment Should have a minimum length of {#limit}`,
        "any.required": `Comment is Required!`,
      }),
    });
  },
};
