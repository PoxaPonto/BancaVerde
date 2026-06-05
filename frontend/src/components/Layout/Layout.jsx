import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <aside
                style={{
                    width: "240px",
                    background: "#111827",
                    padding: "20px",
                    borderRight: "1px solid #1f2937"
                }}
            >
                <h2 style={{ color: "#22c55e", marginBottom: "30px" }}>
                    Banca Verde
                </h2>

                <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/products">Produtos</Link>
                    <Link to="/categories">Categorias</Link>
                    <Link to="/users">Usuários</Link>

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

            <main style={{ flex: 1, padding: "24px" }}>
                <Outlet />
            </main>
        </div>
    );
}