import joi from "joi";

export const signup = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(30).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required(),
    phone: joi.string().required(),
    age: joi.number().min(10).max(100).required(),
    gender:joi.string().valid('male','female')
}).required()

export const activateAccount = joi.object({
    token: joi.string().required()
}).required()

export const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(30).required()
}).required()

export const forgetpassword = joi.object({
    email: joi.string().email().required(),
}).required()

export const resetPassword = joi.object({
    email: joi.string().email().required(),
    password:joi.string().required(),
    code: joi.string().length(6).required(),
}).required()
