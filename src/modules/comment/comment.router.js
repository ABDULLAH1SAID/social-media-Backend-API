import { Router } from 'express';
import { isAuthenticated } from "../../middlewares/authenticatin.js";
import { ControllerFactory } from "../../factories/controller.factory.js";
import { validation } from '../../middlewares/validation.middleware.js';
import * as commentSchema from './comment.schema.js';
import reactionRouter from '../reaction/reaction.router.js';
import replyRouter from '../Replay/reply.router.js';
const router = Router({mergeParams:true});
const commentController = ControllerFactory.createController('comment')
router.use('/:commentId/reactions', reactionRouter);
router.use('/:commentId/replies', replyRouter);


router.post('/',isAuthenticated,validation(commentSchema.createComment),commentController.createComment);

router.get('/',isAuthenticated,validation(commentSchema.getComments),commentController.getComments);

router.get('/:commentId',isAuthenticated,validation(commentSchema.getSingleComment),commentController.getSingleComment);

router.put('/:commentId',isAuthenticated,validation(commentSchema.updateComment),commentController.updateComment);

router.delete('/:commentId',isAuthenticated,validation(commentSchema.deleteComment),commentController.deleteComment);

export default router ;