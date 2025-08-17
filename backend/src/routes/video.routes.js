import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideoDetails,
  updateVideoThumbnail,
} from "../controllers/video.controller.js";
import { addUserToRequest } from "../middlewares/addUserToRequest.js";

const router = Router();

router
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJWT,
    upload.fields([
      {
        name: "video",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(addUserToRequest, getVideoById)
  .patch(verifyJWT, updateVideoDetails)
  .delete(verifyJWT, deleteVideo);

router
  .route("/t/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideoThumbnail);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
