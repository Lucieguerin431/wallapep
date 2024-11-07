import { Form, Input, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const PaymentFormComponent = () => {
    const [form] = Form.useForm();

    const validateExpiryDate = (_, value) => {
        if (!value || value.length !== 4) {
            return Promise.reject("Enter a valid expiry date (MMYY)");
        }

        const month = parseInt(value.slice(0, 2), 10);
        const year = parseInt("20" + value.slice(2), 10); 

        if (month < 1 || month > 12) {
            return Promise.reject("Enter a valid month between 01 and 12");
        }

        const expiryDate = new Date(year, month - 1); 
        const currentDate = new Date();

        if (
            expiryDate.getFullYear() < currentDate.getFullYear() ||
            (expiryDate.getFullYear() === currentDate.getFullYear() &&
                expiryDate.getMonth() <= currentDate.getMonth())
        ) {
            return Promise.reject("The expiry date must be in the future");
        }

        return Promise.resolve();
    };

    return (
        <Form layout="vertical" name="paymentForm" form={form}>
            <Form.Item
                label="Card Number"
                name="cardNumber"
                rules={[
                    { required: true, message: "Please enter your card number" },
                    { len: 16, message: "Card number must be 16 digits" }
                ]}
            >
                <Input
                    placeholder="1234567812345678"
                    maxLength={16}
                    type="text"
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                />
            </Form.Item>

            <Form.Item
                label="Expiry Date (MMYY)"
                name="expiry"
                rules={[
                    { required: true, message: "Please enter the expiry date (MMYY)" },
                    { validator: validateExpiryDate }
                ]}
            >
                <Input
                    placeholder="MMYY"
                    maxLength={4}
                    type="text"
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                />
            </Form.Item>

            <Form.Item
                label={
                    <span>
                        CVV&nbsp;
                        <Tooltip title="The 3-digit code at the back of your card">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    </span>
                }
                name="cvv"
                rules={[
                    { required: true, message: "Please enter the CVV code" },
                    { len: 3, message: "CVV must be 3 digits" }
                ]}
            >
                <Input.Password placeholder="123" maxLength={3} onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))} />
            </Form.Item>
        </Form>
    );
};

export default PaymentFormComponent;
