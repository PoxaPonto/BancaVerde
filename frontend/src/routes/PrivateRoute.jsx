import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const token = sessionStorage.getItem("token");
    const expiresAt = sessionStorage.getItem("expiresAt");

    const expired =
        !expiresAt || new Date(expiresAt) <= new Date();

    if (!token || token === "undefined" || token === "null" || expired) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("expiresAt");

        return <Navigate to="/" replace />;
    }

    return children;
}