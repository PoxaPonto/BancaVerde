import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const isAdmin = user.role === "Admin";

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <aside
                style={{
                    width: "260px",
                    background: "#111827",
                    padding: "20px",
                    borderRight: "1px solid #1f2937"
                }}
            >
                <h2
                    style={{
                        color: "#22c55e",
                        marginBottom: "30px"
                    }}
                >
                    Banca Verde
                </h2>

                <div
                    style={{
                        background: "#1f2937",
                        padding: "14px",
                        borderRadius: "10px",
                        marginBottom: "25px"
                    }}
                >
                    <div
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            marginBottom: "6px"
                        }}
                    >
                        👤 {user.name}
                    </div>

                    <div
                        style={{
                            color: "#9ca3af",
                            fontSize: "14px"
                        }}
                    >
                        🛡️ {user.role}
                    </div>
                </div>

                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}
                >
                    <Link to="/dashboard">Dashboard</Link>

                    <Link to="/products">
                        Produtos
                    </Link>

                    <Link to="/categories">
                        Categorias
                    </Link>

                    {isAdmin && (
                        <>
                            <Link to="/users">
                                Usuários
                            </Link>

                            <Link to="/movements">
                                Movimentações
                            </Link>
                        </>
                    )}

                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: "30px",
                            padding: "10px",
                            background: "#dc2626",
                            color: "#fff",
                            borderRadius: "8px"
                        }}
                    >
                        Sair
                    </button>
                </nav>
            </aside>

            <main
                style={{
                    flex: 1,
                    padding: "24px"
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}