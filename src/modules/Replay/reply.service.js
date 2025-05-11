export class ReplyService {
    constructor(replayRepository) {
        this.replayRepository = replayRepository;
    }

    async createReply(userId, content, postId, commentId, parentReplay, next) {
        if(parentReplay) {
            const parentReplyDoc = await this.replayRepository.getReplyById(parentReplay);
            if (!parentReplyDoc) {
                return next(new Error('Parent reply not found'));
            }
        }
        const reply = await this.replayRepository.createReply(userId, content, postId, commentId, parentReplay);
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

}