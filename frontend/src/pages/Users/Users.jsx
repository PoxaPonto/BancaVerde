import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../services/api";
import UserModal from "../../components/UserModal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const filteredUsers = users
        .filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
        .filter((user) =>
            roleFilter === "all"
                ? true
                : user.role === roleFilter
        );

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

            <div style={filtersContainerStyle}>
                <input
                    type="text"
                    placeholder="Pesquisar por nome ou e-mail..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={filterInputStyle}
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={filterInputStyle}
                >
                    <option value="all">Todas permissões</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
            </div>

            {filteredUsers.length === 0 ? (
                <p style={{ color: "#9ca3af", marginTop: "20px" }}>
                    Nenhum usuário encontrado.
                </p>
            ) : (
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
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td style={tdStyle}>{user.id}</td>
                                <td style={tdStyle}>{user.name}</td>
                                <td style={tdStyle}>{user.email}</td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            ...roleBadgeStyle,
                                            background:
                                                user.role === "Admin"
                                                    ? "#14532d"
                                                    : "#1e3a8a",
                                            color:
                                                user.role === "Admin"
                                                    ? "#86efac"
                                                    : "#93c5fd"
                                        }}
                                    >
                                        {user.role}
                                    </span>
                                </td>

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

const roleBadgeStyle = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold"
};