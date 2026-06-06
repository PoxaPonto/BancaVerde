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