import { Post } from '../../../DB/models/posts.model.js'

export class PostRepositry{

    async createContent(content){
        return await Post.create(content)
    }

    async savePhotos(post, imagesArray) {
        post.media = imagesArray;
        return await post.save();
    }
    async findById(postId) {
        return await Post.findById(postId);
        
    }

    async removeImage(post, imageId) {
        post.media = post.media.filter(image => image.id !== imageId);
        return await post.save();
    }
    
    
    async updateContent(postId, content) {
        return await Post.findByIdAndUpdate(postId, { content }, { new: true });
    }

    async updateSavePhotos(post, imagesArray) {
        post.media.push(...imagesArray);
        return await post.save();
    }

    async removePost(postId) {
        return await Post.findByIdAndDelete(postId);
    }

    async getAllPosts(usersToFetchFrom){
        const data = await Post.find({createdBy: {$in: usersToFetchFrom}})
        .populate('createdBy', 'name profileImage')
        .populate({path: 'comments', populate: {path: 'userId', select: 'name profileImage'}})
        .populate({path: 'reactions', populate: {path: 'user', select: ' name profileImage'}})        
        .sort({ createdAt: -1 });

        return data; 
    }

    async findPostById(postId) {
        const data = await Post.findById(postId)
        .populate('createdBy', 'name profileImage')
        .populate({path: 'comments', populate: {path: 'userId', select: 'name profileImage'}})
        .populate({path: 'reactions', populate: {path: 'user', select: ' name profileImage'}})     
           
        return data;    
    }
}