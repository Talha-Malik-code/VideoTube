import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  getCommentReplies,
  updateComment,
} from "../controllers/comment.controller.js";
import { addUserToRequest } from "../middlewares/addUserToRequest.js";

const router = Router();

router
  .route("/:videoId")
  .get(addUserToRequest, getVideoComments)
  .post(verifyJWT, addComment);

router.route("/replies/:commentId").get(addUserToRequest, getCommentReplies);

router
  .route("/c/:commentId")
  .patch(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);

export default router;
