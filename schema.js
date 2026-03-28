const Joi = require('joi');
module.exports.listingSchema=Joi.object({  //joi ke liye schema ek object type ka hi rahta
listings: Joi.object({             // schema kis ka hai wo bhi ek object hi hoga
    title:Joi.string().required(), // listing object ke andar ke fields/parameters hai ye sab 
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(0),
    image:Joi.string().allow("",null),
}).required()
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required().max(200)
    }).required()
})