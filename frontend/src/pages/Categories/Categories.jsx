import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

    async function handleDelete(id) {
        const confirmDelete = confirm(
            "Tem certeza que deseja excluir esta categoria?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/Categories/${id}`);

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
        <div>
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
                        background: "#22c55e",
                        color: "#fff",
                        fontWeight: "bold"
                    }}
                >
                    + Nova Categoria
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
                                        background: "#2563eb"
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(category.id)}
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