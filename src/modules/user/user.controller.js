import { asyncHandler } from "../../utils/asyncHandler.js";
import { UserService } from "./user.service.js";
import { UserRepository } from "./user.repositry.js";

const userRepository = new UserRepository()
const userService = new  UserService(userRepository)

export class UserController{
 
  getProfile = asyncHandler(async(req, res, next)=>{
    const userId = req.user._id
    const user = await userService.getUserProfile(userId, next)
    return res.json({
      success:true,
      message:"Profile retrived Successfully",
      data:user 
    });
  })

  updateProfile = asyncHandler(async(req, res, next)=>{
    
    const userId = req.user._id
    const user = await userService.deleteUserProfile(userId, req.protocol, req.headers.host,next);
    const {name, phone, headline} = req.body
    user = await userService.updateUserProfile(userId,{name, phone, headline}, next)
    return res.status(200).json({
      success: "true",
      message: "Account Updated Successfully",
      data:user});
  });

 deleteProfile = asyncHandler(async(req, res, next)=>{
  const userId = req.user._id;
  const user = await userService.deleteUserProfile(userId,
     req.protocol
     , req.headers.host, next);
  return res.json({
    status: 'success',
    message: 'Account Disabled Successfully, you have 30 days to recover your account, or it will be deleted permanently. In case this was a mistake, we sent a recovery email.',
    data:user,});
})
 recoverUser = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    await userService.recoverUserProfile(token, next)
      return res.status(200).json({
        status: "success",
        message: "Email recovered successfully, you can try logging in now",
      });    
})
 getConnections = asyncHandler(async (req, res, next)=>{

  const userId = req.user._id;
  const user = await userService.getUserConnectionService(userId, next);
  return res.status(200).json({
    success: true,
    message: "Connections retrieved successfully",
    data: user.connections,})
});

 sendConnectionRequest = asyncHandler(async(req, res, next)=>{
  const requestedUserId = req.params.id;
  const currentUserId = req.user._id;
  
  await userService.sendConnectionRequestService(requestedUserId, currentUserId, next);

  return res.status(200).json({
    status: "success",
    message: "The connection request has been sent successfully",
  });    
})

 acceptConnectionRequest = asyncHandler(async(req, res, next)=>{
  const requesterId = req.params.id;
  const currentUserId = req.user._id;
  
  const updatedUser = await userService.acceptRequestService(requesterId, currentUserId, next);

  return res.status(200).json({
    status: "success",
    message: "Connection request accepted successfully",
    data: updatedUser
  });

});

  rejectConnectionRequest = asyncHandler(async(req, res, next)=>{
    const requestedUserId = req.params.id;
    const currentUserId = req.user._id;

    await userService.rejectConnectionService(requestedUserId, currentUserId, next)    

    return res.status(200).json({
      status: "success",
      message: "Connection request rejected successfully",
    });
  });

  removeConnection = asyncHandler(async (req, res, next) => {
    const connectionId = req.params.id;
    const userId = req.user._id;

    const updateUser = await userService.removeConnection(connectionId, userId, next)

    return res.status(200).json({
        status: "success",
        message: "Connection removed successfully",
       data: updateUser,
    });
    });

  uploadProfileImage = asyncHandler(async(req, res, next)=>{
    const updatedUser = await userService.uploadProfileImage(req.user._id, req.file, req.next)
    return res.status(200).json({
      status: "success",
      message: "Profile image uploaded successfully",
      data: updatedUser,
    });
  });

  deleteProfileImage = asyncHandler(async(req, res, next)=>{

    const updatedUser = await userService.deleteProfileImage(req.user._id, next)
    
    return res.status(200).json({
      status: "success",
      message: "image deleted successfully",
      data: updatedUser,
    });
  });

}