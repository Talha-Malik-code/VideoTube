import newToast from "./component/toasts/Toast";


async function updateWithFormData(
    path,
    formData,
    cradential = {},
    methodType = "POST"
) {
    try {
        const response = await fetch(`/api/v1/${path}`, {
            method: methodType,
            body: formData,
            ...cradential
        });

        const data = await response.json();

        if (data.success) {
            newToast("success", data.message);
            return data.data;
        } else {
            newToast("error", data.message);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchData(path, header = {}) {
    try {
        const res = await fetch(`/api/v1/${path}`, {
            method: "GET",
            credentials: "include",
            headers: header
        });

        const data = await res.json();

        if (data.success) {
            newToast("success", data.message);
            return data.data;
        } else {
            console.log(data);
            newToast("error", data.message);
        }
    } catch (error) {
        console.error(error);
        newToast("warn", "Try after sometime");
        return null;
    }
};

async function updateData(
    path,
    content,
    methodType="PATCH"
) {
    try {
        const res = await fetch(`/api/v1/${path}`, {
            method: methodType,
            body: JSON.stringify(content),
            headers: {
                'content-type': "application/json"
            },
            credentials: "include"
        });
    
        const data = await res.json();
    
        if (data.success) {
            newToast("success", data.message);
            return data.data
        } else {
            console.log(data);
            newToast("error", data.message);
            return null;
        }
    } catch (error) {
        console.error(error);
        newToast("warn", "Try after sometime");
    }
}

export {
    updateWithFormData,
    fetchData,
    updateData
}