/**
 * A comprehensive validator for the change password form.
 * It checks the currentPassword, newPassword, and confirmPassword fields.
 *
 * @param {object} formData - The state of the change password form inputs.
 * @returns {object} An object containing error messages for invalid fields.
 */
const validateChangePasswordForm = (formData) => {
  const errors = {};

  // Validate currentPassword
  if (!formData.currentPassword?.trim()) {
    errors.currentPassword = "Current password is required.";
  }

  // Validate newPassword
  if (!formData.newPassword?.trim()) {
    errors.newPassword = "New password is required.";
  } else if (formData.newPassword.includes(" ")) {
    errors.newPassword = "Password cannot contain spaces.";
  } else if (formData.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters.";
  } else if (formData.newPassword.length > 128) {
    errors.newPassword = "Password must be less than 128 characters.";
  }
  // else if (!/[a-z]/.test(formData.newPassword)) {
  //   errors.newPassword = "Password must contain at least one lowercase letter.";
  // } else if (!/[A-Z]/.test(formData.newPassword)) {
  //   errors.newPassword = "Password must contain at least one uppercase letter.";
  // } else if (!/[0-9]/.test(formData.newPassword)) {
  //   errors.newPassword = "Password must contain at least one number.";
  // } else if (
  //   !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword)
  // ) {
  //   errors.newPassword =
  //     "Password must contain at least one special character.";
  // }

  // Check if new password is same as current password
  if (
    formData.currentPassword &&
    formData.newPassword &&
    formData.currentPassword === formData.newPassword
  ) {
    errors.newPassword =
      "New password must be different from current password.";
  }

  // Validate confirmPassword
  if (!formData.confirmPassword?.trim()) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  // Additional security check - ensure passwords are not common patterns
  // const commonPatterns = [
  //   /^12345678/,
  //   /^password/i,
  //   /^qwerty/i,
  //   /^abc123/i,
  //   /^(.)\\1{7,}/, // repeated characters
  // ];

  // if (
  //   formData.newPassword &&
  //   commonPatterns.some((pattern) => pattern.test(formData.newPassword))
  // ) {
  //   errors.newPassword =
  //     "Password is too common. Please choose a more secure password.";
  // }

  return errors;
};

export { validateChangePasswordForm };
