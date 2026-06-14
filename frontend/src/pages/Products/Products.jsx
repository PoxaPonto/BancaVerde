import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../services/api";
import ProductModal from "../../components/ProductModal";
import ProductDetailsModal from "../../components/ProductDetailsModal";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortOption, setSortOption] = useState("name-asc");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = [...new Set(products.map((product) => product.categoryName))];

    useEffect(() => {
      loadProducts();
    }, []);

    useEffect(() => {
       loadProducts(1);
    },[search, categoryFilter, sortOption]);

    async function loadProducts(currentPage = page) {
        try {
            const response = await api.get(
               `/Products?page=${currentPage}&pageSize=10&search=${search}&category=${categoryFilter}&sort=${sortOption}`
            );

            setProducts(response.data.data.data);
            setPage(response.data.data.page);
            setTotalPages(response.data.data.totalPages);
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

    function handleDetails(product) {
        setSelectedProduct(product);
        setDetailsOpen(true);
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

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/Products/${id}`);
            toast.success("Produto excluído com sucesso!");
            loadProducts(page);
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
        <div className="page-surface">
            <ProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onProductSaved={() => loadProducts(page)}
                productToEdit={productToEdit}
            />

            <ProductDetailsModal
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                product={selectedProduct}
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

            {products.length === 0 ? (
                <p style={{ color: "#9ca3af", marginTop: "20px" }}>
                    Nenhum produto encontrado.
                </p>
            ) : (
                <>
                    <table className="glass-panel" style={tableStyle}>
                        <thead>
                            <tr style={{ background: "rgba(61, 46, 88, 0.66)" }}>
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

                                    <td style={tdStyle}>
                                        {Number(product.price).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
                                        })}
                                    </td>

                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span>{product.stock}</span>

                                            {product.stock <= 5 ? (
                                                <span style={criticalBadgeStyle}>CRÍTICO</span>
                                            ) : product.stock <= 10 ? (
                                                <span style={warningBadgeStyle}>ATENCAO</span>
                                            ) : (
                                                <span style={okBadgeStyle}>OK</span>
                                            )}
                                        </div>
                                    </td>

                                    <td style={tdStyle}>{product.categoryName}</td>

                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => handleDetails(product)}
                                            style={{
                                                ...actionButtonStyle,
                                                background: "#059669"
                                            }}
                                        >
                                            Detalhes
                                        </button>

                                        <button
                                            onClick={() => handleEdit(product)}
                                            style={{
                                                ...actionButtonStyle,
                                                background: "#6d5bd0",
                                                marginLeft: "8px"
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

                    <div style={paginationStyle}>
                        <button
                            disabled={page === 1}
                            onClick={() => loadProducts(page - 1)}
                            style={{
                                ...paginationButtonStyle,
                                opacity: page === 1 ? 0.5 : 1
                            }}
                        >
                            Anterior
                        </button>

                        <span style={paginationTextStyle}>
                            Página {page} de {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => loadProducts(page + 1)}
                            style={{
                                ...paginationButtonStyle,
                                opacity: page === totalPages ? 0.5 : 1
                            }}
                        >
                            Próxima
                        </button>
                    </div>
                </>
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
    borderRadius: "10px",
    background: "#00e676",
    color: "#111827",
    boxShadow: "0 12px 28px rgba(0, 230, 118, 0.18)",
    fontWeight: "bold"
};

const searchInputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "10px",
    background: "rgba(40, 29, 62, 0.94)",
    color: "#fff",
    border: "1px solid rgba(160, 132, 215, 0.18)"
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
    background: "rgba(40, 29, 62, 0.94)",
    color: "#fff",
    border: "1px solid rgba(160, 132, 215, 0.18)"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(40, 29, 62, 0.94)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 18px 36px rgba(0,0,0,0.22), 0 0 34px rgba(125, 87, 210, 0.06)"
};

const thStyle = {
    padding: "14px",
    textAlign: "left",
    color: "#d8d1e6",
    borderBottom: "1px solid rgba(160, 132, 215, 0.18)"
};

const tdStyle = {
    padding: "14px",
    borderBottom: "1px solid rgba(160, 132, 215, 0.12)",
    color: "#f9fafb"
};

const actionButtonStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold"
};

const criticalBadgeStyle = {
    background: "#7f1d1d",
    color: "#fecaca",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
};

const warningBadgeStyle = {
    background: "#78350f",
    color: "#fde68a",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
};

const okBadgeStyle = {
    background: "#14532d",
    color: "#bbf7d0",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
};

const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginTop: "20px"
};

const paginationButtonStyle = {
    padding: "10px 14px",
    borderRadius: "8px",
    background: "rgba(40, 29, 62, 0.94)",
    color: "#fff",
    fontWeight: "bold",
    border: "1px solid rgba(160, 132, 215, 0.18)"
};

const paginationTextStyle = {
    color: "#fff",
    fontWeight: "bold"
};
