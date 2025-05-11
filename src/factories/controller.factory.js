import { AuthController } from "../modules/auth/auth.controller.js";
import { UserController } from "../modules/user/user.controller.js";
import { PostController } from "../modules/posts/post.controller.js"
import { CommentController } from "../modules/comment/comment.controller.js";
import { ReactionController } from "../modules/reaction/reaction.controller.js";
import { ReplyController } from "../modules/Replay/reply.controller.js";

 export class ControllerFactory {
    static createController(type){
        switch(type){
            case'auth':
            return new AuthController();
            case'user':
            return new UserController();
            case'post':
            return new PostController();
            case'comment':
            return new CommentController();
            case'reaction':
            return new ReactionController();
            case'reply':
            return new ReplyController();
            default:
            throw new Error(`this controller is unknown: ${type}`);
        }      
    }
 } 