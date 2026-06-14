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
        <div className="modal-overlay" style={overlayStyle}>
            <div className="modal-panel" style={modalStyle}>
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
                                background: "rgba(160, 132, 215, 0.18)"
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            style={{
                                ...buttonStyle,
                                background: "#00e676",
                                color: "#111827"
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
    background: "rgba(9, 6, 16, 0.72)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modalStyle = {
    width: "420px",
    background: "rgba(40, 29, 62, 0.98)",
    padding: "28px",
    borderRadius: "12px",
    border: "1px solid rgba(160, 132, 215, 0.2)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.42)"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "14px",
    borderRadius: "8px",
    background: "rgba(61, 46, 88, 0.66)",
    color: "#fff",
    border: "1px solid rgba(160, 132, 215, 0.18)"
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
