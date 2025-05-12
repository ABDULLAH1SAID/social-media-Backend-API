export class ReplyService {
    constructor(replayRepository) {
        this.replayRepository = replayRepository;
    }

    async createReply(userId, content, postId, commentId, parentReply, next) {
        if(parentReply) {
            const parentReplyDoc = await this.replayRepository.getReplyById(parentReply);
            if (!parentReplyDoc) {
                return next(new Error('Parent reply not found'));
            }
        }
        const reply = await this.replayRepository.createReply(userId, content, postId, commentId, parentReply);
        if (!reply) {
            return next(new Error('Failed to create reply'));
        }
        return reply;
    }

    async updateReply(userId, replyId, content, next) {
        const reply = await this.replayRepository.getReplyById(replyId);
        if (!reply) {
            return next(new Error('Reply not found'));
        }
        if (reply.createdBy.toString() !== userId.toString()) {
            return next(new Error('You are not authorized to update this reply'));
        }
        const updatedReply = await this.replayRepository.updateReply(replyId, content);
        if (!updatedReply) {
            return next(new Error('Failed to update reply'));
        }
        return updatedReply;
    }

    async deleteReply(userId, replyId, next) {
        const reply = await this.replayRepository.getReplyById(replyId);
        if (!reply) {
            return next(new Error('Reply not found'));
        }
        if (reply.createdBy.toString() !== userId.toString()) {
            return next(new Error('You are not authorized to delete this reply'));
        }
        const deletedReply = await this.replayRepository.deleteReply(replyId);
        if (!deletedReply) {
            return next(new Error('Failed to delete reply'));
        }
        console.log(deletedReply);
        return deletedReply;
    }

    async getRepliesByCommentId(commentId, next) {

        const replies = await this.replayRepository.getRepliesByCommentId(commentId);
        if (!replies) {
             return next(new Error('Failed to fetch replies'));
        }
        return replies;
    }

    async getNestedReplies(replyId, next) {
        
        const nestedReplies =  await this.replayRepository.getNestedReplies(replyId);
        if (!nestedReplies) {
            return next(new Error('Failed to fetch nested replies'));
        }
        return nestedReplies;
    }
}