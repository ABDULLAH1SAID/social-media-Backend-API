import { Router } from "express";
import * as replySchema from "./reply.schema.js";
import { ControllerFactory } from "../../factories/controller.factory.js";
import { isAuthenticated } from "../../middlewares/authenticatin.js";
import { validation } from "../../middlewares/validation.middleware.js";
const replyController = ControllerFactory.createController('reply')
const router = Router({ mergeParams: true });

// create reply to comment or reply to reply
router.post("/", isAuthenticated,
     validation(replySchema.createReply),
        replyController.createReply, 
);
// get all replies to comment or reply to reply
router.get("/", isAuthenticated,
        validation(replySchema.getRepliesByComment),
        replyController.getRepliesByComment,
);
// get nested replies to comment or reply to reply
router.get("/:replyId", isAuthenticated,
        validation(replySchema.getNestedReplies),
        replyController.getNestedReplies,
);

// update reply to comment or reply to reply
router.put("/:replyId", isAuthenticated,
        validation(replySchema.updateReply),
        replyController.updateReply,
);
// delete reply to comment or reply to reply
router.delete("/:replyId", isAuthenticated,
        validation(replySchema.deleteReply),
        replyController.deleteReply,
);

export default router;