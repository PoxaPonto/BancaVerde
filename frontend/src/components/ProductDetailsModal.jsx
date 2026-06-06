export default function ProductDetailsModal({
    isOpen,
    onClose,
    product
}) {
    if (!isOpen || !product) {
        return null;
    }

    const stockStatus =
        product.stock <= 5
            ? "CRÍTICO"
            : product.stock <= 10
                ? "ATENÇÃO"
                : "OK";

    const stockColor =
        product.stock <= 5
            ? "#fecaca"
            : product.stock <= 10
                ? "#fde68a"
                : "#bbf7d0";

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>Detalhes do Produto</h2>

                <div style={infoBoxStyle}>
                    <p><strong>Nome:</strong> {product.name}</p>
                    <p><strong>Categoria:</strong> {product.categoryName}</p>
                    <p>
                        <strong>Preço:</strong>{" "}
                        {Number(product.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </p>
                    <p><strong>Estoque:</strong> {product.stock}</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span style={{ color: stockColor, fontWeight: "bold" }}>
                            {stockStatus}
                        </span>
                    </p>
                </div>

                <div style={buttonContainerStyle}>
                    <button
                        onClick={onClose}
                        style={buttonStyle}
                    >
                        Fechar
                    </button>
                </div>
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

const infoBoxStyle = {
    marginTop: "18px",
    background: "#1f2937",
    borderRadius: "10px",
    padding: "16px",
    color: "#d1d5db",
    lineHeight: "1.8"
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px"
};

const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#22c55e",
    color: "#fff",
    fontWeight: "bold"
};