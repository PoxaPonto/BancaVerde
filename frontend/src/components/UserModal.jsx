import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export default function UserModal({
    isOpen,
    onClose,
    onUserSaved,
    userToEdit
}) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "User"
    });

    const isEditing = !!userToEdit;

    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setForm({
                    name: userToEdit.name,
                    email: userToEdit.email,
                    password: "",
                    role: userToEdit.role
                });
            }
            else {
                setForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "User"
                });
            }
        }
    }, [isOpen, userToEdit]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (isEditing) {
                await api.put(`/Users/${userToEdit.id}`, {
                    name: form.name,
                    email: form.email,
                    role: form.role
                });

                toast.success("Usuário atualizado com sucesso!");
            }
            else {
                await api.post("/Users", {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role
                });

                toast.success("Usuário cadastrado com sucesso!");
            }

            onUserSaved();
            onClose();
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Erro ao salvar usuário."
            );
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>{isEditing ? "Editar Usuário" : "Novo Usuário"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Nome"
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {!isEditing && (
                        <input
                            name="password"
                            type="password"
                            placeholder="Senha"
                            value={form.password}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    )}

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>

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