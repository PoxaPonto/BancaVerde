import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Movements() {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMovements();
    }, []);

    async function loadMovements() {
        try {
            const response = await api.get("/StockMovements");
            setMovements(response.data.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar movimentações.");
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <h2>Carregando movimentações...</h2>;
    }

    return (
        <div>
            <h1>Movimentações de Estoque</h1>

            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
                Histórico de ações realizadas pelos administradores.
            </p>

            <div style={terminalStyle}>
                {movements.length === 0 ? (
                    <p>Nenhuma movimentação encontrada.</p>
                ) : (
                    movements.map((movement) => (
                        <div
                            key={movement.id}
                            style={lineStyle}
                        >
                            {formatMovement(movement)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function formatMovement(movement) {
    const date = new Date(
        movement.createdAt
    ).toLocaleString("pt-BR");

    if (movement.action === "CREATE") {
        return `[${date}] ${movement.userName} criou o produto "${movement.productName}" (Estoque: ${movement.newStock})`;
    }

    if (movement.action === "UPDATE") {
        return `[${date}] ${movement.userName} alterou "${movement.productName}" (${movement.oldStock} → ${movement.newStock})`;
    }

    if (movement.action === "DELETE") {
        return `[${date}] ${movement.userName} removeu o produto "${movement.productName}"`;
    }

    return `[${date}] ${movement.action}`;
}

const terminalStyle = {
    background: "#000",
    color: "#22c55e",
    padding: "20px",
    borderRadius: "12px",
    fontFamily: "monospace",
    minHeight: "500px",
    border: "1px solid #1f2937"
};

const lineStyle = {
    marginBottom: "12px"
};