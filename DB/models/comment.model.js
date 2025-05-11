import { Types, model, Schema } from 'mongoose';

const commentSchema = new Schema({
    postId: {
        type: Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }, 
    reactions: [
        {
            type: Types.ObjectId,
            ref: 'Reaction'
        }
    ]
}, {
    timestamps: true
});

export const Comment = model('Comment', commentSchema);

