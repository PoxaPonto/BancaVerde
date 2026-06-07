import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

import App from "./App.jsx";

import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />

        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="dark"
        />
    </StrictMode>
);