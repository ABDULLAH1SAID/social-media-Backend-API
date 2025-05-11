import { Post } from "../../../DB/models/posts.model.js";
import { Comment } from "../../../DB/models/comment.model.js";
export class ReactionService {
    constructor(reactionRepositry) {
        this.reactionRepositry = reactionRepositry;
    }

    async addReaction(userId, postId, commentId, reactionType, next){
        let targetId;
        let targetType;
        let target;

        if(commentId){ 
            targetId = commentId;
            targetType = 'comment';
            target = await Comment.findById(commentId);
            if(!target) return next(new Error("comment not found"));
        }
        else if(postId){ 
            targetId = postId ;
            targetType = 'post';
            target = await Post.findById(postId);
            if(!target) return next(new Error("post not found"));

        } 
        else {
            return next(new Error("postId and commentId not found"));
        }
        const existingReaction = await this.reactionRepositry.findOne({
            user: userId,
            target: targetId,
            targetType: targetType
        }); 
        
        if(existingReaction){
        if(existingReaction.type === reactionType) {
            const deletedReaction = await this.reactionRepositry.deleteReactionById(
                existingReaction._id,
                targetId,
                targetType
            );
            if(!deletedReaction) return next(new Error(" failed to delete reaction"));
                    
            return { 
                reaction: deletedReaction, 
                action: "removed" 
            };

        }
            const updatedReaction = await this.reactionRepositry.updateReaction(
                existingReaction._id,
                reactionType
            );

            if(!updatedReaction) return next(new Error(" failed to update reaction"));
            
            return { 
                reaction: updatedReaction, 
                action: "updated" 
            };
        }

        let newReaction;
            
        if(targetType === 'post') {
            newReaction = await this.reactionRepositry.addReactionToPost(
                userId, 
                targetId, 
                reactionType
            );
        } else {
            newReaction = await this.reactionRepositry.addReactionToComment(
                userId, 
                targetId, 
                reactionType
            );
        }
        
        if(!newReaction) return next(new Error(" failed to add reaction"));
        
        return { 
            reaction: newReaction, 
            action: "added" 
        };

    }
}

