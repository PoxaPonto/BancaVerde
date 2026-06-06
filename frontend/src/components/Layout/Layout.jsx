import { NavLink, Outlet, useNavigate } from "react-router-dom";

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
            <aside style={sidebarStyle}>
                <h2 style={logoStyle}>
                    🌿 Banca Verde
                </h2>

                <div style={userBoxStyle}>
                    <div style={userNameStyle}>
                        👤 {user.name}
                    </div>

                    <div style={userRoleStyle}>
                        🛡️ {user.role}
                    </div>
                </div>

                <nav style={navStyle}>
                    <MenuLink to="/dashboard" icon="📊" label="Dashboard" />
                    <MenuLink to="/products" icon="📦" label="Produtos" />
                    <MenuLink to="/sales" icon="🛒" label="Vendas" />
                    <MenuLink to="/categories" icon="🏷️" label="Categorias" />

                    {isAdmin && (
                        <>
                            <MenuLink to="/users" icon="👥" label="Usuários" />
                            <MenuLink to="/movements" icon="🧾" label="Movimentações" />
                        </>
                    )}

                    <button
                        onClick={handleLogout}
                        style={logoutButtonStyle}
                    >
                        Sair
                    </button>
                </nav>
            </aside>

            <main style={mainStyle}>
                <Outlet />
            </main>
        </div>
    );
}

function MenuLink({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#1f2937" : "transparent",
                color: isActive ? "#22c55e" : "#d1d5db",
                borderLeft: isActive
                    ? "4px solid #22c55e"
                    : "4px solid transparent"
            })}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </NavLink>
    );
}

const sidebarStyle = {
    width: "260px",
    background: "#111827",
    padding: "20px",
    borderRight: "1px solid #1f2937"
};

const logoStyle = {
    color: "#22c55e",
    marginBottom: "30px"
};

const userBoxStyle = {
    background: "#1f2937",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "25px"
};

const userNameStyle = {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "6px"
};

const userRoleStyle = {
    color: "#9ca3af",
    fontSize: "14px"
};

const navStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
};

const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold"
};

const logoutButtonStyle = {
    marginTop: "30px",
    padding: "12px",
    background: "#dc2626",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "bold"
};

const mainStyle = {
    flex: 1,
    padding: "24px"
};