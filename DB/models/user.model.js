import {Schema, model, Types } from "mongoose";
const UserSchema = new Schema({
    name: { type: String, required:true},
    headline: String,
    email: { type: String, required:true,unique:true},
    password: { type: String, required:true},
    age: { type: Number, required:true},
    phone: { type: String, required:true},
    profileImage:{
        url:{type:String,default:
            'https://res.cloudinary.com/dyzsdwzxo/image/upload/v1744801040/icons8-user-default-64_eq608n.png'},
        id:{type:String,default:'icons8-user-default-64_eq608n'},
    },
    coverImages:[{url: {type:String},id:{type: String}}],
    code:String,

    role: { type: String, default: "user", enum: ["admin", "user"]},
    gender: { type: String, default: "male", enum: ["male", "female"]},
    confirmEmail: { type: Boolean, default: false},
    connections:{
        requested: [{ type:Types.ObjectId, ref: 'User' }],
        accepted: [{ type:Types.ObjectId, ref: 'User' }],
     },
    isDeleted: { type: Boolean, default: false},
    isBlocked: {type: Boolean, default: false,},
    permanentlyDeleted: Date,      
},{ timestamps: true});

export const User = model("User",UserSchema);
