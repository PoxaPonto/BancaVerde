import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();

    const user = JSON.parse(
        sessionStorage.getItem("user") || "{}"
    );

    const isAdmin = user.role === "Admin";

    function handleLogout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("expiresAt");

        navigate("/");
    }

    return (
        <div style={shellStyle}>
            <aside style={sidebarStyle}>
                <div style={brandStyle}>
                    <LeafMark />
                    <div>
                        <h2 style={logoStyle}>Banca Verde</h2>
                        <p style={brandSubStyle}>Hortifruti</p>
                    </div>
                </div>

                <div style={userBoxStyle}>
                    <div style={avatarStyle}>
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <div style={userNameStyle}>
                            {user.name}
                        </div>

                        <div style={userRoleStyle}>
                            {user.role}
                        </div>
                    </div>
                </div>

                <nav style={navStyle}>
                    <MenuLink to="/dashboard" icon="D" label="Dashboard" />
                    <MenuLink to="/products" icon="P" label="Produtos" />
                    <MenuLink to="/sales" icon="$" label="Vendas" />
                    <MenuLink to="/categories" icon="C" label="Categorias" />

                    {isAdmin && (
                        <>
                            <MenuLink to="/users" icon="U" label="Usuarios" />
                            <MenuLink to="/movements" icon="M" label="Movimentacoes" />
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

function LeafMark() {
    return (
        <span style={brandIconStyle} aria-hidden="true">
            <span style={leafMainStyle} />
            <span style={leafSmallStyle} />
            <span style={leafStemStyle} />
        </span>
    );
}

function MenuLink({ to, icon, label }) {
    return (
        <NavLink
            className="sidebar-link"
            to={to}
            style={({ isActive }) => ({
                ...linkStyle,
                background: isActive
                    ? "linear-gradient(90deg, rgba(0, 230, 118, 0.16), rgba(0, 230, 118, 0.04))"
                    : "transparent",
                color: isActive ? "#ffffff" : "#c8bfd9",
                border: isActive
                    ? "1px solid rgba(0, 230, 118, 0.26)"
                    : "1px solid transparent",
                boxShadow: isActive
                    ? "0 10px 24px rgba(0, 230, 118, 0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                    : "none"
            })}
        >
            <span style={linkIconStyle}>{icon}</span>
            <span>{label}</span>
        </NavLink>
    );
}

const shellStyle = {
    display: "flex",
    minHeight: "100vh",
    background:
        "radial-gradient(circle at 28% 0%, rgba(125, 87, 210, 0.14), transparent 30%), radial-gradient(circle at 86% 100%, rgba(0, 230, 118, 0.06), transparent 26%), #171024"
};

const sidebarStyle = {
    width: "276px",
    background: "linear-gradient(180deg, rgba(31, 22, 49, 0.98), rgba(21, 15, 34, 0.98))",
    padding: "22px 20px",
    borderRight: "1px solid rgba(160, 132, 215, 0.14)",
    boxShadow: "18px 0 45px rgba(0, 0, 0, 0.18), 0 0 42px rgba(125, 87, 210, 0.06)"
};

const brandStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "26px"
};

const brandIconStyle = {
    width: "38px",
    height: "38px",
    position: "relative",
    borderRadius: "10px",
    display: "inline-block",
    background: "rgba(0, 230, 118, 0.1)",
    border: "1px solid rgba(0, 230, 118, 0.24)"
};

const leafMainStyle = {
    position: "absolute",
    left: "36%",
    top: "17%",
    width: "35%",
    height: "50%",
    borderRadius: "80% 0 80% 0",
    background: "linear-gradient(135deg, #60f88f, #00b85f)",
    transform: "rotate(28deg)"
};

const leafSmallStyle = {
    position: "absolute",
    left: "18%",
    top: "36%",
    width: "29%",
    height: "37%",
    borderRadius: "80% 0 80% 0",
    background: "linear-gradient(135deg, #89f6a8, #00d46f)",
    transform: "rotate(-18deg)"
};

const leafStemStyle = {
    position: "absolute",
    left: "43%",
    bottom: "18%",
    width: "32%",
    height: "2px",
    borderRadius: "999px",
    background: "#00e676",
    transform: "rotate(-28deg)",
    transformOrigin: "left center"
};

const logoStyle = {
    color: "#ffffff",
    fontSize: "19px",
    lineHeight: "1.1",
    letterSpacing: "0"
};

const brandSubStyle = {
    marginTop: "3px",
    color: "#00e676",
    fontSize: "11px",
    letterSpacing: "4px",
    textTransform: "uppercase"
};

const userBoxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "linear-gradient(135deg, rgba(52, 38, 77, 0.86), rgba(37, 27, 57, 0.86))",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid rgba(160, 132, 215, 0.16)",
    marginBottom: "24px",
    boxShadow: "0 16px 32px rgba(0,0,0,0.18)"
};

const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#00e676",
    color: "#151022",
    fontWeight: "800"
};

const userNameStyle = {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "4px"
};

const userRoleStyle = {
    color: "#b9afcd",
    fontSize: "13px"
};

const navStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "9px"
};

const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 13px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "800",
    transition: "transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease"
};

const linkIconStyle = {
    width: "28px",
    height: "28px",
    display: "grid",
    placeItems: "center",
    color: "#00e676",
    fontSize: "15px",
    fontWeight: "900"
};

const logoutButtonStyle = {
    marginTop: "28px",
    padding: "12px",
    background: "rgba(239, 68, 68, 0.12)",
    color: "#fecaca",
    border: "1px solid rgba(239, 68, 68, 0.22)",
    borderRadius: "10px",
    fontWeight: "bold"
};

const mainStyle = {
    flex: 1,
    padding: "34px 30px",
    minWidth: 0
};
