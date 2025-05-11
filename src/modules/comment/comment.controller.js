import { CommentService } from "./comment.service.js";
import { CommentRepository } from "./comment.repositry.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);
export class CommentController {
    createComment = asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;
        const comment = await commentService.createComment(postId, userId, content);
        res.status(201).json({ message: "Comment created successfully", comment });
    });
    getComments = asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const comments = await commentService.getCommentsByPostId(postId);
        res.status(200).json({ message: "Comments retrieved successfully", comments });
    });
    getSingleComment = asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        const comment = await commentService.getSingleComment(commentId);
        res.status(200).json({ message: "Comment retrieved successfully", comment });
    });
    updateComment = asyncHandler(async (req, res, next) => {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;
        const updatedComment = await commentService.updateComment(commentId, content, userId, next);
        res.status(200).json({ message: "Comment updated successfully", updatedComment });
    });

    deleteComment = asyncHandler(async (req, res, next) => {
        const { commentId } = req.params;
        const userId = req.user._id;
        await commentService.deleteComment(commentId, userId, next);
        res.status(200).json({ message: "Comment deleted successfully" });
    });
    
}
