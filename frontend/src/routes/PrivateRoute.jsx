import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
        return <Navigate to="/" replace />;
    }

    return children;
}