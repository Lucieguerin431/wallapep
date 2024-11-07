import React, { useEffect, useState } from 'react';
import { Table, Typography, notification } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const TransactionsTableComponent = ({ transactions, role, showProfileLink = true, onTotalPriceUpdate }) => {
    const [productPrices, setProductPrices] = useState({});
    const apiKey = localStorage.getItem("apiKey");

    useEffect(() => {
        const getProductPrices = async () => {
            const prices = {};
            let total = 0;

            for (const transaction of transactions) {
                const productId = transaction.productId;
                if (!prices[productId]) {
                    try {
                        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products/${productId}`, {
                            headers: {
                                "apikey": apiKey,
                            },
                        });
                        if (response.ok) {
                            const productData = await response.json();
                            const price = productData.price || "-";
                            prices[productId] = price;
                            total += price;
                        } else {
                            console.error("Failed to get product price for productId:", productId);
                        }
                    } catch (error) {
                        console.error("Error getting product price:", error);
                        notification.error({
                            message: 'Error',
                            description: 'Unable to get product price.',
                        });
                    }
                } else {
                    total += prices[productId];
                }
            }

            setProductPrices(prices);
            if (onTotalPriceUpdate) {
                onTotalPriceUpdate(total); 
            }        };

        getProductPrices();
    }, [transactions, apiKey, onTotalPriceUpdate]);

    const columns = [
        {
            title: "Product Name",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <Link to={`/products/${record.productId}`}>{text}</Link>
            ),
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Product Price",
            dataIndex: "productId",
            key: "productPrice",
            render: (productId) => {
                const price = productPrices[productId];
                return price !== undefined ? `${price} €` : "Loading...";
            },
            sorter: (a, b) => (productPrices[a.productId] || 0) - (productPrices[b.productId] || 0),
        },
        {
            title: role === "buyer" ? "Seller" : "Buyer",
            dataIndex: role === "buyer" ? "sellerId" : "buyerId",
            key: "userId",
            render: (userId) => (
                showProfileLink ? (
                    <Link style={{color: "#fb3188"}} to={`/users/${userId}`}>View {role === "buyer" ? "Seller" : "Buyer"} Profile</Link>
                ) : (
                    <Text>{userId}</Text>
                )
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={transactions}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
            onRow={(record, index) => ({
                style: { backgroundColor: index % 2 !== 0 ? "#f8f8f8" : "#ffffff" }
            })}
            style={{ marginTop: "14px" }}
            locale={{ emptyText: role === "buyer" ? "No purchases found" : "No sales found" }}
        />
    );
};

export default TransactionsTableComponent;
