import { asyncHandler } from '../../utils/asyncHandler.js';
import { PostRepositry } from './post.repositry.js';
import { PostService } from './post.service.js';

const postRepositry = new PostRepositry();
const postService = new PostService(postRepositry);

export class PostController {
    
    createPost = asyncHandler(async (req, res) => {
        const { content } = req.body
        const post = await postService.createPost(content, req.files, req.user._id);
        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post });
    })
    getAllPosts = asyncHandler(async (req, res, next)=>{
        const userId = req.user._id
        const data = await postService.getAllPosts(userId, next); 
        res.json({
            success: true,
            message: 'Posts fetched successfully', 
            data:data
        })
    })

    getSinglePost = asyncHandler(async (req, res, next) => {
        const postId = req.params.id
        const post = await postService.getSinglePost(postId, next);
        return res.status(200).json({ 
            success: true, 
            message: 'Post fetched successfully',
            data: post });
    })

    updatePost = asyncHandler(async (req, res, next) => {
        const { content , imagesDeleted} = req.body
        const postId = req.params.id
        const userId = req.user._id
        const post = await postService.updatePost(userId, postId, content, req.files, imagesDeleted, next);
        return res.status(200).json({ 
            success: true, 
            message: 'Post updated successfully',
            data: post });
    })

    deletePost = asyncHandler(async (req, res) => {
        const postId = req.params.id
        const deletedPost = await postService.deletePost(postId);
        return res.status(200).json({
             success: true,
             message: 'Post deleted successfully',
             data: deletedPost });
    })
}
    



