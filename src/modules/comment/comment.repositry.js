import { Comment } from "../../../DB/models/comment.model.js"
export class CommentRepository {
    async createComment(postId, userId, content) {
        const comment = new Comment({
            postId,
            userId,
            content
        });
        await comment.save();
        return comment;
    }

    async getCommentsByPostId(postId) {
        const comments = await Comment.find({ postId })
        .populate('userId', 'username profilePicture')
        .populate({path: 'reactions', populate: {path: 'user', select: ' name profileImage'}})        
        .sort({ createdAt: -1 });
        return comments;
    }
    async getSingleComment(commentId) {
        const comment = await Comment.findById(commentId)
        .populate('userId', 'username profilePicture')
        .populate({path: 'reactions', populate: {path: 'user', select: ' name profileImage'}})
        return comment;
    }
    async getCommentById(commentId) {
        const comment = await Comment.findById(commentId)
        return comment;
    }
    async updateComment(commentId, content) {
        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
        return updatedComment;
    }
    async deleteComment(commentId) {
        await Comment.findByIdAndDelete(commentId);
    }
}