import NewToast from "./component/toasts/Toast";
import { FrontendError } from "./utils/FrontendError";

async function updateWithFormData(
  path,
  formData,
  credential = {},
  methodType = "POST"
) {
  try {
    console.log(formData);

    const response = await fetch(`/api/v1/${path}`, {
      method: methodType,
      body: formData,
      credentials: "include",
      ...credential,
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", response.status, errorText);
      const frontendError = FrontendError.fromServerResponse(
        response,
        errorText
      );
      throw frontendError;
    }

    const data = await response.json();

    if (data.success) {
      NewToast("success", data.message);
      return data.data;
    } else {
      const error = new FrontendError(
        data.message || "Operation failed",
        response.status,
        "SERVER_ERROR",
        null,
        { responseData: data }
      );
      throw error;
    }
  } catch (error) {
    console.error(error);

    // If it's already a FrontendError, re-throw it
    if (error instanceof FrontendError) {
      throw error;
    }

    // Handle network errors (fetch failures)
    const networkError = FrontendError.networkError(
      "Unable to connect to server. Please check your connection.",
      error
    );
    throw networkError;
  }
}

async function fetchData(path, header = {}) {
  try {
    const res = await fetch(`/api/v1/${path}`, {
      method: "GET",
      credentials: "include",
      headers: header,
    });

    // Check if response is ok before parsing JSON
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", res.status, errorText);
      const frontendError = FrontendError.fromServerResponse(res, errorText);
      throw frontendError;
    }

    const data = await res.json();
    console.log(data);

    if (data.success) {
      NewToast("success", data.message);
      return data.data;
    } else {
      console.log(data);
      const error = new FrontendError(
        data.message || "Request failed",
        res.status,
        "SERVER_ERROR",
        null,
        { responseData: data }
      );
      throw error;
    }
  } catch (error) {
    console.error(error);

    // If it's already a FrontendError, re-throw it
    if (error instanceof FrontendError) {
      throw error;
    }

    // Handle network errors (fetch failures)
    const networkError = FrontendError.networkError(
      "Unable to connect to server. Please check your connection.",
      error
    );
    throw networkError;
  }
}

async function updateData(path, content, methodType = "PATCH") {
  try {
    const res = await fetch(`/api/v1/${path}`, {
      method: methodType,
      body: JSON.stringify(content),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    // Check if response is ok before parsing JSON
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", res.status, errorText);
      const frontendError = FrontendError.fromServerResponse(res, errorText);
      throw frontendError;
    }

    const data = await res.json();

    if (data.success) {
      NewToast("success", data.message);
      return data.data;
    } else {
      console.log(data);
      const error = new FrontendError(
        data.message || "Update failed",
        res.status,
        "SERVER_ERROR",
        null,
        { responseData: data }
      );
      throw error;
    }
  } catch (error) {
    console.error(error);

    // If it's already a FrontendError, re-throw it
    if (error instanceof FrontendError) {
      throw error;
    }

    // Handle network errors (fetch failures)
    const networkError = FrontendError.networkError(
      "Unable to connect to server. Please check your connection.",
      error
    );
    throw networkError;
  }
}

export { updateWithFormData, fetchData, updateData };
