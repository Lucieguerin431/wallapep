import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, notification, Spin, Table, Avatar, Row, Col, Divider, Tag } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, AppstoreOutlined} from '@ant-design/icons';
import TransactionsTableComponent from '../Transactions/TransactionsTableComponent';
import { timestampToString } from "../../Utils/UtilsDates";
import { Link } from 'react-router-dom';


const { Title, Text } = Typography;

const UserProfilComponent = () => {
    const { id } = useParams(); 
    const [user, setUser] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState([]);
    const apiKey = localStorage.getItem("apiKey");

    useEffect(() => {
        getUserData();
        getUserTransactions();
        getUserProducts();
        getCountries();
    }, [id]);

    const getUserData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/${id}`, {
                headers: { "apikey": apiKey }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                throw new Error('Failed to get user data');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Unable to get user data.',
            });
        }
    };

    const getUserTransactions = async () => {
        setLoading(true);
        try {
            const responsePurchases = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?buyerId=${id}`, {
                headers: { "apikey": apiKey }
            });
            const responseSales = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?sellerId=${id}`, {
                headers: { "apikey": apiKey }
            });

            if (responsePurchases.ok && responseSales.ok) {
                const dataPurchases = await responsePurchases.json();
                const dataSales = await responseSales.json();
                
                setPurchases(dataPurchases); 
                setSales(dataSales);        
            } else {
                throw new Error('Failed to get transactions');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Unable to get transactions.',
            });
        }
        setLoading(false);
    };

    const getUserProducts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products?sellerId=${id}`, {
                headers: { "apikey": apiKey }
            });
            if (response.ok) {
                const data = await response.json();
                data.map((product) => {
                    product.key = product.id;
                    return product;
                });
                setProducts(data);
            } else {
                throw new Error('Failed to get products');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Unable to get user products.',
            });
        }
    };

    const getCountries = async () => {
        try {
            const response = await fetch("https://restcountries.com/v3.1/all");
            const data = await response.json();
            const countryList = data.map((country) => ({
                name: country.name.common,
                code: country.cca2,
                flag: country.flags.png,
            }));
            setCountries(countryList);
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        }
    };

    const getCountryFlag = (countryName) => {
        const country = countries.find((c) => c.name === countryName);
        return country ? country.flag : null;
    };

    const totalTransactions = purchases.length + sales.length;
    
    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                <Spin tip="Loading user profile..." />
            </div>
        );
    }
    

    return (
        <div style={{ padding: "20px 50px" }}>
            <div style={{ display: "flex", justifyContent: "center",  }}>
                <Card
                    style={{
                        background: "#C4DBFB",
                        borderRadius: "10px",
                        padding: "20px 50px",
                        marginBottom: "30px",
            
                            width: "40%",
                            maxWidth: "700px",
                            minWidth: "400px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" 
                        
                    }}
                >
                    <Row align="middle" gutter={[10, 10]} style={{ textAlign: "center" }}>
                        <Col span={24}>
                            <Avatar
                                size={100}
                                style={{ backgroundColor: "#fb3188", fontSize: "40px" }}
                            >
                                {user.email.charAt(0).toUpperCase() || ""}
                            </Avatar>
                        </Col>
                        <Col span={24}>
                            <Title level={2} style={{ color: "#0d47a1", marginBottom: "5px" }}>
                                {user?.name || "User Name"} {getCountryFlag(user?.country) && (
                                    <img
                                        src={getCountryFlag(user.country)}
                                        alt={user.country}
                                        style={{ width: "20px", marginRight: "8px" }}
                                    />
                                )}
                            </Title>
                            <Text strong style={{ fontSize: "14px", color: "#0d47a1" }}>
                                {user?.email || "user@example.com"}
                            </Text>
                        </Col>
                        <Divider style={{ backgroundColor: "#82b1ff", margin: "10px 0" }} />
                        <Col span={24}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                color: "#1769d0",
                                fontWeight: "bold",
                                backgroundColor: "#E3F2FD",
                                padding: "10px",
                                borderRadius: "10px",
                                marginTop: "10px",
                            }}>
                                <span style={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    borderRadius: "12px",
                                    padding: "2px 8px",
                                    marginRight: "8px"
                                }}>{totalTransactions}</span> 
                                Transactions
                            </div>
                        </Col>
                    </Row>
                </Card>

            </div>
            <Card title={<><ShoppingCartOutlined style={{ marginRight: "8px" }} /> Purchases ({purchases.length} items)</>} style={{ marginBottom: '20px' }}>
                <TransactionsTableComponent
                    transactions={purchases}
                    role="buyer"
                    showProfileLink={true}
                />
            </Card>

            <Card title={<><DollarCircleOutlined style={{ marginRight: "8px" }} /> Sales ({sales.length} items)</>} style={{ marginBottom: '20px' }}>
                <TransactionsTableComponent
                    transactions={sales}
                    role="seller"
                    showProfileLink={true}
                />
            </Card>

            <Card title={<><AppstoreOutlined style={{ marginRight: "8px" }} /> Ads ({products.length} items)</>}>
                <Table
                    columns={[
                        {
                            title: "Title",
                            dataIndex: "title",
                            key: "title",
                            render: (text, record) => (
                                <Link
                                    to={`/products/${record.id}`}
                                    style={{
                                        color: record.buyerEmail ? "grey" : "",
                                    }}
                                >
                                    {text}
                                </Link>
                            ),
                            sorter: (a, b) => a.title.localeCompare(b.title),
                        },
                        {
                            title: "Category",
                            dataIndex: "category",
                            key: "category",
                            sorter: (a, b) => a.category.localeCompare(b.category),
                        },
                        {
                            title: "Price",
                            dataIndex: "price",
                            key: "price",
                            render: (price) => `${price} €`,
                            sorter: (a, b) => a.price - b.price,
                        },
                        {
                            title: "Publication Date",
                            dataIndex: "date",
                            key: "date",
                            render: (date) => timestampToString(date),
                            sorter: (a, b) => new Date(a.date) - new Date(b.date),
                        },
                        {
                            title: "Status",
                            dataIndex: "buyerEmail",
                            key: "status",
                            render: (buyerEmail) => (
                                buyerEmail ? <Tag color="red">Sold</Tag> : <Tag color="green">Available</Tag>
                            ),
                        },
                    ]}
                    dataSource={products}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    bordered
                    rowClassName={(record) => record.buyerEmail ? "table-row-disabled" : ""}
                    onRow={(record) => ({
                        style: record.buyerEmail ? { opacity: 0.7 } : {}
                    })}
                    locale={{ emptyText: "No ads available" }} 
                />
            </Card>
        </div>
    );
};

export default UserProfilComponent;
