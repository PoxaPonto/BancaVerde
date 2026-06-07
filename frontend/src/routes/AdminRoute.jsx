import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const token = sessionStorage.getItem("token");
    const expiresAt = sessionStorage.getItem("expiresAt");
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    const expired =
        !expiresAt || new Date(expiresAt) <= new Date();

    if (!token || expired) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("expiresAt");

        return <Navigate to="/" replace />;
    }

    if (user.role !== "Admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}