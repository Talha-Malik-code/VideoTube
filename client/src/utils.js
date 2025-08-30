import { data } from "react-router-dom";
import NewToast from "./component/toasts/Toast";
import { ApiError } from "../../backend/src/utils/ApiError";

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
      NewToast("error", `Server error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.success) {
      NewToast("success", data.message);
      return data.data;
    } else {
      NewToast("error", data.message);
      return null;
    }
  } catch (error) {
    console.error(error);
    NewToast("error", "Network error. Please try again.");
    return null;
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
      NewToast("error", `Server error: ${res.status}`);
      throw new Error(errorText);
    }

    const data = await res.json();
    console.log(data);

    if (data.success) {
      NewToast("success", data.message);
      return data.data;
    } else {
      console.log(data);
      NewToast("error", data.message);
      throw new Error(data.message, { cause: data.data });
    }
  } catch (error) {
    console.error(error);
    NewToast("warn", error.message || "Try again later");
    return data;
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
      NewToast("error", `Server error: ${res.status}`);
      return null;
    }

    const data = await res.json();

    if (data.success) {
      NewToast("success", data.message);
      return data.data;
    } else {
      console.log(data);
      NewToast("error", data.message);
      return null;
    }
  } catch (error) {
    console.error(error);
    NewToast("warn", "Try after sometime");
    return null;
  }
}

export { updateWithFormData, fetchData, updateData };
