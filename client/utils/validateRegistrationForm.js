/**
 * A comprehensive validator for the registration form.
 * It checks the profile image, email, username, and password fields.
 *
 * @param {object} profileImg - The state of the profile image file.
 * @param {object} credentials - The state of the registration form inputs.
 * @returns {object} An object containing error messages for invalid fields.
 */
const validateRegistrationForm = (profileImg, credentials) => {
  const errors = {};

  // Validate profile image
  if (!profileImg) {
    errors.profileImg = "A profile image is required.";
  }

  // Validate email
  if (!credentials.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
    errors.email = "Email address is invalid.";
  }

  // Validate username
  if (!credentials.username.trim()) {
    errors.username = "Username is required.";
  }

  // -Validate password
  if (!credentials.password.trim()) {
    errors.password = "Password is required.";
  } else if (credentials.password.includes(" ")) {
    errors.password = "Password cannot contain spaces.";
  } else if (credentials.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[0-9]/.test(credentials.password)) {
    errors.password = "Password must contain at least one number.";
  }

  // Validate confirmPassword
  if (!credentials.confirmPassword.trim()) {
    errors.confirmPassword = "Confirming your password is required.";
  } else if (credentials.password !== credentials.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export { validateRegistrationForm };
