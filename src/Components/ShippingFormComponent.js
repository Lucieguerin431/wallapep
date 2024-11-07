import { Form, Input, Select, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const ShippingFormComponent = ({ initialCountry }) => {
    const [countries, setCountries] = useState(["France", "Germany", "Spain", "Italy", "United States"]);

    return (
        <Form layout="vertical" name="shippingForm" >
            <div  style={{marginBottom:"30px"}}>
                <Text type="secondary">
                    Please enter your shipping address. The package will be delivered within 4 days.
                </Text>
            </div>

            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please enter your address" }]}
            >
                <Input placeholder="123 Green Street" />
            </Form.Item>

            <Form.Item
                label="Postal Code"
                name="postalCode"
                rules={[{ required: true, message: "Please enter your postal code" }]}
            >
                <Input placeholder="75001" />
            </Form.Item>

            <Form.Item
                label="Country"
                name="country"
                initialValue={initialCountry}
                rules={[{ required: true, message: "Please select your country" }]}
            >
                <Select>
                    {countries.map((country) => (
                        <Select.Option key={country} value={country}>
                            {country}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};

export default ShippingFormComponent;
