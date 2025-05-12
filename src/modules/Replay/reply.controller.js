import { ReplyService } from './reply.service.js'
import { ReplyRepository } from './reply.repository.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const replyRepository = new ReplyRepository();
const replyService = new ReplyService(replyRepository);

export class ReplyController {

    createReply = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const { commentId, postId } = req.params;
        const { content, parentReply } = req.body;

        const reply = await replyService.createReply(userId, content, postId, commentId, parentReply, next);

        return res.status(201).json({ success: true,
             message: 'Reply created successfully',
             reply });
    });
    getRepliesByComment = asyncHandler(async (req, res, next) => {
        const { commentId } = req.params;

        const replies = await replyService.getRepliesByCommentId(commentId, next);

        return res.status(200).json({ success: true,
             message: 'Replies fetched successfully',
             replies });
    });
    getNestedReplies = asyncHandler(async (req, res, next) => {
        const { replyId } = req.params;
        const nestedReplies = await replyService.getNestedReplies(replyId, next);

        return res.status(200).json({ success: true,
             message: 'Nested replies fetched successfully',
             nestedReplies });
    });
    
    updateReply = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;   
        const { replyId } = req.params;
        const { content } = req.body;

        const updatedReply = await replyService.updateReply(userId, replyId, content, next);

        return res.status(200).json({ success: true,
             message: 'Reply updated successfully',
             updatedReply });
    });

    deleteReply = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;   
        const { replyId } = req.params;

        const deletedReply = await replyService.deleteReply(userId, replyId, next);

        return res.status(200).json({ success: true,
             message: 'Reply deleted successfully',
             deletedReply });
    });

}


