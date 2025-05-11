import { Types, Schema, model } from "mongoose";

const replySchema = new Schema({
    parentReply :{
        type: Types.ObjectId,
        ref: 'Reply',
        default: null
        
    },
    content : {
        type: String,
        required: true
    },
    postId: {
        type: Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentId: {
        type: Types.ObjectId,
        ref: 'Comment',
        required: true
    },
}, {timestamps: true}
);

export const Reply = model("Reply", replySchema);

