import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Input, Button, Row, Col, Form, Select, notification } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import { modifyStateProperty } from "../../Utils/UtilsState";

const { Option } = Select;

const EditProductComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Uncategorized",
    });

    const categories = [
        'Electronics', 'Clothing', 'Furniture', 'Toys', 'Books', 'Sports', 'Plants'
    ];

    useEffect(() => {
        getProduct(id);
    }, []);

    const getProduct = async (id) => {
        const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            const data = await response.json();
            setFormData({
                title: data.title,
                description: data.description,
                price: data.price,
                category: data.category || "Uncategorized",
            });
        } else {
            const responseBody = await response.json();
            responseBody.errors.forEach(e => {
                notification.error({
                    message: "Error",
                    description: e.msg,
                });
            });
        }
    };

    const clickEditProduct = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("category", formData.category || "Uncategorized");

        const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
            method: "PUT",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
            body: formDataToSend
        });

        if (response.ok) {
            notification.success({
                message: "Product Updated",
                description: "Your product has been successfully updated.",
                placement: "bottomRight"
            });
            navigate("/products/own");
        } else {
            const responseBody = await response.json();
            responseBody.errors.forEach(e => {
                notification.error({
                    message: "Update Error",
                    description: e.msg,
                });
            });
        }
    };

    return (
        <Row align="middle" justify="center" style={{ padding: "20px" }}> 
            <Col>
                <Card
                    title={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <EditTwoTone style={{ fontSize: "24px", marginRight: "8px" }} twoToneColor="#007bff" />
                            Edit Product
                        </div>
                    }
                    style={{ width: "500px" }}
                >
                    <Form layout="vertical">
                        <Form.Item label="Change Product Title">
                            <Input
                                value={formData.title}
                                onChange={(e) => modifyStateProperty(formData, setFormData, "title", e.target.value)}
                                placeholder="Enter new product title"
                            />
                        </Form.Item>

                        <Form.Item label="Update Description">
                            <Input.TextArea
                                rows={4}
                                showCount
                                maxLength={200}
                                value={formData.description}
                                onChange={(e) => modifyStateProperty(formData, setFormData, "description", e.target.value)}
                                placeholder="Enter new product description"
                            />
                        </Form.Item>

                        <Form.Item label="Change Price (€)">
                            <Input
                                type="number"
                                min={0}
                                value={formData.price}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key) || e.key === '-') {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => modifyStateProperty(formData, setFormData, "price", e.target.value)}
                                placeholder="Enter new price"
                            />
                        </Form.Item>

                        <Form.Item label="Change Category">
                            <Select
                                value={formData.category}
                                onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)}
                                placeholder="Select a category"
                            >
                                {categories.map((category) => (
                                    <Option key={category} value={category}>
                                        {category}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Button type="primary" block onClick={clickEditProduct}>
                            Save Changes
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default EditProductComponent;
