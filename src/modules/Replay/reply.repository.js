import  { Reply } from '../../../DB/models/reply.model.js'; 

export class ReplyRepository {

    getReplyById = async (replyId) => {
        return await Reply.findById(replyId);
    }

    createReply = async (userId, content, postId, commentId, parentReply) => {
        const reply = await Reply.create({
            content,
            postId,
            commentId,
            createdBy: userId,
            parentReply: parentReply || null
        });

        return reply;
    };
    updateReply = async (replyId, content) => {
        const updatedReply = await Reply.findByIdAndUpdate(
            replyId,
            { content },
            { new: true }
        );
        return updatedReply;
    };
    deleteReply = async (replyId) => {
        const deletedReply = await Reply.findByIdAndDelete(replyId);
        return deletedReply;
    };
      getRepliesByCommentId = async (commentId) => {
        
        return await Reply.find({ 
            commentId: commentId, 
            parentReply: null 
        })
        .populate({
            path: 'createdBy',
            select: 'name profileImage',
        });
    };


    getNestedReplies = async (replyId) => {
        return await Reply.find({ parentReply: replyId })
            .populate({
                path: 'createdBy',
                select: 'name profileImage',
            });
    };

}