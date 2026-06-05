import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export default function CategoryModal({
    isOpen,
    onClose,
    onCategorySaved,
    categoryToEdit
}) {
    const [name, setName] = useState("");

    const isEditing = !!categoryToEdit;

    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                setName(categoryToEdit.name);
            }
            else {
                setName("");
            }
        }
    }, [isOpen, categoryToEdit]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const categoryData = {
                name
            };

            if (isEditing) {
                await api.put(
                    `/Categories/${categoryToEdit.id}`,
                    categoryData
                );

                toast.success("Categoria atualizada com sucesso!");
            }
            else {
                await api.post("/Categories", categoryData);

                toast.success("Categoria cadastrada com sucesso!");
            }

            onCategorySaved();
            onClose();
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Erro ao salvar categoria."
            );
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>
                    {isEditing ? "Editar Categoria" : "Nova Categoria"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Nome da categoria"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />

                    <div style={buttonContainerStyle}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                ...buttonStyle,
                                background: "#374151"
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            style={{
                                ...buttonStyle,
                                background: "#22c55e"
                            }}
                        >
                            {isEditing ? "Atualizar" : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modalStyle = {
    width: "420px",
    background: "#111827",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "14px",
    borderRadius: "8px",
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #374151"
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px"
};

const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold"
};