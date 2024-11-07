import { useState } from "react";
import { Card, Input, Button, Row, Col, Form, Typography, Upload, Select, notification } from "antd";
import { modifyStateProperty } from "../../Utils/UtilsState";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, PlusCircleTwoTone } from "@ant-design/icons";

const CreateProductComponent = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({});
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const categories = [
        "Electronics", "Clothing", "Furniture", "Toys", "Books", "Sports", "Plants"
    ];

    const onFinish = async (values) => {
        if (!formData.image) {
            setImageError(true);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": localStorage.getItem("apiKey")
                    },
                    body: JSON.stringify({ ...values, image: formData.image })
                });

            if (response.ok) {
                const data = await response.json();
                await uploadImage(data.productId);
                notification.success({
                    message: "Product Created",
                    description: "Your product has been successfully listed!",
                    placement: "topRight"
                });
                navigate("/products/own", { state: { refresh: true } });
            } else {
                const responseBody = await response.json();
                responseBody.errors.forEach(e => {
                    notification.error({
                        message: "Error",
                        description: e.msg,
                        placement: "topRight"
                    });
                });
            }
        } catch (error) {
            notification.error({
                message: "Network Error",
                description: "An error occurred while trying to submit. Please try again later.",
                placement: "topRight"
            });
        }
    };

    const uploadImage = async (productId) => {
        const formDataPhotos = new FormData();
        formDataPhotos.append("image", formData.image);
        formDataPhotos.append("productId", productId);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${productId}/image`, {
                    method: "POST",
                    headers: { "apikey": localStorage.getItem("apiKey") },
                    body: formDataPhotos
                });
            if (!response.ok) {
                const responseBody = await response.json();
                responseBody.errors.forEach(e => console.error("Error: " + e.msg));
            }
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    };

    return (
        <Row align="middle" justify="center" style={{ padding: "20px" }}>
            <Col>
                <Card title={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <PlusCircleTwoTone style={{ fontSize: "24px", marginRight: "8px" }} twoToneColor="#fb3188" />
                            List a New Item
                        </div>
                    }
                    style={{ width: "500px" }}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Item Title"
                            name="title"
                            rules={[{ required: true, message: "Please enter the item title" }]}
                        >
                            <Input
                                onChange={(e) => modifyStateProperty(formData, setFormData, "title", e.target.value)}
                                placeholder="Enter item title"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: "Please provide a description" }]}
                        >
                            <Input.TextArea
                                rows={4}
                                showCount
                                maxLength={200}
                                onChange={(e) => modifyStateProperty(formData, setFormData, "description", e.target.value)}
                                placeholder="Provide a brief description"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Price (€)"
                            name="price"
                            rules={[{ required: true, message: "Please enter the price" }]}
                        >
                            <Input
                                type="number"
                                min={0}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) || e.key === '-') {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => modifyStateProperty(formData, setFormData, "price", e.target.value)}
                                placeholder="Enter the item price"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: "Please select a category" }]}
                        >
                            <Select
                                placeholder="Select a category"
                                onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)}
                            >
                                {categories.map((category) => (
                                    <Select.Option key={category} value={category}>
                                        {category}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Item Image"
                            required
                            validateStatus={imageError ? "error" : ""}
                            help={imageError ? "Please upload an image." : ""}
                        >   
                            <Typography.Text strong style={{ color: "#fa8c16", display: "block", marginBottom: "8px" }}>
                            Note: Once uploaded, the item image cannot be changed.
                            </Typography.Text>
                            <Upload
                                name="image"
                                maxCount={1}
                                beforeUpload={(file) => {
                                    modifyStateProperty(formData, setFormData, "image", file);
                                    setImageError(false);
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload Item Image</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Publish Item
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default CreateProductComponent;