import { Schema, model, Types } from "mongoose";

const postSchema = new Schema({
    content: { type: String, required: true },

    media: [
        {
            url: { type: String }, 
            id: { type: String },  
        },
    ],
    createdBy: { type: Types.ObjectId, ref: "User", required: true }, 
    reactions: [{ type: Types.ObjectId, ref: "Reaction" }], 
    comments: [
        {type: Types.ObjectId, ref: "Comment"},
    ],
}, { timestamps: true });

export const Post = model("Post", postSchema);
