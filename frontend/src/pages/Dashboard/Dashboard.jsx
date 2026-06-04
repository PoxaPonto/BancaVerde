import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const response = await api.get("/Dashboard");

                console.log("Resposta Dashboard:", response.data);

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
        return (
            <div style={{ padding: "20px" }}>
                <h2>Carregando dashboard...</h2>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Nenhum dado encontrado.</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>

            <p>Produtos: {dashboard.totalProducts}</p>
            <p>Categorias: {dashboard.totalCategories}</p>
            <p>Estoque Total: {dashboard.totalStock}</p>
            <p>Valor do Estoque: R$ {dashboard.totalInventoryValue}</p>

            <hr />

            <h2>Produto mais caro</h2>
            <p>
                {dashboard.mostExpensiveProduct?.name || "Não encontrado"} - R$ {dashboard.mostExpensiveProduct?.price || 0}
            </p>

            <h2>Produto mais barato</h2>
            <p>
                {dashboard.cheapestProduct?.name || "Não encontrado"} - R$ {dashboard.cheapestProduct?.price || 0}
            </p>

            <h2>Categoria com mais produtos</h2>
            <p>
                {dashboard.categoryWithMostProducts?.name || "Não encontrada"} - {dashboard.categoryWithMostProducts?.productCount || 0} produtos
            </p>
        </div>
    );
}