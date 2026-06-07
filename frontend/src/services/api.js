import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5092/api"
});

function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("expiresAt");

    window.location.href = "/";
}

function isTokenExpired() {
    const expiresAt = sessionStorage.getItem("expiresAt");

    if (!expiresAt) {
        return true;
    }

    return new Date(expiresAt) <= new Date();
}

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token && isTokenExpired()) {
        logout();
        return config;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            logout();
        }

        return Promise.reject(error);
    }
);

export default api;