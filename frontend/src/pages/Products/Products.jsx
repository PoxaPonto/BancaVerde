import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../services/api";
import ProductModal from "../../components/ProductModal";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortOption, setSortOption] = useState("name-asc");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const categories = [
        ...new Set(products.map((product) => product.categoryName))
    ];

    const filteredProducts = products
        .filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((product) =>
            categoryFilter === "all"
                ? true
                : product.categoryName === categoryFilter
        )
        .sort((a, b) => {
            if (sortOption === "name-asc") {
                return a.name.localeCompare(b.name);
            }

            if (sortOption === "name-desc") {
                return b.name.localeCompare(a.name);
            }

            if (sortOption === "price-high") {
                return b.price - a.price;
            }

            if (sortOption === "price-low") {
                return a.price - b.price;
            }

            if (sortOption === "stock-high") {
                return b.stock - a.stock;
            }

            if (sortOption === "stock-low") {
                return a.stock - b.stock;
            }

            return 0;
        });

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
        const result = await Swal.fire({
            title: "Excluir produto",
            text: "Tem certeza que deseja excluir este produto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#374151",
            confirmButtonText: "Excluir",
            cancelButtonText: "Cancelar",
            background: "#111827",
            color: "#fff"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await api.delete(`/Products/${id}`);

            toast.success("Produto excluído com sucesso!");

            loadProducts();
        }
        catch (error) {
            console.error(error);

            toast.error(
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

            <div style={headerStyle}>
                <div>
                    <h1>Produtos</h1>
                    <p style={{ color: "#9ca3af" }}>
                        Gerencie os produtos cadastrados no estoque.
                    </p>
                </div>

                <button onClick={handleNewProduct} style={newButtonStyle}>
                    + Novo Produto
                </button>
            </div>

            <input
                type="text"
                placeholder="Pesquisar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={searchInputStyle}
            />

            <div style={filtersContainerStyle}>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={filterInputStyle}
                >
                    <option value="all">Todas as categorias</option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={filterInputStyle}
                >
                    <option value="name-asc">Nome A-Z</option>
                    <option value="name-desc">Nome Z-A</option>
                    <option value="price-high">Maior preço</option>
                    <option value="price-low">Menor preço</option>
                    <option value="stock-high">Maior estoque</option>
                    <option value="stock-low">Menor estoque</option>
                </select>
            </div>

            {filteredProducts.length === 0 ? (
                <p style={{ color: "#9ca3af", marginTop: "20px" }}>
                    Nenhum produto encontrado.
                </p>
            ) : (
                <table style={tableStyle}>
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
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td style={tdStyle}>{product.id}</td>
                    
                                <td style={tdStyle}>
                                    {product.name}
                                </td>
                                        
                                <td style={tdStyle}>
                                    {Number(product.price).toLocaleString(
                                        "pt-BR",
                                        {
                                            style: "currency",
                                            currency: "BRL"
                                        }
                                    )}
                                </td>
                    
                                <td style={tdStyle}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px"
                                        }}
                                    >
                                        <span>{product.stock}</span>
                    
                                        {product.stock <= 5 ? (
                                            <span
                                                style={{
                                                    background: "#7f1d1d",
                                                    color: "#fecaca",
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                CRÍTICO
                                            </span>
                                        ) : product.stock <= 10 ? (
                                            <span
                                                style={{
                                                    background: "#78350f",
                                                    color: "#fde68a",
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                ATENÇÃO
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    background: "#14532d",
                                                    color: "#bbf7d0",
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                OK
                                            </span>
                                        )}
                                    </div>
                                </td>
                    
                                <td style={tdStyle}>
                                    {product.categoryName}
                                </td>
                    
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
            )}
        </div>
    );
}

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
};

const newButtonStyle = {
    padding: "12px 18px",
    borderRadius: "8px",
    background: "#22c55e",
    color: "#fff",
    fontWeight: "bold"
};

const searchInputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    border: "1px solid #374151"
};

const filtersContainerStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "18px"
};

const filterInputStyle = {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    border: "1px solid #374151"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#111827",
    borderRadius: "10px",
    overflow: "hidden"
};

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