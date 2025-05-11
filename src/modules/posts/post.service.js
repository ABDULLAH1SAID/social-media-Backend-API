import cloudinary from "../../utils/cloud.js";
import { User } from "../../../DB/models/user.model.js";
export class PostService {
    constructor(postRepositry){
        this.postRepositry = postRepositry
    }
    async createPost(content, files, userId) {
        const newPost = await this.postRepositry.createContent({
            content,
            createdBy: userId
        });
    
        if (files && files.length > 0) {

            const uploadedImages = [];
            for (const file of files) {
                const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.CLOUD_FOLDER_NAME}/posts/photos`
                });
    
                uploadedImages.push({
                    url: secure_url,
                    id: public_id
                });

                console.log(uploadedImages)
            }

            await this.postRepositry.savePhotos(newPost, uploadedImages);
        }
    
        return newPost;
    }

    // get all posts

    async getAllPosts(userId, next) {
        const user = await User.findById(userId)
        if (!user) {
            return next(new Error("User not found"));
        }
        const acceptedConnections = user.connections.accepted || [];
        console.log("acceptedConnections", acceptedConnections);

        const usersToFetchFrom = [...acceptedConnections, userId];

        const data = await this.postRepositry.getAllPosts(usersToFetchFrom);

        return data;
    }
    // get single post

    async getSinglePost(postId, next) {
        const post = await this.postRepositry.findPostById(postId);
        if (!post) {
            return next(new Error("Post not found"));
        }

        return post;
    }

    async updatePost(userId, postId, content, files, imagesDeleted, next) {
        const post = await this.postRepositry.findById(postId);
        if (!post) {
            return next(new Error("Post not found"));
        }   

        if (post.createdBy.toString() !== userId.toString()) {
            return next(new Error("You are not authorized to update this post"));
        }
        if (content && content.trim() === "") {
            return next(new Error("Content cannot be empty"));
        }
        console.log("imagesDeleted", imagesDeleted)
        console.log(imagesDeleted.length)
        if (imagesDeleted && imagesDeleted.length > 0) {
            for (const imageId of imagesDeleted) {
                await this.postRepositry.removeImage(post, imageId);
                await cloudinary.uploader.destroy(imageId, {
                    folder: `${process.env.CLOUD_FOLDER_NAME}/posts/photos`
                });
            }
        }
    
        if (files && files.length > 0) {
            const uploadedImages = [];
            for (const file of files) {
                const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.CLOUD_FOLDER_NAME}/posts/photos`
                });

                uploadedImages.push({
                    url: secure_url,
                    id: public_id
                });
            }

            await this.postRepositry.updateSavePhotos(post, uploadedImages);
        }

        if (content) {
            await this.postRepositry.updateContent(postId, content);
        }
        return post;
    }

    async deletePost(postId, next) {
        const post = await this.postRepositry.findById(postId);
        if (!post) {
            return next(new Error("Post not found"));
        }
        await this.postRepositry.removePost(postId);

        for (const image of post.media) {
            await cloudinary.uploader.destroy(image.id, {
                folder: `${process.env.CLOUD_FOLDER_NAME}/posts/photos`
            });
        }

        return true;
    }
}
