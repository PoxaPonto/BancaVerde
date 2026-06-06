import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const response = await api.get("/Products");
            setProducts(response.data.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar produtos.");
        }
    }

    async function handleSale(e) {
        e.preventDefault();

        if (!productId || !quantity || Number(quantity) <= 0) {
            toast.error("Selecione um produto e informe uma quantidade válida.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/StockMovements/sale", {
                productId: Number(productId),
                quantity: Number(quantity)
            });

            toast.success("Venda registrada com sucesso!");

            setProductId("");
            setQuantity("");

            loadProducts();
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Erro ao registrar venda."
            );
        }
        finally {
            setLoading(false);
        }
    }

    const selectedProduct = products.find(
        (product) => product.id === Number(productId)
    );

    return (
        <div>
            <h1>Vendas</h1>

            <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                Registre saídas de estoque e acompanhe as movimentações.
            </p>

            <form onSubmit={handleSale} style={formStyle}>
                <label style={labelStyle}>Produto</label>

                <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Selecione um produto</option>

                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} — Estoque: {product.stock}
                        </option>
                    ))}
                </select>

                <label style={labelStyle}>Quantidade vendida</label>

                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ex: 1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={inputStyle}
                />

                {selectedProduct && (
                    <div style={infoBoxStyle}>
                        <p>
                            <strong>Produto:</strong> {selectedProduct.name}
                        </p>

                        <p>
                            <strong>Estoque atual:</strong> {selectedProduct.stock}
                        </p>

                        <p>
                            <strong>Estoque após venda:</strong>{" "}
                            {selectedProduct.stock - Number(quantity || 0)}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={buttonStyle}
                >
                    {loading ? "Registrando..." : "Registrar Venda"}
                </button>
            </form>
        </div>
    );
}

const formStyle = {
    maxWidth: "520px",
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
};

const labelStyle = {
    display: "block",
    color: "#d1d5db",
    marginBottom: "8px",
    marginTop: "14px",
    fontWeight: "bold"
};

const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #374151"
};

const infoBoxStyle = {
    marginTop: "18px",
    background: "#1f2937",
    borderRadius: "10px",
    padding: "14px",
    color: "#d1d5db",
    lineHeight: "1.7"
};

const buttonStyle = {
    marginTop: "22px",
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    background: "#22c55e",
    color: "#fff",
    fontWeight: "bold"
};