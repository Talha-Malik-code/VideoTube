/**
 * Custom Error class for frontend applications
 * Similar to backend ApiError but designed for client-side error handling
 */
class FrontendError extends Error {
  constructor(
    message = "Something went wrong",
    statusCode = 500,
    type = "UNKNOWN_ERROR",
    originalError = null,
    context = {}
  ) {
    super(message);

    this.name = "FrontendError";
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
    this.originalError = originalError;
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.success = false;

    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Create a network error
   */
  static networkError(
    message = "Network error occurred",
    originalError = null
  ) {
    return new FrontendError(
      message,
      0, // 0 indicates network error
      "NETWORK_ERROR",
      originalError,
      { isNetworkError: true }
    );
  }

  /**
   * Create a server error
   */
  static serverError(
    statusCode,
    message = "Server error occurred",
    originalError = null
  ) {
    return new FrontendError(
      message,
      statusCode,
      "SERVER_ERROR",
      originalError,
      { isServerError: true }
    );
  }

  /**
   * Create a validation error
   */
  static validationError(message = "Validation failed", details = []) {
    return new FrontendError(message, 400, "VALIDATION_ERROR", null, {
      validationDetails: details,
    });
  }

  /**
   * Create an authentication error
   */
  static authError(message = "Authentication required") {
    return new FrontendError(message, 401, "AUTH_ERROR", null, {
      isAuthError: true,
    });
  }

  /**
   * Create an authorization error
   */
  static forbiddenError(message = "Access forbidden") {
    return new FrontendError(message, 403, "FORBIDDEN_ERROR", null, {
      isForbiddenError: true,
    });
  }

  /**
   * Create a not found error
   */
  static notFoundError(message = "Resource not found") {
    return new FrontendError(message, 404, "NOT_FOUND_ERROR", null, {
      isNotFoundError: true,
    });
  }

  /**
   * Parse server response and create appropriate error
   */
  static fromServerResponse(response, responseText, originalError = null) {
    const status = response?.status || 500;
    let message = "An error occurred";
    let parsedData = null;

    try {
      parsedData = JSON.parse(responseText);
      message = parsedData.message || message;
    } catch (e) {
      // If response is not JSON, use status text or response text
      message = response?.statusText || responseText || message;
    }

    // Determine error type based on status code
    let type = "SERVER_ERROR";
    if (status === 401) type = "AUTH_ERROR";
    else if (status === 403) type = "FORBIDDEN_ERROR";
    else if (status === 404) type = "NOT_FOUND_ERROR";
    else if (status >= 400 && status < 500) type = "CLIENT_ERROR";
    else if (status >= 500) type = "SERVER_ERROR";

    return new FrontendError(message, status, type, originalError, {
      responseData: parsedData,
      responseText,
      isServerError: status >= 500,
      isClientError: status >= 400 && status < 500,
    });
  }

  /**
   * Check if error is a network error (server unreachable)
   */
  isNetworkError() {
    return this.type === "NETWORK_ERROR" || this.statusCode === 0;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError() {
    return this.statusCode >= 500;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError() {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is authentication related
   */
  isAuthError() {
    return this.type === "AUTH_ERROR" || this.statusCode === 401;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage() {
    switch (this.type) {
      case "NETWORK_ERROR":
        return "Unable to connect to server. Please check your internet connection and try again.";
      case "AUTH_ERROR":
        return "Please log in to continue.";
      case "FORBIDDEN_ERROR":
        return "You don't have permission to perform this action.";
      case "NOT_FOUND_ERROR":
        return "The requested resource was not found.";
      case "VALIDATION_ERROR":
        return this.message || "Please check your input and try again.";
      case "SERVER_ERROR":
        if (this.statusCode >= 500) {
          return "Server is temporarily unavailable. Please try again later.";
        }
        return this.message || "An error occurred. Please try again.";
      default:
        return this.message || "Something went wrong. Please try again.";
    }
  }

  /**
   * Convert error to plain object for logging/debugging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      type: this.type,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message,
            stack: this.originalError.stack,
          }
        : null,
    };
  }
}

export { FrontendError };
