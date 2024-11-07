import React from 'react';
import { Form, Input, Button, Select, Upload, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProductForm = ({
    formData,
    setFormData,
    categories,
    onFinish,
    imageError,
    setImageError,
    isEdit = false,
    buttonText = "Submit"
}) => {
    return (
        <Form layout="vertical" onFinish={onFinish} initialValues={formData}>
            <Form.Item
                label="Item Title"
                name="title"
                rules={[{ required: true, message: "Please enter the item title" }]}
            >
                <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter item title"
                    allowClear
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
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a brief description"
                    allowClear
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
                    value={formData.price}
                    onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter the item price"
                />
            </Form.Item>

            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select a category" }]}
            >
                <Select
                    value={formData.category}
                    onChange={(value) => setFormData({ ...formData, category: value })}
                    placeholder="Select a category"
                    allowClear
                >
                    {categories.map((category) => (
                        <Option key={category} value={category}>
                            {category}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            {!isEdit && (
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
                            setFormData({ ...formData, image: file });
                            setImageError(false);
                            return false;
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload Item Image</Button>
                    </Upload>
                </Form.Item>
            )}

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {buttonText}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
