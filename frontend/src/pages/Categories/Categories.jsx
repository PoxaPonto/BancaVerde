import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../services/api";
import CategoryModal from "../../components/CategoryModal";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const response = await api.get("/Categories");
            setCategories(response.data.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar categorias.");
        }
        finally {
            setLoading(false);
        }
    }

    function handleNewCategory() {
        setCategoryToEdit(null);
        setModalOpen(true);
    }

    function handleEdit(category) {
        setCategoryToEdit(category);
        setModalOpen(true);
    }

    async function handleDelete(category) {
        const result = await Swal.fire({
            title: "Excluir categoria",
            text: `Tem certeza que deseja excluir a categoria "${category.name}"?`,
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
            await api.delete(`/Categories/${category.id}`);

            toast.success("Categoria excluída com sucesso!");

            loadCategories();
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Erro ao excluir categoria."
            );
        }
    }

    if (loading) {
        return <h2>Carregando categorias...</h2>;
    }

    return (
        <div className="page-surface">
            <CategoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCategorySaved={loadCategories}
                categoryToEdit={categoryToEdit}
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
                    <h1>Categorias</h1>
                    <p style={{ color: "#9ca3af" }}>
                        Gerencie as categorias dos produtos.
                    </p>
                </div>

                <button
                    onClick={handleNewCategory}
                    style={{
                        padding: "12px 18px",
                        borderRadius: "8px",
                        background: "#00e676",
                        color: "#111827",
                        boxShadow: "0 12px 28px rgba(0, 230, 118, 0.18)",
                        fontWeight: "bold"
                    }}
                >
                    + Nova Categoria
                </button>
            </div>

            <table
                className="glass-panel"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "rgba(40, 29, 62, 0.94)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 18px 36px rgba(0,0,0,0.22), 0 0 34px rgba(125, 87, 210, 0.06)"
                }}
            >
                <thead>
                    <tr style={{ background: "rgba(61, 46, 88, 0.66)" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Nome</th>
                        <th style={thStyle}>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td style={tdStyle}>{category.id}</td>
                            <td style={tdStyle}>{category.name}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => handleEdit(category)}
                                    style={{
                                        ...actionButtonStyle,
                                        background: "#6d5bd0"
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(category)}
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
