import { asyncHandler } from "../../utils/asyncHandler.js";
import { ReactionRepositry } from "./reaction.repositry.js";
import { ReactionService } from "./reaction.service.js";
const reactionRepositry = new ReactionRepositry();
const reactionService = new ReactionService(reactionRepositry);
export class ReactionController {
    addReaction = asyncHandler(async(req, res, next)=>{
        const { postId } = req.params;
        const { commentId } = req.params;
        const { reactionType} = req.body;
        const userId = req.user._id ;

        const result = await reactionService.addReaction(userId, postId, commentId, reactionType, next);

        const message = result.action === 'removed' 
            ? "Reaction removed successfully" 
            : result.action === 'updated'
                ? "Reaction updated successfully"
                : "Reaction added successfully";
        return res.json({success:true,message, reaction: result.reaction})
        
    })
}