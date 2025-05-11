import { isAuthenticated } from "../../middlewares/authenticatin.js";
import { validation } from "../../middlewares/validation.middleware.js";

import { Router } from "express";
const router = Router({ mergeParams: true });
import { ControllerFactory } from '../../factories/controller.factory.js';
const reactionController = ControllerFactory.createController('reaction')
import * as reactionSchema from './reaction.schema.js';


router.post('/', isAuthenticated,
    validation(reactionSchema.addReaction),
    reactionController.addReaction);



export default router;