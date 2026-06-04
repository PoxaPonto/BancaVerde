import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await api.get("/Products");
                setProducts(response.data.data);
            }
            catch (error) {
                console.error(error);
                alert("Erro ao carregar produtos.");
            }
            finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    if (loading) {
        return <h2 style={{ padding: "20px" }}>Carregando produtos...</h2>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Produtos</h1>

            <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Categoria</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>R$ {product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.categoryName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}