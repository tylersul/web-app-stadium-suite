const Joi = require('joi');

module.exports.stadiumJoiSchema = Joi.object({
    stadium: Joi.object({
        name: Joi.string().required(),
        avgPrice: Joi.number().required().min(0),
        description: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});

module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});