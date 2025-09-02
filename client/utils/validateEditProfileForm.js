/**
 * A comprehensive validator for the edit profile form.
 * It checks the firstName, lastName, and email fields.
 *
 * @param {object} formData - The state of the edit profile form inputs.
 * @returns {object} An object containing error messages for invalid fields.
 */
const validateEditProfileForm = (formData) => {
  const errors = {};

  // Validate firstName
  if (!formData.firstName?.trim()) {
    errors.firstName = "First name is required.";
  } else if (formData.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  } else if (formData.firstName.length > 50) {
    errors.firstName = "First name must be less than 50 characters.";
  } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName)) {
    errors.firstName =
      "First name can only contain letters, spaces, hyphens, and apostrophes.";
  }

  // Validate lastName
  if (!formData.lastName?.trim()) {
    errors.lastName = "Last name is required.";
  } else if (formData.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  } else if (formData.lastName.length > 50) {
    errors.lastName = "Last name must be less than 50 characters.";
  } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName)) {
    errors.lastName =
      "Last name can only contain letters, spaces, hyphens, and apostrophes.";
  }

  // Validate email
  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
  } else if (formData.email.length > 255) {
    errors.email = "Email must be less than 255 characters.";
  }

  return errors;
};

export { validateEditProfileForm };
