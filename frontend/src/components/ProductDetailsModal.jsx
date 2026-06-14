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
                ? "ATENCAO"
                : "OK";

    const stockColor =
        product.stock <= 5
            ? "#fecaca"
            : product.stock <= 10
                ? "#fde68a"
                : "#bbf7d0";

    return (
        <div className="modal-overlay" style={overlayStyle}>
            <div className="modal-panel" style={modalStyle}>
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

const infoBoxStyle = {
    marginTop: "18px",
    background: "rgba(57, 42, 82, 0.66)",
    borderRadius: "10px",
    padding: "16px",
    color: "#d8d1e6",
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
    background: "#00e676",
    color: "#111827",
    fontWeight: "bold"
};
