import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export default function ProductModal({
    isOpen,
    onClose,
    onProductSaved,
    productToEdit
}) {
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        categoryId: ""
    });

    const isEditing = !!productToEdit;

    useEffect(() => {
        if (isOpen) {
            loadCategories();

            if (productToEdit) {
                setForm({
                    name: productToEdit.name,
                    price: productToEdit.price,
                    stock: productToEdit.stock,
                    categoryId: productToEdit.categoryId || ""
                });
            }
            else {
                setForm({
                    name: "",
                    price: "",
                    stock: "",
                    categoryId: ""
                });
            }
        }
    }, [isOpen, productToEdit]);

    async function loadCategories() {
        try {
            const response = await api.get("/Categories");
            setCategories(response.data.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar categorias.");
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const productData = {
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                categoryId: Number(form.categoryId)
            };

            if (isEditing) {
                await api.put(
                    `/Products/${productToEdit.id}`,
                    productData
                );

                toast.success("Produto atualizado com sucesso!");
            }
            else {
                await api.post("/Products", productData);

                toast.success("Produto cadastrado com sucesso!");
            }

            onProductSaved();
            onClose();
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Erro ao salvar produto."
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
                    {isEditing ? "Editar Produto" : "Novo Produto"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Nome do produto"
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        name="price"
                        type="text"
                        input="decimal"
                        placeholder="Preço"
                        value={form.price}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        name="stock"
                        type="text"
                        inputMode="numeric"
                        placeholder="Estoque"
                        value={form.stock}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="">
                            Selecione uma categoria
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

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
