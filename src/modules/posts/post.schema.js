import Joi from 'joi';
import { isValidObjectId } from '../../middlewares/validation.middleware.js';

export const createPost = Joi.object({
    content: Joi.string().max(200).required(),
}).required();

export const updatePost = Joi.object({
    content: Joi.string().max(200).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    id: Joi.string().custom(isValidObjectId).required(),
    imagesDeleted: Joi.alternatives().try(
        Joi.string(),             
        Joi.array().items(Joi.string()) 
      ).optional()
    
}).required(); 

export const deletePost = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),

}).required();

export const getSinglePost = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
}).required();
