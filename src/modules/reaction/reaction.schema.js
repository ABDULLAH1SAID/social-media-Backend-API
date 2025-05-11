import Joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";

export const addReaction = Joi.object({
    postId: Joi.custom(isValidObjectId),
    commentId: Joi.custom(isValidObjectId),
    reactionType: Joi.string().valid('like','love', 'haha', 'wow', 'sad','angry').required(),
}).or('postId', 'commentId') 
.required();