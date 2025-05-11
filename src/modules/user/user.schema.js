import joi from "joi";

export const updateProfile = joi.object({
    name:joi.string().min(3).max(30),
    phone:joi.string(),
    headline:joi.string().min(30).max(200)
}).required()

export const recoverUser = joi.object({
    token: joi.string().required()
}).required()
