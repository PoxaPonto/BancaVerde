import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);
    
    async function loadProducts() {
        try {
            const response = await api.get(
                "/Products?page=1&pageSize=1000&search=&category=all&sort=name-asc"
            );

            setProducts(response.data.data.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar produtos.");
    }
}



    const filteredProducts = productSearch.trim()
        ? products.filter((product) =>
            product.name
            .toLowerCase()
            .includes(productSearch.trim().toLowerCase())
        )
        : [];

    const selectedProduct = products.find(
        (product) => product.id === Number(productId)
    );

    function handleSelectProduct(product) {
        setProductId(product.id);
        setProductSearch(product.name);
    }

    async function handleSale(e) {
        e.preventDefault();

        if (!productId || !quantity || Number(quantity) <= 0) {
            toast.error("Selecione um produto e informe uma quantidade válida.");
            return;
        }

        if (selectedProduct && Number(quantity) > selectedProduct.stock) {
            toast.error("A quantidade vendida não pode ser maior que o estoque atual.");
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
            setProductSearch("");
            setQuantity("");

            loadProducts();
        }
        catch (error) {
            console.error("ERRO COMPLETO:", error);

            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);

            toast.error("Erro ao carregar produtos.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Vendas</h1>

            <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                Registre saídas de estoque e acompanhe as movimentações.
            </p>

            <form onSubmit={handleSale} style={formStyle}>
                <label style={labelStyle}>Produto</label>

                <div style={searchWrapperStyle}>
                    <input
                        type="text"
                        placeholder="Digite o nome do produto..."
                        value={productSearch}
                        onChange={(e) => {
                            setProductSearch(e.target.value);
                            setProductId("");
                        }}
                        style={inputStyle}
                    />

                    {filteredProducts.length > 0 && !productId && (
                        <div style={suggestionsStyle}>
                            {filteredProducts.slice(0, 8).map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleSelectProduct(product)}
                                    style={suggestionItemStyle}
                                >
                                    <span>{product.name}</span>
                                    <span style={{ color: "#9ca3af" }}>
                                        Estoque: {product.stock}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

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

const searchWrapperStyle = {
    position: "relative"
};

const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #374151"
};

const suggestionsStyle = {
    position: "absolute",
    top: "52px",
    left: 0,
    right: 0,
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "10px",
    overflow: "hidden",
    zIndex: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.35)"
};

const suggestionItemStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "transparent",
    color: "#fff",
    borderBottom: "1px solid #1f2937",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    textAlign: "left"
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