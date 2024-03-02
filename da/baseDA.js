// const ERROR_AUTHEN = "401";
// const NO_ROLE = "403";
// const MULTI_DEVICE = "423";

class BaseDA {
    static post = async (url, { headers, body }) => {
        try {
            if (headers?.params) headers.params = JSON.stringify(headers.params)
            const response = await fetch(url, {
                method: 'POST',
                headers: headers ?? { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (response.status === 200) {
                const jsonData = await response.json()
                return jsonData
            } else {
                const txt = await response.text()
                console.error("Failed to POST data:", txt);
                throw error;
            }
        } catch (error) {
            console.error("Failed to POST data:", error);
            throw error;
        }
    }

    static postFile = async (url, { headers, formData }) => {
        try {
            if (headers?.params) headers.params = JSON.stringify(headers.params)
            if (headers) {
                headers = { "Content-Type": "multipart/form-data" }
            } else {
                headers["Content-Type"] = "multipart/form-data"
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            })
            if (response.status === 200) {
                const jsonData = await response.json()
                return jsonData
            } else {
                const txt = await response.text()
                console.error("Failed to POST data:", txt);
                throw error;
            }
        } catch (error) {
            console.error("Failed to POST data:", error);
            throw error;
        }
    }

    static get = async (url, { headers }) => {
        try {
            if (headers?.params) headers.params = JSON.stringify(headers.params)
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            })
            if (response.status === 200) {
                const jsonData = await response.json()
                return jsonData
            } else {
                const txt = await response.text()
                console.error("Failed to POST data:", txt);
                throw error;
            }
        } catch (error) {
            console.error("Failed to POST data:", error);
            throw error;
        }
    }
}