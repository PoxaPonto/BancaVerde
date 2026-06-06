                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td style={tdStyle}>{product.id}</td>
                    
                                <td style={tdStyle}>
                                    {product.name}
                                </td>
                                        
                                <td style={tdStyle}>
                                    {Number(product.price).toLocaleString(
                                        "pt-BR",
                                        {
                                            style: "currency",
                                            currency: "BRL"
                                        }
                                    )}
                                </td>
                    
                                <td style={tdStyle}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px"
                                        }}
                                    >
                                        <span>{product.stock}</span>
                    
                                        {product.stock <= 5 ? (
                                            <span
                                                style={{
                                                    background: "#7f1d1d",
                                                    color: "#fecaca",
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                CRÍTICO
                                            </span>
                                        ) : product.stock <= 10 ? (
                                            <span
                                                style={{
                                                    background: "#78350f",
                                                    color: "#fde68a",
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                ATENÇÃO
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    background: "#14532d",
                                                    color: "#bbf7d0",
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                OK
                                            </span>
                                        )}
                                    </div>
                                </td>
                    
                                <td style={tdStyle}>
                                    {product.categoryName}
                                </td>
                    
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        style={{
                                            ...actionButtonStyle,
                                            background: "#2563eb"
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



