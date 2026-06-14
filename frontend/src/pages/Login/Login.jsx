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

            const loginData = response.data.data;

            sessionStorage.setItem("token", loginData.token);

            sessionStorage.setItem(
                "user",
                JSON.stringify(loginData)
            );

            sessionStorage.setItem(
                "expiresAt",
                loginData.expiresAt
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
        <div className="login-page" style={pageStyle}>
            <span style={{ ...glowStyle, left: "-90px", top: "20%" }} />
            <span style={{ ...glowStyle, right: "-120px", bottom: "8%", opacity: 0.55 }} />

            <form onSubmit={handleLogin} style={formStyle}>
                <div style={brandStyle}>
                    <LeafLogo />

                    <div>
                        <h1 style={brandNameStyle}>Banca Verde</h1>
                        <p style={brandSubStyle}>Hortifruit</p>
                    </div>
                </div>

                <h2 style={titleStyle}>Login</h2>

                <label style={labelStyle}>Usuario</label>

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={inputStyle}
                />

                <label style={labelStyle}>Senha</label>

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={{
                        ...inputStyle,
                        marginBottom: "28px"
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...buttonStyle,
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

function LeafLogo() {
    return (
        <span style={leafLogoStyle} aria-hidden="true">
            <span style={leafMainStyle} />
            <span style={leafSmallStyle} />
            <span style={leafStemStyle} />
        </span>
    );
}

const pageStyle = {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "26px",
    background:
        "radial-gradient(circle at 16% 48%, rgba(151, 114, 255, 0.28), transparent 18%), radial-gradient(circle at 78% 18%, rgba(120, 82, 190, 0.2), transparent 28%), linear-gradient(135deg, #171024 0%, #211833 52%, #171023 100%)"
};

const glowStyle = {
    position: "absolute",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(155, 118, 255, 0.22)",
    filter: "blur(54px)"
};

const formStyle = {
    position: "relative",
    width: "min(100%, 390px)",
    background:
        "linear-gradient(180deg, rgba(40, 29, 62, 0.96), rgba(45, 34, 68, 0.96))",
    padding: "34px",
    borderRadius: "18px",
    border: "1px solid rgba(198, 173, 255, 0.16)",
    boxShadow:
        "0 24px 70px rgba(0,0,0,0.36), 0 0 44px rgba(139, 92, 246, 0.14)"
};

const brandStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "22px"
};

const brandNameStyle = {
    color: "#ffffff",
    fontSize: "18px",
    lineHeight: "1",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase"
};

const brandSubStyle = {
    marginTop: "6px",
    color: "#00e676",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "5px",
    textTransform: "uppercase"
};

const titleStyle = {
    textAlign: "center",
    marginBottom: "24px",
    color: "#00e676",
    fontSize: "28px",
    lineHeight: "1",
    fontWeight: "900",
    letterSpacing: "0",
    textTransform: "uppercase"
};

const labelStyle = {
    display: "block",
    color: "#ddd5ea",
    fontSize: "13px",
    marginBottom: "8px"
};

const inputStyle = {
    width: "100%",
    padding: "14px 15px",
    marginBottom: "15px",
    borderRadius: "8px",
    background: "rgba(65, 50, 92, 0.62)",
    color: "#fff",
    border: "1px solid rgba(160, 132, 215, 0.12)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)"
};

const buttonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    background: "#00e676",
    color: "#111827",
    fontWeight: "900",
    boxShadow: "0 14px 30px rgba(0, 230, 118, 0.24)"
};

const leafLogoStyle = {
    position: "relative",
    width: "42px",
    height: "42px",
    display: "inline-block",
    flexShrink: 0
};

const leafMainStyle = {
    position: "absolute",
    left: "42%",
    top: "8%",
    width: "34%",
    height: "52%",
    borderRadius: "80% 0 80% 0",
    background: "linear-gradient(135deg, #71ff9b, #00b85f)",
    transform: "rotate(28deg)",
    boxShadow: "0 8px 18px rgba(0, 230, 118, 0.24)"
};

const leafSmallStyle = {
    position: "absolute",
    left: "18%",
    top: "28%",
    width: "32%",
    height: "42%",
    borderRadius: "80% 0 80% 0",
    background: "linear-gradient(135deg, #8dffad, #00d46f)",
    transform: "rotate(-18deg)"
};

const leafStemStyle = {
    position: "absolute",
    left: "38%",
    bottom: "18%",
    width: "42%",
    height: "3px",
    borderRadius: "999px",
    background: "#00e676",
    transform: "rotate(-28deg)",
    transformOrigin: "left center"
};
