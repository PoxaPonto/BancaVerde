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
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>{title}</h2>

                <p style={messageStyle}>
                    {message}
                </p>

                <div style={buttonContainerStyle}>
                    <button
                        onClick={onCancel}
                        style={{
                            ...buttonStyle,
                            background: "#374151"
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