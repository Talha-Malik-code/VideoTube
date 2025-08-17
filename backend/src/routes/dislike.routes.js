import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleVideoDislike,
  toggleCommentDislike,
  toggleTweetDislike,
  getDislikedVideos,
} from "../controllers/dislike.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoDislike);
router.route("/toggle/c/:commentId").post(toggleCommentDislike);
router.route("/toggle/t/:tweetId").post(toggleTweetDislike);
router.route("/videos").get(getDislikedVideos);

export default router;
