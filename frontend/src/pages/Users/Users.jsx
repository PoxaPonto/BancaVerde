import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../services/api";
import UserModal from "../../components/UserModal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const response = await api.get("/Users");
            setUsers(response.data.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar usuários.");
        }
        finally {
            setLoading(false);
        }
    }

    function handleNewUser() {
        setUserToEdit(null);
        setModalOpen(true);
    }

    function handleEdit(user) {
        setUserToEdit(user);
        setModalOpen(true);
    }

    async function handleDelete(user) {
        const result = await Swal.fire({
            title: "Excluir usuário",
            text: `Tem certeza que deseja excluir o usuário "${user.name}"?`,
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
            await api.delete(`/Users/${user.id}`);

            toast.success("Usuário excluído com sucesso!");

            loadUsers();
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Erro ao excluir usuário."
            );
        }
    }

    if (loading) {
        return <h2>Carregando usuários...</h2>;
    }

    return (
        <div>
            <UserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onUserSaved={loadUsers}
                userToEdit={userToEdit}
            />

            <div style={headerStyle}>
                <div>
                    <h1>Usuários</h1>
                    <p style={{ color: "#9ca3af" }}>
                        Gerencie os usuários e permissões do sistema.
                    </p>
                </div>

                <button
                    onClick={handleNewUser}
                    style={newButtonStyle}
                >
                    + Novo Usuário
                </button>
            </div>

            <table style={tableStyle}>
                <thead>
                    <tr style={{ background: "#1f2937" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Nome</th>
                        <th style={thStyle}>E-mail</th>
                        <th style={thStyle}>Permissão</th>
                        <th style={thStyle}>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td style={tdStyle}>{user.id}</td>
                            <td style={tdStyle}>{user.name}</td>
                            <td style={tdStyle}>{user.email}</td>
                            <td style={tdStyle}>{user.role}</td>

                            <td style={tdStyle}>
                                <button
                                    onClick={() => handleEdit(user)}
                                    style={{
                                        ...actionButtonStyle,
                                        background: "#2563eb"
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(user)}
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