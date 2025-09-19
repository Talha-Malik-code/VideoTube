import { Router } from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannel,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addUserToRequest } from "../middlewares/addUserToRequest.js";

const router = Router();

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers)
  .post(verifyJWT, toggleSubscription);

router.route("/u/:subscriberId").get(addUserToRequest, getSubscribedChannel);

export default router;
