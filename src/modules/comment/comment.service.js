import { Post } from '../../../DB/models/posts.model.js';
export class CommentService {
    constructor(commentRepositry) {
        this.commentRepository = commentRepositry;
    }
    async createComment(postId, userId, content) {
        const comment = await this.commentRepository.createComment(postId, userId, content);

        await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment._id }
          });
        return comment;
    }
    async getCommentsByPostId(postId) {
        const comments = await this.commentRepository.getCommentsByPostId(postId);
        return comments;
    }
    async getSingleComment(commentId) {
        const comment = await this.commentRepository.getSingleComment(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }
        return comment;
    }
    async updateComment(commentId, content, userId, next) {
        const comment = await this.commentRepository.getCommentById(commentId);
        if(!comment) return next(new Error("Comment not found"));
        if (comment.userId.toString() !== userId.toString()) {
            return next(new Error("You are not authorized to update this comment"));
        }
        const updatedComment = await this.commentRepository.updateComment(commentId, content, userId);
        return updatedComment;
    }

    async deleteComment(commentId, userId, next) {
        const comment = await this.commentRepository.getCommentById(commentId);
        if(!comment) return next(new Error("Comment not found"));
        if (comment.userId.toString() !== userId.toString()) {
            return next(new Error("You are not authorized to delete this comment"));
        }
        await this.commentRepository.deleteComment(commentId);
    }
    
}
