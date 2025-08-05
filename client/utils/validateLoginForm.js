function validateLoginForm(credentials) {
  const errors = {};

  if (!credentials.identity.trim()) {
    errors.identity = "username or email is required";
  }

  if (!credentials.password.trim()) {
    errors.password = "Password is required.";
  } else if (credentials.password.includes(" ")) {
    errors.password = "Password cannot contain spaces.";
  }

  return errors;
}

export { validateLoginForm };
