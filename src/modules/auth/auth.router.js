import { Router } from "express";

import { validation } from "../../middlewares/validation.middleware.js";

import * as authSchema from './auth.schema.js'
import { ControllerFactory } from "../../factories/controller.factory.js";
import  fileUpload  from "../../utils/fileupload.js";
import { isAuthenticated } from "../../middlewares/authenticatin.js";

const authController = ControllerFactory.createController('auth');

const router = Router()

router.post('/signup',fileUpload().single("image"),validation(authSchema.signup),authController.signup)

router.get('/activate_account/:token',validation(authSchema.activateAccount),authController.activateAccount)

router.post('/login',validation(authSchema.login),authController.login)

router.patch('/forgetpassword',validation(authSchema.forgetpassword),authController.forgetpassword)

router.patch('/resetpassword',validation(authSchema.resetPassword),authController.resetpassword)

router.patch('/logout',isAuthenticated,authController.logout)


export default router;





