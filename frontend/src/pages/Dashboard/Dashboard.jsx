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
                <Card title="Estoque Baixo" value={dashboard.lowStockProducts} icon="⚠️" warning />
                <Card
                    title="Valor em Estoque"
                    value={formatCurrency(dashboard.totalInventoryValue)}
                    icon="💰"
                    compact
                />
            </div>

            {lowStockItems.length > 0 && (
                <div style={lowStockBoxStyle}>
                    <h2 style={{ marginBottom: "14px", color: "#fbbf24" }}>
                        Produtos com Estoque Baixo
                    </h2>

                    <p style={{ color: "#9ca3af", marginBottom: "14px" }}>
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
                    fill="#22c55e"
                    data={dashboard.productsByCategory}
                />

                <ChartBox
                    title="Estoque por Categoria"
                    dataKey="totalStock"
                    fill="#f59e0b"
                    data={dashboard.productsByCategory}
                />
            </div>

            <div style={infoGridStyle}>
                <InfoBox
                    title="Produto mais caro"
                    value={
                        dashboard.mostExpensiveProduct
                            ? `${dashboard.mostExpensiveProduct.name} - ${formatCurrency(dashboard.mostExpensiveProduct.price)}`
                            : "Não encontrado"
                    }
                />

                <InfoBox
                    title="Produto mais barato"
                    value={
                        dashboard.cheapestProduct
                            ? `${dashboard.cheapestProduct.name} - ${formatCurrency(dashboard.cheapestProduct.price)}`
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

function ChartBox({ title, data, dataKey, fill }) {
    return (
        <div style={chartBoxStyle}>
            <h2 style={{ marginBottom: "18px" }}>{title}</h2>

            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <XAxis dataKey="categoryName" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                background: "#111827",
                                border: "1px solid #374151",
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
            style={{
                ...cardStyle,
                border: warning
                    ? "1px solid #f59e0b"
                    : "1px solid #1f2937"
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
                    background: warning ? "#451a03" : "#1f2937"
                }}
            >
                {icon}
            </span>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginBottom: "26px"
};

const cardStyle = {
    background: "#111827",
    borderRadius: "14px",
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
};

const cardTitleStyle = {
    color: "#9ca3af",
    fontSize: "14px"
};

const cardValueStyle = {
    marginTop: "10px",
    lineHeight: "1.1",
    whiteSpace: "nowrap"
};

const cardIconStyle = {
    fontSize: "30px",
    padding: "12px",
    borderRadius: "12px",
    flexShrink: 0
};

const lowStockBoxStyle = {
    background: "#111827",
    border: "1px solid #f59e0b",
    borderRadius: "14px",
    padding: "22px",
    marginBottom: "26px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
};

const lowStockListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px"
};

const lowStockItemStyle = {
    background: "#1f2937",
    borderRadius: "10px",
    padding: "12px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px"
};

const chartsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "18px",
    marginBottom: "26px"
};

const chartBoxStyle = {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
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