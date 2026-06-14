import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
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

    if (loading) return <h2>Carregando dashboard...</h2>;
    if (!dashboard) return <h2>Nenhum dado encontrado.</h2>;

    const lowStockItems = dashboard.lowStockItems || [];

    return (
        <div className="page-surface">
            <div style={{ marginBottom: "28px" }}>
                <h1 style={pageTitleStyle}>Dashboard</h1>
                <p style={pageSubtitleStyle}>
                    Visao geral do estoque e desempenho da Banca Verde.
                </p>
            </div>

            <div style={cardsContainerStyle}>
                <Card title="Total de Produtos" value={dashboard.totalProducts} icon="P" />
                <Card title="Categorias" value={dashboard.totalCategories} icon="C" />
                <Card title="Usuarios" value={dashboard.totalUsers} icon="U" />
                <Card title="Estoque Total" value={dashboard.totalStock} icon="E" />
                <Card title="Estoque Baixo" value={dashboard.lowStockProducts} icon="!" warning />
                <Card
                    title="Valor em Estoque"
                    value={formatCurrency(dashboard.totalInventoryValue)}
                    icon="$"
                    compact
                />
            </div>

            {lowStockItems.length > 0 && (
                <div style={lowStockBoxStyle}>
                    <h2 style={{ marginBottom: "14px", color: "#fbbf24" }}>
                        Produtos com Estoque Baixo
                    </h2>

                    <p style={pageSubtitleStyle}>
                        Itens com estoque igual ou menor que 10 unidades.
                    </p>

                    <div style={lowStockListStyle}>
                        {lowStockItems.map((item) => (
                            <div key={item.id} style={lowStockItemStyle}>
                                <strong>{item.name}</strong>
                                <span>{item.stock} unidades</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={chartsGridStyle}>
                <ChartBox
                    title="Produtos por Categoria"
                    dataKey="productCount"
                    fill="#00e676"
                    data={dashboard.productsByCategory}
                />

                <ChartBox
                    title="Estoque por Categoria"
                    dataKey="totalStock"
                    fill="#8b5cf6"
                    data={dashboard.productsByCategory}
                />
            </div>

            <div style={infoGridStyle}>
                <InfoBox
                    title="Produto mais caro"
                    value={
                        dashboard.mostExpensiveProduct
                            ? `${dashboard.mostExpensiveProduct.name} - ${formatCurrency(dashboard.mostExpensiveProduct.price)}`
                            : "Nao encontrado"
                    }
                />

                <InfoBox
                    title="Produto mais barato"
                    value={
                        dashboard.cheapestProduct
                            ? `${dashboard.cheapestProduct.name} - ${formatCurrency(dashboard.cheapestProduct.price)}`
                            : "Nao encontrado"
                    }
                />

                <InfoBox
                    title="Categoria com mais produtos"
                    value={
                        dashboard.categoryWithMostProducts
                            ? `${dashboard.categoryWithMostProducts.name} - ${dashboard.categoryWithMostProducts.productCount} produtos`
                            : "Nao encontrada"
                    }
                />
            </div>
        </div>
    );
}

function ChartBox({ title, data, dataKey, fill }) {
    return (
        <div className="glass-panel" style={chartBoxStyle}>
            <h2 style={{ marginBottom: "18px" }}>{title}</h2>

            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <XAxis dataKey="categoryName" stroke="#b9afcd" />
                        <YAxis stroke="#b9afcd" />
                        <Tooltip
                            contentStyle={{
                                background: "#2b2042",
                                border: "1px solid rgba(160, 132, 215, 0.24)",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                            labelStyle={{ color: "#fff" }}
                        />
                        <Bar
                            dataKey={dataKey}
                            fill={fill}
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function Card({ title, value, icon, warning, compact }) {
    return (
        <div
            className="metric-card"
            style={{
                ...cardStyle,
                border: warning
                    ? "1px solid rgba(251, 191, 36, 0.34)"
                    : "1px solid rgba(160, 132, 215, 0.18)"
            }}
        >
            <div style={{ minWidth: 0 }}>
                <p style={cardTitleStyle}>{title}</p>
                <h2
                    style={{
                        ...cardValueStyle,
                        fontSize: compact ? "24px" : "28px",
                        color: warning ? "#fbbf24" : "#ffffff"
                    }}
                >
                    {value}
                </h2>
            </div>

            <span
                style={{
                    ...cardIconStyle,
                    background: warning ? "rgba(251, 191, 36, 0.14)" : "rgba(0, 230, 118, 0.12)",
                    color: warning ? "#fbbf24" : "#00e676"
                }}
            >
                {icon}
            </span>
        </div>
    );
}

function InfoBox({ title, value }) {
    return (
        <div className="glass-panel" style={infoBoxStyle}>
            <p style={cardTitleStyle}>{title}</p>
            <h3 style={{ marginTop: "10px" }}>{value}</h3>
        </div>
    );
}

const pageTitleStyle = {
    fontSize: "32px",
    letterSpacing: "0",
    lineHeight: "1.05"
};

const pageSubtitleStyle = {
    color: "#b9afcd",
    marginTop: "6px",
    marginBottom: "14px"
};

const cardsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "26px"
};

const cardStyle = {
    background: "linear-gradient(180deg, rgba(45, 33, 69, 0.96), rgba(34, 25, 52, 0.96))",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 18px 36px rgba(0,0,0,0.22), 0 0 34px rgba(125, 87, 210, 0.06)"
};

const cardTitleStyle = {
    color: "#c9bedb",
    fontSize: "13px",
    fontWeight: "700"
};

const cardValueStyle = {
    marginTop: "10px",
    lineHeight: "1.1",
    whiteSpace: "nowrap",
    letterSpacing: "0"
};

const cardIconStyle = {
    width: "42px",
    height: "42px",
    display: "grid",
    placeItems: "center",
    fontSize: "24px",
    borderRadius: "12px",
    flexShrink: 0
};

const lowStockBoxStyle = {
    background: "rgba(40, 29, 62, 0.94)",
    border: "1px solid rgba(251, 191, 36, 0.34)",
    borderRadius: "12px",
    padding: "22px",
    marginBottom: "26px",
    boxShadow: "0 18px 36px rgba(0,0,0,0.22), 0 0 34px rgba(125, 87, 210, 0.06)"
};

const lowStockListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px"
};

const lowStockItemStyle = {
    background: "rgba(57, 42, 82, 0.66)",
    borderRadius: "10px",
    padding: "12px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px"
};

const chartsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "18px",
    marginBottom: "26px"
};

const chartBoxStyle = {
    background: "rgba(40, 29, 62, 0.94)",
    border: "1px solid rgba(160, 132, 215, 0.18)",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 18px 36px rgba(0,0,0,0.22), 0 0 34px rgba(125, 87, 210, 0.06)"
};

const infoGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px"
};

const infoBoxStyle = {
    background: "rgba(40, 29, 62, 0.94)",
    border: "1px solid rgba(160, 132, 215, 0.18)",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 18px 36px rgba(0,0,0,0.16), 0 0 28px rgba(125, 87, 210, 0.05)"
};
