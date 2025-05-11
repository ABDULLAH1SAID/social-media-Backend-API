import { Schema, model, Types } from "mongoose";

const reactionSchema = new Schema(
    {
        targetType: {
            type: String,
            enum: ['post', 'comment'],
            required: true
          },
        user: { type: Types.ObjectId, ref: 'User', required: true },
        target: { type: Types.ObjectId, refPath: 'targetType', required: true }, // This will reference either a Post or Comment based on the targetType
        type: { type: String, enum: ['like','love', 'haha', 'wow', 'sad','angry'], required: true },
        createdAt: {
            type: Date,
            default: Date.now
          }},
    { timestamps: true }
);

export const Reaction = model("Reaction", reactionSchema);

