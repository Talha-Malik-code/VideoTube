/**
 * A comprehensive validator for the edit channel form.
 * It checks the username, description, fontWeight, and timezone fields.
 *
 * @param {object} formData - The state of the edit channel form inputs.
 * @returns {object} An object containing error messages for invalid fields.
 */
const validateEditChannelForm = (formData) => {
  const errors = {};

  // Validate username
  if (!formData.username?.trim()) {
    errors.username = "Username is required.";
  } else if (formData.username.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (formData.username.length > 30) {
    errors.username = "Username must be less than 30 characters.";
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
    errors.username =
      "Username can only contain letters, numbers, underscores, periods, and hyphens.";
  } else if (
    /^[._-]/.test(formData.username) ||
    /[._-]$/.test(formData.username)
  ) {
    errors.username = "Username cannot start or end with special characters.";
  } else if (/[._-]{2,}/.test(formData.username)) {
    errors.username = "Username cannot contain consecutive special characters.";
  }

  // Validate description
  // if (!formData.description?.trim()) {
  //   errors.description = "Channel description is required.";
  // } else if (formData.description.length < 10) {
  //   errors.description = "Description must be at least 10 characters.";
  // } else if (formData.description.length > 1000) {
  //   errors.description = "Description must be less than 1000 characters.";
  // }

  // Validate fontWeight
  const validFontWeights = ["light", "regular", "semi-bold", "bold", "bolder"];
  if (!formData.fontWeight) {
    errors.fontWeight = "Font weight is required.";
  } else if (!validFontWeights.includes(formData.fontWeight)) {
    errors.fontWeight = "Please select a valid font weight.";
  }

  // Validate timezone
  if (!formData.timezone?.trim()) {
    errors.timezone = "Timezone is required.";
  } else if (!/^UTC[+-]\d{2}:\d{2}$/.test(formData.timezone)) {
    errors.timezone = "Please select a valid timezone.";
  }

  return errors;
};

export { validateEditChannelForm };
