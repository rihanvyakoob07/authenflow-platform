
const Joi = require('joi');

// Register validation schema
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin')
  });
  return schema.validate(data);
};

// Login validation schema
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

// Product validation schema
const productValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    inStock: Joi.boolean(),
    purchaseLink: Joi.string().required()
  });
  return schema.validate(data);
};

// Review validation schema
const reviewValidation = (data) => {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  productValidation,
  reviewValidation
};
