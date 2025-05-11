import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authenticatin.js";
import * as postSchema from './post.schema.js';
import { ControllerFactory } from "../../factories/controller.factory.js";
import fileUpload from "../../utils/fileupload.js";
import { validation } from "../../middlewares/validation.middleware.js";
import  commentRouter from "../comment/comment.router.js"
import reactionRouter from "../reaction/reaction.router.js"
const postController = ControllerFactory.createController('post')
const router = Router()

router.use('/:postId/comments', commentRouter);
router.use('/:postId/reactions', reactionRouter);

router.post('/',isAuthenticated,
     fileUpload().array("images"),
    validation(postSchema.createPost),
    postController.createPost);

router.get('/', isAuthenticated,
     postController.getAllPosts);

router.get('/:id', isAuthenticated,
     validation(postSchema.getSinglePost),
      postController.getSinglePost);

router.patch('/:id',isAuthenticated,
    fileUpload().array("images"),
    validation(postSchema.updatePost),
    postController.updatePost);


router.delete('/:id',isAuthenticated,
    validation(postSchema.deletePost),
    postController.deletePost);


export default router;
