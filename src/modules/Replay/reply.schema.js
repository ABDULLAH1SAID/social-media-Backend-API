import Joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";
export const createReply = Joi.object({
    content: Joi.string().required(),
    postId: Joi.string().custom(isValidObjectId).required(),
    commentId: Joi.string().custom(isValidObjectId).required(),
    parentReply: Joi.string().custom(isValidObjectId).allow(null, ""),
}).required();

export const getRepliesByComment = Joi.object({
    postId: Joi.string().custom(isValidObjectId).required(),
    commentId: Joi.string().custom(isValidObjectId).required(),
}).required();
export const getNestedReplies = Joi.object({
    postId: Joi.string().custom(isValidObjectId).required(),
    commentId: Joi.string().custom(isValidObjectId).required(),
    replyId: Joi.string().custom(isValidObjectId).required(),
}).required();

export const updateReply = Joi.object({
    replyId: Joi.string().custom(isValidObjectId).required(),
    content: Joi.string().required(),
    postId: Joi.string().custom(isValidObjectId).required(),
    commentId: Joi.string().custom(isValidObjectId).required(),
}).required()

export const deleteReply = Joi.object({
    replyId: Joi.string().custom(isValidObjectId).required(),
    postId: Joi.string().custom(isValidObjectId).required(),
    commentId: Joi.string().custom(isValidObjectId).required(),
}).required()


