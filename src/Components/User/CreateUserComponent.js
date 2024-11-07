import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Typography, notification, Card, Row, Col } from "antd";

const { Title } = Typography;
const { Option } = Select;

const CreateUserComponent = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [countries, setCountries] = useState([]);

    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            notification.error({
                message: "Password Mismatch",
                description: "Passwords do not match. Please try again.",
            });
            return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    surname: values.surname,
                    email: values.email,
                    password: values.password,
                    country: values.country,
                }),
            });

            if (response.ok) {
                notification.success({
                    message: "Registration Successful",
                    description: "Your account has been created.",
                });
                navigate("/login");
            } else {
                const responseBody = await response.json();
                responseBody.errors.forEach(e => {
                    notification.error({
                        message: "Registration Error",
                        description: e.msg,
                    });
                });
            }
        } catch (error) {
            notification.error({
                message: "Network Error",
                description: "An error occurred while trying to register. Please try again later.",
            });
        }
    };

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then((response) => response.json())
            .then((data) => {
                const countryList = data
                    .map((country) => ({
                        name: country.name.common,
                        code: country.cca2,
                        flag: country.flags.png,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryList);
            });
    }, []);

    return (
        <Row align="middle" justify="center" style={{ minHeight: "80vh" }}>
            <Col xs={24} sm={16} md={10} lg={8}>
                <Card style={{ padding: "30px", backgroundColor: "white", borderRadius: "8px" }}>
                    <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                        Create My Account
                    </Title>
                    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: "Please enter your name" }]}
                            onInput={(e) => (e.target.value = e.target.value.replace(/[^a-zA-Z]/g, ""))}

                        >
                            <Input placeholder="Enter your name" />
                        </Form.Item>

                        <Form.Item
                            label="Surname"
                            name="surname"
                            rules={[{ required: true, message: "Please enter your surname" }]}
                            onInput={(e) => (e.target.value = e.target.value.replace(/[^a-zA-Z]/g, ""))}
                        >
                            <Input placeholder="Enter your surname" />
                        </Form.Item>

                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: "Please select your country" }]}
                        >
                            <Select placeholder="Select your country" showSearch>
                                {countries.map((country) => (
                                    <Option key={country.code} value={country.name}>
                                        <img
                                            src={country.flag}
                                            alt={country.name}
                                            style={{ width: "20px", marginRight: "8px" }}
                                        />
                                        {country.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: "Please enter your password" },
                                { min: 4, message: "Password must be at least 4 characters" },
                            ]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            rules={[{ required: true, message: "Please confirm your password" }]}
                        >
                            <Input.Password placeholder="Confirm your password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Register
                            </Button>
                        </Form.Item>

                        <Button
                            type="link"
                            onClick={() => navigate("/login")}
                            style={{ display: "block", width: "100%", textAlign: "center", marginTop: "10px" }}
                        >
                            Already have an account? Log in
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default CreateUserComponent;
