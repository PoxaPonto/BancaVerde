import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductModal from "../../components/ProductModal";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

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
            alert("Erro ao carregar produtos.");
        }
        finally {
            setLoading(false);
        }
    }

    function handleNewProduct() {
        setProductToEdit(null);
        setModalOpen(true);
    }

    function handleEdit(product) {
        setProductToEdit(product);
        setModalOpen(true);
    }

    async function handleDelete(id) {
        const confirmDelete = confirm(
            "Tem certeza que deseja excluir este produto?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/Products/${id}`);

            alert("Produto excluído com sucesso.");

            loadProducts();
        }
        catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Erro ao excluir produto."
            );
        }
    }

    if (loading) {
        return <h2>Carregando produtos...</h2>;
    }

    return (
        <div>
            <ProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onProductSaved={loadProducts}
                productToEdit={productToEdit}
            />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >
                <div>
                    <h1>Produtos</h1>
                    <p style={{ color: "#9ca3af" }}>
                        Gerencie os produtos cadastrados no estoque.
                    </p>
                </div>

                <button
                    onClick={handleNewProduct}
                    style={{
                        padding: "12px 18px",
                        borderRadius: "8px",
                        background: "#22c55e",
                        color: "#fff",
                        fontWeight: "bold"
                    }}
                >
                    + Novo Produto
                </button>
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#111827",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >
                <thead>
                    <tr style={{ background: "#1f2937" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Nome</th>
                        <th style={thStyle}>Preço</th>
                        <th style={thStyle}>Estoque</th>
                        <th style={thStyle}>Categoria</th>
                        <th style={thStyle}>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={tdStyle}>{product.id}</td>
                            <td style={tdStyle}>{product.name}</td>
                            <td style={tdStyle}>R$ {product.price}</td>
                            <td style={tdStyle}>{product.stock}</td>
                            <td style={tdStyle}>{product.categoryName}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => handleEdit(product)}
                                    style={{
                                        ...actionButtonStyle,
                                        background: "#2563eb"
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(product.id)}
                                    style={{
                                        ...actionButtonStyle,
                                        background: "#dc2626",
                                        marginLeft: "8px"
                                    }}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    padding: "14px",
    textAlign: "left",
    color: "#d1d5db",
    borderBottom: "1px solid #374151"
};

const tdStyle = {
    padding: "14px",
    borderBottom: "1px solid #1f2937",
    color: "#f9fafb"
};

const actionButtonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "bold"
};