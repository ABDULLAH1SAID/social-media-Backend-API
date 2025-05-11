import { Router } from "express";
import * as userSchema from "./user.schema.js"
import { ControllerFactory } from "../../factories/controller.factory.js";
import { isAuthenticated } from "../../middlewares/authenticatin.js";
import { validation } from "../../middlewares/validation.middleware.js";
import fileUpload  from "../../utils/fileupload.js";

const router = Router()
const userController = ControllerFactory.createController('user')

router.get('/profile',isAuthenticated,userController.getProfile);
router.patch('/updateProfile',isAuthenticated,validation(userSchema.updateProfile),userController.updateProfile)
router.delete('/profile', isAuthenticated, userController.deleteProfile)
router.get("/recovery/:token",validation(userSchema.recoverUser), userController.recoverUser);

router.get('/connections',isAuthenticated,userController.getConnections);
router.patch('/connections/:id/request',isAuthenticated, userController.sendConnectionRequest);
router.patch('/connections/:id/accept', isAuthenticated, userController.acceptConnectionRequest);
router.delete('/connections/:id/reject', isAuthenticated, userController.rejectConnectionRequest);
router.delete('/connections/:id/delete',isAuthenticated,userController.removeConnection);

//profile image management 
router.post('/profile/image', isAuthenticated, fileUpload().single("image"), userController.uploadProfileImage)
router.delete('/profile/image', isAuthenticated, userController.deleteProfileImage)


export default router;