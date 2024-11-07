// components/ProductFormFields.js
import { Form, Input, Select } from "antd";
import { modifyStateProperty } from "../../Utils/UtilsState";

const { Option } = Select;

const ProductFormFields = ({ formData, setFormData, categories }) => (
    <>
        <Form.Item
            label="Item Title"
            name="title"
            rules={[{ required: true, message: "Please enter the item title" }]}
        >
            <Input
                value={formData.title}
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
                value={formData.description}
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
                value={formData.price}
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
                value={formData.category}
                onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)}
            >
                {categories.map((category) => (
                    <Option key={category} value={category}>
                        {category}
                    </Option>
                ))}
            </Select>
        </Form.Item>
    </>
);

export default ProductFormFields;
