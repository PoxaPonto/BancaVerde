export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" style={overlayStyle}>
            <div className="modal-panel" style={modalStyle}>
                <h2>{title}</h2>

                <p style={messageStyle}>
                    {message}
                </p>

                <div style={buttonContainerStyle}>
                    <button
                        onClick={onCancel}
                        style={{
                            ...buttonStyle,
                            background: "rgba(160, 132, 215, 0.18)"
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        style={{
                            ...buttonStyle,
                            background: "#dc2626"
                        }}
                    >
                        Confirmar
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

const messageStyle = {
    color: "#9ca3af",
    marginTop: "12px",
    lineHeight: "1.5"
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "24px"
};

const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold"
};
