import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProductCardComponent = ({ product, showCategory = false }) => {
    const navigate = useNavigate();
    const isSold = !!product.buyerEmail;

    return (
        <Card
            hoverable
            cover={<img alt={product.title} src={product.image || "/default-image.png"} />}
            onClick={() => navigate(`/products/${product.id}`)}
            style={{
                borderRadius: "8px",
                overflow: "hidden",
                position: 'relative',
                opacity: isSold ? 0.45 : 1,
            }}
        >
            {isSold && (
                <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: "red",
                    color: 'white',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                }}>
                    SOLD
                </div>
            )}
            <Card.Meta title={product.title} />

            {showCategory && (
                <p style={{ color: 'gray', fontSize: '12px', marginTop: '5px', fontWeight:"bold" }}>
                    Category: {product.category}
                </p>
            )}

            <p style={{
                marginTop: "10px",
                fontWeight: "bold",
                backgroundColor: "#ffeb3b",
                padding: "5px 10px",
                borderRadius: "5px",
                display: "inline-block",
            }}>
                {product.price} €
            </p>
        </Card>
    );
};

export default ProductCardComponent;
