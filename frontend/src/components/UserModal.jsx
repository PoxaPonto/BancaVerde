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
        <div className="modal-overlay" style={overlayStyle}>
            <div className="modal-panel" style={modalStyle}>
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
