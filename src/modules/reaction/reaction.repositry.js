import { Reaction } from "../../../DB/models/reaction.model.js"
import { Post } from "../../../DB/models/posts.model.js";
import { Comment } from "../../../DB/models/comment.model.js";

export class ReactionRepositry{

    async findOne(criteria) {
        return await Reaction.findOne(criteria);
    }

    async deleteReactionById(reactionId, targetId, targetType) {
        const reaction = await Reaction.findByIdAndDelete(reactionId);
        
        if (!reaction) return null;

        if (targetType === 'post') {
            await Post.findByIdAndUpdate(
                targetId,
                { $pull: { reactions: reactionId } }
            );
        } else if (targetType === 'comment') {
            await Comment.findByIdAndUpdate(
                targetId,
                { $pull: { reactions: reactionId } }
            );
        }
        return reaction;
    }

    async updateReaction(reactionId, reactionType) {
        return await Reaction.findByIdAndUpdate(
            reactionId,
            { type: reactionType },
            { new: true }
        );
    }

    async addReactionToPost(userId, postId, reactionType) {
        const reaction = await Reaction.create({
            user: userId,
            target: postId,
            targetType: 'post',
            type: reactionType
        });
        await Post.findByIdAndUpdate(
            postId,
            { $push: { reactions: reaction._id } }
        );

        return reaction;
    }

    async addReactionToComment(userId, commentId, reactionType) {
        const reaction = await Reaction.create({
            user: userId,
            target: commentId,
            targetType: 'comment',
            type: reactionType
        });
        await Comment.findByIdAndUpdate(
            commentId,
            { $push: { reactions: reaction._id } }
        );

        return reaction;
    }
    
}