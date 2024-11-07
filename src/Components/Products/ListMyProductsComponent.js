import { useState, useEffect } from 'react';
import { Table, Button, Input, Popconfirm, Space, Typography, notification, Row, Col, Card, Tag } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined, EditOutlined, DeleteOutlined, AppstoreTwoTone } from "@ant-design/icons";

let ListMyProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        getMyProducts();
    }, []);

    const getMyProducts = async () => {
        setLoading(true);
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/own/",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            jsonData.map((product) => {
                product.key = product.id;
                return product;
            });
            jsonData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setProducts(jsonData);
            setFilteredProducts(jsonData);
            calculateTotalSales(jsonData);
            setLoading(false);
        } else {
            let responseBody = await response.json();
            responseBody.errors.forEach((e) => console.log("Error: " + e.msg));
        }
    };

    const calculateTotalSales = (products) => {
        const total = products
            .filter((product) => product.buyerEmail)
            .reduce((acc, product) => acc + product.price, 0);
        setTotalSales(total);
    };

    const handleSearchChange = (event) => {
        const { value } = event.target;
        const filtered = products.filter((p) =>
            p.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered.length ? filtered : products);
    };

    const deleteProduct = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            }
        );

        if (response.ok) {
            const updatedProducts = products.filter((p) => p.id !== id);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            calculateTotalSales(updatedProducts);

            notification.success({
                message: 'Product Deleted',
                description: 'The product has been successfully deleted.',
                placement: 'bottomRight',
            });
        } else {
            let responseBody = await response.json();
            responseBody.errors.forEach((e) => console.log("Error: " + e.msg));
        }
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <Link to={`/products/${record.id}`}>{text}</Link>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            filters: [
                { text: 'Electronics', value: 'Electronics' },
                { text: 'Clothing', value: 'Clothing' },
                { text: 'Furniture', value: 'Furniture' },
                { text: 'Toys', value: 'Toys' },
                { text: 'Books', value: 'Books' },
                { text: 'Sports', value: 'Sports' },
                { text: 'Plants', value: 'Plants' }
            ],
            onFilter: (value, record) => record.category === value,
            key: "category",
        },
        {
            title: "Price (€)",
            dataIndex: "price",
            sorter: (a, b) => a.price - b.price,
            align: "left",
            key: "price",
            render: (price) => `${price} €`,
        },
        {
            title: "Publication Date",
            dataIndex: "date",
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            key: "date",
        },
        {
            title: "Buyer",
            dataIndex: "buyerEmail",
            render: (_, product) =>
                product.buyerEmail ? (
                    <Link style={{color:"#fb3188"}} to={`/users/${product.buyerId}`}>{product.buyerEmail}</Link>
                ) : (
                    <p style={{ color: "gray"}}>Not yet sold</p>
                ),
            key: "buyer",
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (_, record) => (
                <Space size="small">
                    {!record.buyerEmail ? (
                        <Link to={`/products/edit/${record.id}`}>
                            <EditOutlined style={{ color: "#1890ff" }} />
                        </Link>
                    ) : (
                        <span><Tag color="red">Sold</Tag></span>
                    )}
                    {!record.buyerEmail && (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => deleteProduct(record.id)}
                        >
                            <Button danger type="link" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            ),
            key: "actions",
        },
    ];

    return (
        <div style={{ padding: "20px 50px" }}>
            <Typography.Title level={2} style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
                <AppstoreTwoTone style={{ fontSize: "32px", marginRight: "10px", lineHeight: "1" }} twoToneColor="#007bff" /> 
                My Ads
            </Typography.Title>
            <Typography.Title level={5} style={{ marginBottom: "30px", color: "gray" }}>
                Here you can manage your ads: edit, delete, or view details of each item you've posted.
            </Typography.Title>
            
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                    <Col>
                        <Input
                            placeholder="Search by title"
                            onChange={handleSearchChange}
                            allowClear
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col>
                        <Typography.Text
                            strong
                            style={{
                                fontSize: "18px",
                                color: "#fb398d", 
                                fontWeight: "bold",
                                backgroundColor: "#FFE3E1",
                                padding: "5px 10px",
                                borderRadius: "5px",
                            }}
                        >
                            Total Sales: {totalSales} €
                        </Typography.Text>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 8, position: ["bottomRight"] }}
                    bordered
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    onRow={(record, index) => ({
                        style: { backgroundColor: index % 2 !== 0 ? "#f8f8f8" : "#ffffff" }
                    })}
                    locale={{ emptyText: "No ads available" }} 
                />
            </Card>
        </div>
    );
};

export default ListMyProductsComponent;
