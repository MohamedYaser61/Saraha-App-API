import joi from "joi";

// Define a schema for validation

export const registerSchema = joi.object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('password')).messages({'any.only': 'confirmPassword does not match password'}).required(),
    Phone: joi.string().pattern(new RegExp('^[0-9]{10,15}$')).required()
}).required();


export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
}).required();