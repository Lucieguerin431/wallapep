import { useState } from "react";
import { modifyStateProperty } from "../../Utils/UtilsState";
import { Card, Col, Row, Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    validateFormDataInputRequired,
    validateFormDataInputEmail,
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
} from "../../Utils/UtilsValidations";

const LoginFormComponent = ({ setLogin, openNotification }) => {
    const navigate = useNavigate();
    const requiredInForm = ["email", "password"];
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({});

    const clickLogin = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

        if (response.ok) {
            let responseBody = await response.json();
            if (responseBody.apiKey && responseBody.email) {
                localStorage.setItem("id", responseBody.id); 
                localStorage.setItem("apiKey", responseBody.apiKey);
                localStorage.setItem("email", responseBody.email);
            }
            setLogin(true);
            openNotification("topRight", "Login successful", "success");
            navigate("/");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            setServerErrors(serverErrors, setFormErrors);
            let notificationMsg = joinAllServerErrorMessages(serverErrors);
            openNotification("topRight", notificationMsg, "error");
        }
    };

    return (
        <Row align="middle" justify="center" style={{ margin: "50px" }}>
            <Col xs={24} style={{ textAlign: "center", marginBottom: "20px" }}>
                <Typography.Title level={3}>Welcome to Wallapep!</Typography.Title>
                <Typography.Paragraph style={{ maxWidth: "400px", margin: "auto" }}>
                    Log in to connect with sellers, and discover unique items. If you're new here, start by creating an account and join our community!
                </Typography.Paragraph>
            </Col>
            <Col xs={24} sm={18} md={12} lg={8}>
                <Card title="Login" style={{ width: "100%", marginTop: "50px" }}>
                    <Form layout="vertical">
                        <Form.Item
                            validateStatus={
                                validateFormDataInputEmail(formData, "email", formErrors, setFormErrors)
                                    ? "success"
                                    : "error"
                            }
                        >
                            <Input
                                placeholder="Your email"
                                prefix={<UserOutlined />}
                                onChange={(i) => {
                                    modifyStateProperty(formData, setFormData, "email", i.currentTarget.value);
                                }}
                            />
                            {formErrors?.email?.msg && (
                                <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>
                            )}
                        </Form.Item>

                        <Form.Item
                            validateStatus={
                                validateFormDataInputRequired(formData, "password", formErrors, setFormErrors)
                                    ? "success"
                                    : "error"
                            }
                        >
                            <Input.Password
                                placeholder="Your password"
                                prefix={<LockOutlined />}
                                onChange={(i) => {
                                    modifyStateProperty(formData, setFormData, "password", i.currentTarget.value);
                                }}
                            />
                            {formErrors?.password?.msg && (
                                <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>
                            )}
                        </Form.Item>

                        <Button
                            type="primary"
                            onClick={clickLogin}
                            block
                            disabled={!allowSubmitForm(formData, formErrors, requiredInForm)}
                        >
                            Login
                        </Button>

                        <Button
                            type="link"
                            onClick={() => navigate("/register")}
                            style={{ marginTop: "15px", display: "block", width: "100%" }}
                        >
                            Create my account
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginFormComponent;
