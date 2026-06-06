import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await api.post("/Auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data)
            );

            toast.success("Login realizado com sucesso!");

            navigate("/dashboard");
        }
        catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Erro ao realizar login."
            );
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg, #0f1117, #1b2230)"
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    width: "420px",
                    background: "#1a1f2b",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow:
                        "0 0 30px rgba(0,0,0,0.4)"
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "10px",
                        color: "#4ade80"
                    }}
                >
                    Banca Verde
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        color: "#9ca3af"
                    }}
                >
                    Sistema de Gestão Hortifruti
                </p>

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "14px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        background: "#2a3142",
                        color: "#fff"
                    }}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "14px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        background: "#2a3142",
                        color: "#fff"
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "8px",
                        background: loading ? "#16a34a" : "#22c55e",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading
                        ? "Entrando..."
                        : "Entrar"}
                </button>
            </form>
        </div>
    );
}