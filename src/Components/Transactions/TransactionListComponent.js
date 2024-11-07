import React, { useEffect, useState } from "react";
import { Typography, Spin, notification, Row, Divider, Card } from "antd";
import { ShoppingCartOutlined, DollarCircleOutlined, DollarCircleTwoTone } from "@ant-design/icons";
import TransactionsTableComponent from "../Transactions/TransactionsTableComponent";

const { Title, Text } = Typography;

const TransactionListComponent = () => {
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
    const [totalSalesPrice, setTotalSalesPrice] = useState(0);
    const apiKey = localStorage.getItem("apiKey");
    const userId = localStorage.getItem("id");

    useEffect(() => {
        if (userId) {
            getUserTransactions();
        } else {
            notification.error({
                message: "Error",
                description: "User ID not found. Please log in again.",
                placement: "topRight",
            });
            setLoading(false);
        }
    }, [userId]);

    const getUserTransactions = async () => {
        setLoading(true);
        try {
            const responsePurchases = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?buyerId=${userId}`, {
                headers: { "apikey": apiKey }
            });
            const responseSales = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?sellerId=${userId}`, {
                headers: { "apikey": apiKey }
            });

            if (responsePurchases.ok && responseSales.ok) {
                const dataPurchases = await responsePurchases.json();
                const dataSales = await responseSales.json();

                setPurchases(dataPurchases);
                setSales(dataSales);
            } else {
                throw new Error("Failed to get transactions");
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Unable to fetch transactions.",
                placement: "topRight",
            });
        }
        setLoading(false);
    };

    if (loading) {
        return <Spin tip="Loading transactions..." />;
    }

    return (
        <div style={{ padding: "20px 50px" }}>
            <Typography.Title level={2} style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
                <DollarCircleTwoTone style={{ fontSize: "32px", marginRight: "10px", lineHeight: "1" }} twoToneColor="#007bff"/> 
                My Transactions
            </Typography.Title>
            <Typography.Title level={5} style={{ marginBottom: "30px", color: "gray" }}>
                Here you can review your transactions: see the details of each item you've bought or sold.
            </Typography.Title>
            
            <Card style={{ marginBottom: "20px" }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                    <Title level={3}>
                        <ShoppingCartOutlined style={{ marginRight: "8px" }} /> 
                        My Purchases ({purchases.length} items)
                    </Title>
                    <Text strong style={{
                        fontSize: "18px",
                        color: "#1769d0", 
                        fontWeight: "bold",
                        backgroundColor: "#D1EDFD",
                        padding: "5px 10px",
                        borderRadius: "5px",
                    }}>
                        Total expenses: <span style={{ fontWeight: "bold" }}> -{totalPurchasePrice}€</span>
                    </Text>
                </Row>
                <TransactionsTableComponent 
                    transactions={purchases} 
                    role="buyer" 
                    showProfileLink={true} 
                    onTotalPriceUpdate={setTotalPurchasePrice} 
                />
            </Card>

            <Card style={{ marginTop: "20px" }}>
                <Row justify="space-between" align="middle">
                    <Title level={3}>
                        <DollarCircleOutlined style={{ marginRight: "8px" }} />
                        My Sales ({sales.length} items)
                    </Title>
                    <Text strong style={{
                        fontSize: "18px",
                        color: "#fb398d", 
                        backgroundColor: "#FFE3E1",
                        padding: "5px 10px",
                        borderRadius: "5px",
                    }}>
                        Total Sales: <span style={{ fontWeight: "bold" }}>{totalSalesPrice}€</span>
                    </Text>
                </Row>
                <TransactionsTableComponent 
                    transactions={sales} 
                    role="seller" 
                    showProfileLink={true} 
                    onTotalPriceUpdate={setTotalSalesPrice} 
                />
            </Card>
        </div>
    );
};

export default TransactionListComponent;