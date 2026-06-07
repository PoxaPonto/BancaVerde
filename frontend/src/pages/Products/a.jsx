            {filteredProducts.length === 0 ? (
                <p style={{ color: "#9ca3af", marginTop: "20px" }}>
                    Nenhum produto encontrado.
                </p>
            ) : (
    <>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ background: "#1f2937" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Nome</th>
                            <th style={thStyle}>Preço</th>
                            <th style={thStyle}>Estoque</th>
                            <th style={thStyle}>Categoria</th>
                            <th style={thStyle}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td style={tdStyle}>{product.id}</td>

                                <td style={tdStyle}>{product.name}</td>

                                <td style={tdStyle}>
                                    {Number(product.price).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                 </td>

                            <td style={tdStyle}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>{product.stock}</span>

                                    {product.stock <= 5 ? (
                                    <span style={criticalBadgeStyle}>CRÍTICO</span>
                                    ) : product.stock <= 10 ? (
                                    <span style={warningBadgeStyle}>ATENÇÃO</span>
                                    ) : (
                                    <span style={okBadgeStyle}>OK</span>
                                    )}
                               </div>
                           </td>

                            <td style={tdStyle}>{product.categoryName}</td>

                            <td style={tdStyle}>
                                <button
                                   onClick={() => handleDetails(product)}
                                   style={{
                                        ...actionButtonStyle,
                                        background: "#059669"
                                    }}
                                >
                                    Detalhes
                               </button>

                                <button
                                   onClick={() => handleEdit(product)}
                                   style={{
                                        ...actionButtonStyle,
                                        background: "#2563eb",
                                        marginLeft: "8px"
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                   onClick={() => handleDelete(product.id)}
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

        <div style={paginationStyle}>
            <button
                disabled={page === 1}
                onClick={() => loadProducts(page - 1)}
                style={{
                    ...paginationButtonStyle,
                    opacity: page === 1 ? 0.5 : 1
                }}
            >
                Anterior
            </button>

            <span style={paginationTextStyle}>
                Página {page} de {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => loadProducts(page + 1)}
                style={{
                    ...paginationButtonStyle,
                    opacity: page === totalPages ? 0.5 : 1
                }}
            >
                Próxima
            </button>
        </div>
    </>
)}
