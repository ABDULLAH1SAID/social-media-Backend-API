import Joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";

export const createComment = Joi.object({
    postId: Joi.custom(isValidObjectId).required(),
    content: Joi.string().max(200).required(),
}).required();

export const getComments = Joi.object({
    postId: Joi.custom(isValidObjectId).required(),
}).required();
export const getSingleComment = Joi.object({
    commentId: Joi.custom(isValidObjectId).required(),
    postId: Joi.custom(isValidObjectId).required(),
}).required();
export const updateComment = Joi.object({
    commentId: Joi.custom(isValidObjectId).required(),
    postId: Joi.custom(isValidObjectId).required(),
    content: Joi.string().max(200).required(),
}).required();
export const deleteComment = Joi.object({
    commentId: Joi.custom(isValidObjectId).required(),
    postId: Joi.custom(isValidObjectId).required(),
}).required();
