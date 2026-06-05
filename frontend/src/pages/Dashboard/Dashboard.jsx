import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const response = await api.get("/Dashboard");
                setDashboard(response.data.data);
            }
            catch (error) {
                console.error("Erro ao carregar dashboard:", error);
                alert("Erro ao carregar dashboard.");
            }
            finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (loading) {
        return <h2>Carregando dashboard...</h2>;
    }

    if (!dashboard) {
        return <h2>Nenhum dado encontrado.</h2>;
    }

    return (
        <div>
            <div style={{ marginBottom: "28px" }}>
                <h1>Dashboard</h1>
                <p style={{ color: "#9ca3af", marginTop: "6px" }}>
                    Visão geral do estoque e desempenho da Banca Verde.
                </p>
            </div>

            <div style={cardsContainerStyle}>
                <Card title="Total de Produtos" value={dashboard.totalProducts} icon="📦" />
                <Card title="Categorias" value={dashboard.totalCategories} icon="🏷️" />
                <Card title="Usuários" value={dashboard.totalUsers} icon="👥" />
                <Card title="Estoque Total" value={dashboard.totalStock} icon="📈" />
                <Card title="Valor em Estoque" value={`R$ ${dashboard.totalInventoryValue}`} icon="💰" />
            </div>

            <div style={infoGridStyle}>
                <InfoBox
                    title="Produto mais caro"
                    value={
                        dashboard.mostExpensiveProduct
                            ? `${dashboard.mostExpensiveProduct.name} - R$ ${dashboard.mostExpensiveProduct.price}`
                            : "Não encontrado"
                    }
                />

                <InfoBox
                    title="Produto mais barato"
                    value={
                        dashboard.cheapestProduct
                            ? `${dashboard.cheapestProduct.name} - R$ ${dashboard.cheapestProduct.price}`
                            : "Não encontrado"
                    }
                />

                <InfoBox
                    title="Categoria com mais produtos"
                    value={
                        dashboard.categoryWithMostProducts
                            ? `${dashboard.categoryWithMostProducts.name} - ${dashboard.categoryWithMostProducts.productCount} produtos`
                            : "Não encontrada"
                    }
                />
            </div>
        </div>
    );
}

function Card({ title, value, icon }) {
    return (
        <div style={cardStyle}>
            <div>
                <p style={cardTitleStyle}>{title}</p>
                <h2 style={cardValueStyle}>{value}</h2>
            </div>

            <span style={cardIconStyle}>{icon}</span>
        </div>
    );
}

function InfoBox({ title, value }) {
    return (
        <div style={infoBoxStyle}>
            <p style={cardTitleStyle}>{title}</p>
            <h3 style={{ marginTop: "10px" }}>{value}</h3>
        </div>
    );
}

const cardsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "26px"
};

const cardStyle = {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "14px",
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
};

const cardTitleStyle = {
    color: "#9ca3af",
    fontSize: "14px"
};

const cardValueStyle = {
    marginTop: "10px",
    fontSize: "28px",
    color: "#ffffff"
};

const cardIconStyle = {
    fontSize: "34px",
    background: "#1f2937",
    padding: "12px",
    borderRadius: "12px"
};

const infoGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px"
};

const infoBoxStyle = {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "14px",
    padding: "22px"
};