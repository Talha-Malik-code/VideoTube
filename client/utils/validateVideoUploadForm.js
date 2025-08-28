/**
 * A comprehensive validator for the video upload form.
 * It checks the video file, thumbnail, title, and description fields.
 *
 * @param {object} files - An object containing the video and thumbnail files.
 * @param {object} details - An object containing the video title and description.
 * @returns {object} An object containing error messages for invalid fields.
 */
const validateUploadVideoForm = (files, details) => {
  const errors = {};

  // Validate video file
  if (!files.videoFile) {
    errors.videoFile = "A video file is required.";
  }

  // Validate thumbnail file
  if (!files.thumbnailFile) {
    errors.thumbnailFile = "A thumbnail image is required.";
  }

  // Validate title
  if (!details.title.trim()) {
    errors.title = "A video title is required.";
  } else if (details.title.trim().length < 3) {
    errors.title =
      "Video Title should be atleast 3 characters long excluding spaces";
  }

  // Validate description
  if (!details.description.trim()) {
    errors.description = "A video description is required.";
  } else if (details.description.trim().length < 10) {
    errors.description =
      "Video Description should be atleast 10 characters long excluding spaces";
  }

  return errors;
};

export { validateUploadVideoForm };
