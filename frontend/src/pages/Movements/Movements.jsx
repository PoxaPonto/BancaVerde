import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Movements() {
    const [movements, setMovements] = useState([]);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const filteredMovements = movements
        .filter((movement) =>
            movement.userName.toLowerCase().includes(search.toLowerCase()) ||
            movement.productName.toLowerCase().includes(search.toLowerCase())
        )
        .filter((movement) =>
            actionFilter === "all"
                ? true
                : movement.action === actionFilter
        );

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
        <div className="page-surface">
            <h1>Movimentações de Estoque</h1>

            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
                Histórico de ações realizadas pelos administradores.
            </p>

            <div style={filtersContainerStyle}>
                <input
                    type="text"
                    placeholder="Pesquisar por usuário ou produto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={filterInputStyle}
                />

                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    style={filterInputStyle}
                >
                    <option value="all">Todas as ações</option>
                    <option value="CREATE">CREATE</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                    <option value="SALE">SALE</option>
                </select>
            </div>

            <div className="glass-panel" style={terminalStyle}>
                {filteredMovements.length === 0 ? (
                    <p style={{ color: "#9ca3af" }}>
                        Nenhuma movimentação encontrada.
                    </p>
                ) : (
                    filteredMovements.map((movement, index) => (
                        <div
                            key={movement.id}
                            style={{
                                ...lineStyle,
                                ...(index === 0 ? latestLineStyle : {})
                            }}
                        >
                            {index === 0 && (
                                <span style={latestLabelStyle}>
                                    ULTIMA MOVIMENTACAO
                                </span>
                            )}

                            <span style={actionStyle}>
                                {movement.action}
                            </span>

                            <span>
                                {formatMovement(movement)}
                            </span>
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

    if (movement.action === "SALE") {
        return `[${date}] ${movement.userName} registrou saída de estoque em "${movement.productName}" (${movement.oldStock} → ${movement.newStock})`;
    }

    return `[${date}] ${movement.action}`;
}

const filtersContainerStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "18px"
};

const filterInputStyle = {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    background: "rgba(40, 29, 62, 0.94)",
    color: "#fff",
    border: "1px solid rgba(160, 132, 215, 0.18)"
};

const terminalStyle = {
    background: "linear-gradient(180deg, rgba(18, 13, 31, 0.96), rgba(13, 9, 23, 0.96))",
    padding: "20px",
    borderRadius: "12px",
    fontFamily: "monospace",
    minHeight: "500px",
    border: "1px solid rgba(160, 132, 215, 0.18)",
    boxShadow: "0 18px 36px rgba(0,0,0,0.22), 0 0 34px rgba(125, 87, 210, 0.06)"
};

const lineStyle = {
    marginBottom: "14px",
    color: "#d8d1e6",
    lineHeight: "1.6"
};

const latestLineStyle = {
    background: "rgba(40, 29, 62, 0.88)",
    borderLeft: "4px solid #00e676",
    padding: "14px",
    borderRadius: "8px",
    color: "#ffffff"
};

const latestLabelStyle = {
    display: "block",
    color: "#00e676",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "6px",
    letterSpacing: "1px"
};

const actionStyle = {
    color: "#00e676",
    fontWeight: "bold",
    marginRight: "10px"
};
