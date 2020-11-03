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
